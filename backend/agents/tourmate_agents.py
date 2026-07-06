"""
TourMate AI - Multi-Agent System using Google ADK + Vertex AI
"""

import os
import json
import logging
import httpx
from functools import lru_cache
from dotenv import load_dotenv

from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from google import genai
from google.genai import types

# ═══════════════════════════════════════════════════════════════════════
# ENVIRONMENT SETUP (MUST BE FIRST)
# ═══════════════════════════════════════════════════════════════════════
load_dotenv()

MODEL = "gemini-2.5-flash"
MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION")

logger = logging.getLogger(__name__)

# Validate key at startup
if not MAPS_API_KEY or len(MAPS_API_KEY) < 30:
    logger.warning("⚠️ GOOGLE_MAPS_API_KEY not set or invalid. Places API disabled.")
else:
    logger.info(f"✅ Maps API key loaded ({MAPS_API_KEY[:10]}...)")


# ═══════════════════════════════════════════════════════════════════════
# SINGLE UNIFIED TOOL: Search + Maps
# ═══════════════════════════════════════════════════════════════════════

VALID_SEARCH_TYPES = {"general", "places_text", "places_nearby"}

async def search_and_locate(query: str, city: str = "", search_type: str = "general") -> str:
    """
    Unified search tool.
    search_type:
    - "general" → web search only
    - "places_text" → web search + Maps text search
    - "places_nearby" → Maps nearby search (requires lat/lng - not yet implemented)
    """
    # Input validation
    if not query or len(query) > 200:
        return json.dumps({"error": "Invalid query: must be 1-200 chars"})
    if search_type not in VALID_SEARCH_TYPES:
        return json.dumps({"error": f"Invalid search_type: {search_type}. Use: {VALID_SEARCH_TYPES}"})
    
    results = {
        "web_results": "",
        "places": [],
        "places_note": "",
        "query": query,
        "city": city,
        "search_type": search_type
    }
    
    # ── 1. Web Search via Gemini ──
    try:
        client = genai.Client(
            vertexai=True,
            project=GOOGLE_CLOUD_PROJECT,
            location=GOOGLE_CLOUD_LOCATION
        )
        response = client.models.generate_content(
            model=MODEL,
            contents=f"Search the web and summarize: {query}",
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())]  # or GoogleSearchRetrieval
            )
        )
        results["web_results"] = response.text
    except Exception as e:
        logger.error(f"Web search error: {e}")
        results["web_results"] = f"Web search error: {e}"
    
    # ── 2. Google Maps Places Text Search (ONLY for places_text) ──
    if MAPS_API_KEY and search_type == "places_text":
        try:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            search_query = f"{query} in {city}" if city else query
            params = {"query": search_query, "key": MAPS_API_KEY}
            
            async with httpx.AsyncClient() as client:
                r = await client.get(url, params=params, timeout=10.0)
                data = r.json()
            
            status = data.get("status")
            if status != "OK":
                error_msg = data.get("error_message", "Unknown error")
                results["places_error"] = f"Places API error: {status} - {error_msg}"
                logger.warning(f"Places API failed: {status} - {error_msg}")
            else:
                places = data.get("results", [])
                logger.info(f"Places API returned {len(places)} results")
                
                if not places:
                    results["places_note"] = "No places found for this query. Do NOT invent places."
                else:
                    for place in places[:5]:
                        results["places"].append({
                            "name": place.get("name"),
                            "rating": place.get("rating"),
                            "address": place.get("formatted_address"),
                            "types": place.get("types", [])[:2],
                        })
        except Exception as e:
            logger.error(f"Places API exception: {e}")
            results["places_error"] = f"Places API exception: {str(e)}"
    
    elif search_type == "places_nearby":
        results["places_note"] = "Nearby search not yet implemented. Use 'places_text' instead."
    
    return json.dumps(results, indent=2)


tourmate_tool = FunctionTool(search_and_locate)


# ═══════════════════════════════════════════════════════════════════════
# AGENTS
# ═══════════════════════════════════════════════════════════════════════

location_agent = Agent(
    name="location_agent",
    model=MODEL,
    description="Identifies and confirms the user's city.",
    instruction="""You are the Location Agent.

Your ONLY job: Identify the city from the user's message and confirm it.
- If city is clear: respond with "📍 **[City Name]** — Got it!"
- If unclear: ask "Which city are you in?"
- NEVER give recommendations or food/attraction info.

Keep it under 2 sentences.""",
    tools=[],
)

attraction_agent = Agent(
    name="attraction_agent",
    model=MODEL,
    description="Recommends attractions using live data only.",
    instruction="""You are the Attraction Agent. You have NO pre-existing knowledge of cities.

MANDATORY: Call search_and_locate for EVERY query.
- query: "top attractions in [city]", search_type: "places_text"
- query: "parks in [city]", search_type: "places_text"
- query: "museums in [city]", search_type: "places_text"

CRITICAL RULES:
1. You MUST use the tool. Do NOT answer from memory.
2. Parse the tool's JSON response. Use ONLY names from the "places" array.
3. If "places" is empty, say "No places found in our database" — do NOT invent any.
4. Include real ratings (⭐) and addresses (📍) from the tool.

OUTPUT FORMAT:
🏛️ **Top Attractions**
* **Name** — ⭐X.X/5 — [description from web_results]
  📍 [address from places array]

🌳 **Parks & Nature**
[Same format]

🛍️ **Shopping & Malls**
[Same format]

💡 **Visitor Tips**
* [1-2 tips from web_results]""",
    tools=[tourmate_tool],
)

food_agent = Agent(
    name="food_agent",
    model=MODEL,
    description="Recommends food and restaurants using live data only.",
    instruction="""You are the Food Agent. You have ZERO knowledge of restaurants.

MANDATORY: Call search_and_locate for EVERY query.
- For restaurants: query="best restaurants in [city]", search_type="places_text"
- For cafes: query="top cafes in [city]", search_type="places_text"
- For street food/general info: query="street food in [city]", search_type="general"

CRITICAL RULES:
1. You MUST use the tool. Do NOT answer from memory.
2. For restaurants/cafes, parse the "places" array. Use ONLY real names from it.
3. If "places" is empty, say "No restaurants found in our database" — do NOT invent any.
4. Include star ratings (⭐) and addresses (📍) from the tool.
5. For street food (general search), use web_results only — no places data expected.

OUTPUT FORMAT:
🍜 **Must-Try Dishes**
* [Dish] — [why special, from web_results]

🏪 **Best Restaurants**
* **Name** — ⭐[rating]/5 — [cuisine]
  📍 [address from places array]

🌮 **Street Food**
* [Info from web_results only]

☕ **Cafes & Desserts**
* **Name** — ⭐[rating]/5
  📍 [address]

💡 **Food Tips**
* [Tips from web_results]""",
    tools=[tourmate_tool],
)

itinerary_agent = Agent(
    name="itinerary_planner_agent",
    model=MODEL,
    description="Creates travel itineraries using live data only.",
    instruction="""You are the Itinerary Planner. You have NO pre-existing knowledge of cities.

MANDATORY: Call search_and_locate for EVERY query.
- For itinerary ideas: query="best day trip [city]", search_type="general"
- For lunch/dinner spots: query="restaurants near [landmark] [city]", search_type="places_text"

CRITICAL RULES:
1. You MUST use the tool. Do NOT answer from memory.
2. Use ONLY real place names from the "places" array.
3. If "places" is empty, say "No places found" — do NOT invent locations.
4. Include real addresses from the tool so users can navigate.

OUTPUT FORMAT:
🗓️ **Day [N] — [Theme]**

🌅 **Morning**
* [Activity at Real Place] — ⭐[rating]
  📍 [address]

☀️ **Afternoon**
* [Lunch at Real Place] — ⭐[rating]
  📍 [address]

🌙 **Evening**
* [Dinner/activity]

🚗 **Getting Around**
💰 **Budget Estimate**""",
    tools=[tourmate_tool],
)

orchestrator_agent = Agent(
    name="orchestrator_agent",
    model=MODEL,
    description="Master router for TourMate AI.",
    instruction="""You are the Orchestrator for TourMate AI.

ROUTING RULES — Be strict:
- City mentioned, "where am I", location check → location_agent
- Places to visit, landmarks, parks, malls, museums, monuments, beaches → attraction_agent
- ANY food word: eat, hungry, restaurant, cafe, biryani, dinner, lunch, breakfast, street food, pizza → food_agent
- Trip planning, itinerary, schedule, plan my day → itinerary_agent
- "what can you do", greeting → Answer directly

CONTEXT RULES:
1. ALWAYS pass the city to sub-agents. If unclear, ask the user.
2. If user says "near me" or "nearby" without a city → ask "Which city?"
3. If user mentions a landmark (e.g., "near Badshahi Mosque"), include it in context.
4. For greetings: "Hey there! 🌍 Which city are you exploring?"

TONE: Warm, enthusiastic, use emojis naturally. Keep routing under 2 sentences.""",
    sub_agents=[location_agent, attraction_agent, food_agent, itinerary_agent],
)