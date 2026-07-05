# """
# TourMate AI - Multi-Agent System using Google ADK
# Agents use Google Search as their primary tool — no static knowledge base.
# Works for any city worldwide.
# """

# from google.adk.agents import Agent
# from google.adk.tools import FunctionTool
# from google.adk.tools.google_search_tool import GoogleSearchTool

# MODEL = "gemini-2.5-flash"

# # Google Search tool with bypass so agents can use other tools alongside it
# search_tool = GoogleSearchTool(bypass_multi_tools_limit=True)

# # ─────────────────────────────────────────────
# # 1. LOCATION AGENT (Now accepts any city)
# # ─────────────────────────────────────────────

# location_agent = Agent(
#     name="location_agent",
#     model=MODEL,
#     description="Identifies and confirms the user's city. Works for any city worldwide.",
#     instruction="""You are the Location Agent for TourMate AI.

# Your job:
# 1. Identify what city the user is in or asking about
# 2. Confirm the city warmly and set context
# 3. If the city is in Pakistan, mention it enthusiastically
# 4. If the city is international, acknowledge it equally warmly

# Always respond starting with: 📍 **[City Name]**

# Keep it short and friendly. You are just confirming location, not giving recommendations.
# """,
#     tools=[],
# )

# # ─────────────────────────────────────────────
# # 2. ATTRACTION AGENT (Any city)
# # ─────────────────────────────────────────────

# attraction_agent = Agent(
#     name="attraction_agent",
#     model=MODEL,
#     description="Recommends top tourist attractions, landmarks, beaches, parks, and hidden gems in any city using live web search.",
#     instruction="""You are the Attraction Agent for TourMate AI.

# Your job: Find and recommend the best places to visit in the given city.

# Steps:
# 1. Use google_search to find up-to-date attractions. Use targeted queries like:
#    - "best tourist attractions in [city] 2026"
#    - "hidden gems [city]"
#    - "things to do in [city]"
#    - "best beaches parks [city]" (if coastal)
#    - "historical sites [city]"
# 2. Synthesize results into clear, helpful recommendations

# Format your response:
# 🏛️ **Top Attractions**
# [list with brief descriptions]

# 🌳 **Parks & Nature**
# [list]

# 💎 **Hidden Gems**
# [lesser known spots worth visiting]

# 💡 **Tips**
# [1-2 practical visitor tips]

# Be specific — include real names and brief reasons why each is worth visiting.
# """,
#     tools=[search_tool],
# )

# # ─────────────────────────────────────────────
# # 3. FOOD AGENT (Any city)
# # ─────────────────────────────────────────────

# food_agent = Agent(
#     name="food_agent",
#     model=MODEL,
#     description="Recommends the best local food, restaurants, street food spots, and must-try dishes in any city using live web search.",
#     instruction="""You are the Food Agent for TourMate AI.

# Your job: Help users discover the best food and dining in their city.

# Steps:
# 1. Use google_search with targeted queries like:
#    - "best restaurants in [city] 2026"
#    - "must try street food [city]"
#    - "famous local dishes [city]"
#    - "best food streets [city]"
#    - "top rated cafes [city]"
# 2. Synthesize into genuine, helpful recommendations

# Format:
# 🍜 **Must-Try Dishes**
# [local specialties with context]

# 🏪 **Best Restaurants & Food Spots**
# [top places with what they're known for]

# 🌮 **Street Food**
# [street food areas and stalls]

# ☕ **Cafes & Desserts**
# [popular cafes, sweet spots]

# 💡 **Food Tips**
# [best time to go, what to avoid, budget tips]

# Be specific about what each place is famous for. Make it appetizing!
# """,
#     tools=[search_tool],
# )

# # ─────────────────────────────────────────────
# # 4. ITINERARY PLANNER AGENT (Any city)
# # ─────────────────────────────────────────────

# itinerary_agent = Agent(
#     name="itinerary_planner_agent",
#     model=MODEL,
#     description="Creates personalized day-by-day travel itineraries for any city by searching for current recommendations.",
#     instruction="""You are the Itinerary Planner Agent for TourMate AI.

# Your job: Create detailed, realistic, enjoyable itineraries.

# Steps:
# 1. Search for current info using google_search:
#    - "best day trip itinerary [city] 2026"
#    - "top things to do [city] in one day"
#    - "travel guide [city] [year]"
# 2. Build a practical, balanced itinerary

# Format each day clearly:
# ---
# 🗓️ **Day [N] — [Theme, e.g. "History & Culture"]**

# 🌅 **Morning (9:00 AM – 12:00 PM)**
# - [Activity] — [why it's great, practical tip]

# ☀️ **Afternoon (12:00 PM – 5:00 PM)**
# - [Activity + lunch spot]

# 🌙 **Evening (5:00 PM – 9:00 PM)**
# - [Activity + dinner recommendation]

# 🚗 **Getting Around:** [transport tips]
# 💰 **Budget Tip:** [cost-saving advice]
# ---

# Be realistic about travel times between locations. Make it feel like a real trip!
# """,
#     tools=[search_tool],
# )

# # ─────────────────────────────────────────────
# # 5. ORCHESTRATOR AGENT (Master)
# # ─────────────────────────────────────────────

# orchestrator_agent = Agent(
#     name="orchestrator_agent",
#     model=MODEL,
#     description="Master agent that understands user intent and routes to the right specialized agent for any city worldwide.",
#     instruction="""You are the Orchestrator for TourMate AI — an AI-powered tourism assistant for ANY city in the world.

# Your routing logic:
# - User asks about a city or location → location_agent
# - User asks about places to visit, things to do, landmarks, beaches, parks → attraction_agent
# - User asks about food, restaurants, what to eat, local cuisine, street food → food_agent
# - User asks to plan a trip, create an itinerary, plan their day → itinerary_planner_agent

# Rules:
# 1. Always pass the city name clearly to the sub-agent
# 2. If no city is mentioned, ask which city they want to explore
# 3. For general greetings or questions about the app, respond directly without routing

# Be warm, enthusiastic, and travel-obsessed! 🌍
# You love helping people discover the best of every city.
# """,
#     sub_agents=[location_agent, attraction_agent, food_agent, itinerary_agent],
# )



"""
TourMate AI - Multi-Agent System using Google ADK + Vertex AI
Single custom tool that combines web search + Maps API to avoid
Vertex AI's "multiple tools" limitation.
"""

import os
import json
import httpx
from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from google import genai
from google.genai import types

MODEL = "gemini-2.5-flash"
MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")


# ═══════════════════════════════════════════════════════════════════════
# SINGLE UNIFIED TOOL: Search + Maps
# Vertex AI allows multiple FunctionTools, but NOT mixing GoogleSearchTool + FunctionTool
# So we build ONE FunctionTool that handles everything internally
# ═══════════════════════════════════════════════════════════════════════

def search_and_locate(query: str, city: str = "", search_type: str = "general") -> str:
    """
    Unified search tool. Handles web search, place search, and nearby search.
    This is the ONLY tool agents use — avoiding Vertex AI's multi-tool restriction.
    
    search_type options:
    - "general" → web search for info
    - "places_text" → Google Maps text search (restaurants, malls, parks, etc.)
    - "places_nearby" → Google Maps nearby search (requires lat/lng)
    """
    results = {"web_results": "", "places": [], "query": query, "city": city}
    
    # ── 1. Web Search via Gemini with Google Search grounding ──
    try:
        client = genai.Client(
            vertexai=True,
            project=os.getenv("GOOGLE_CLOUD_PROJECT"),
            location=os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
        )
        response = client.models.generate_content(
            model=MODEL,
            contents=f"Search the web and summarize: {query}",
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearchRetrieval())]
            )
        )
        results["web_results"] = response.text
    except Exception as e:
        results["web_results"] = f"Web search error: {e}"
    
    # ── 2. Google Maps Places Text Search ──
    if MAPS_API_KEY and search_type in ("places_text", "general"):
        try:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            search_query = f"{query} in {city}" if city else query
            params = {"query": search_query, "key": MAPS_API_KEY}
            
            r = httpx.get(url, params=params, timeout=10.0)
            data = r.json()
            for place in data.get("results", [])[:5]:
                results["places"].append({
                    "name": place.get("name"),
                    "rating": place.get("rating"),
                    "address": place.get("formatted_address"),
                    "types": place.get("types", [])[:2],
                })
        except Exception as e:
            results["places_error"] = str(e)
    
    return json.dumps(results, indent=2)


# Wrap as the ONLY ADK tool
tourmate_tool = FunctionTool(search_and_locate)


# ═══════════════════════════════════════════════════════════════════════
# AGENTS (all use the same single tool)
# ═══════════════════════════════════════════════════════════════════════

location_agent = Agent(
    name="location_agent",
    model=MODEL,
    description="Identifies and confirms the user's city.",
    instruction="""You are the Location Agent.

Your job: Identify the city and confirm it warmly.
Always start with: 📍 **[City Name]**
Keep it under 2 sentences. Do NOT give recommendations.""",
    tools=[],
)

attraction_agent = Agent(
    name="attraction_agent",
    model=MODEL,
    description="Recommends attractions, parks, malls, museums in any city.",
    instruction="""You are the Attraction Agent.

MANDATORY: Use search_and_locate for EVERY query.
- For attractions: query="top attractions in [city]", search_type="places_text"
- For parks: query="parks in [city]", search_type="places_text"
- For malls: query="shopping malls in [city]", search_type="places_text"

CRITICAL RULES:
- NEVER make up place names. Only use results from the tool.
- Include real ratings (⭐) and addresses when available.

FORMAT:
🏛️ **Top Attractions**
🌳 **Parks & Nature**
🛍️ **Shopping & Malls**
💎 **Hidden Gems**
💡 **Tips**""",
    tools=[tourmate_tool],
)

food_agent = Agent(
    name="food_agent",
    model=MODEL,
    description="Recommends food, restaurants, cafes in any city.",
    instruction="""You are the Food Agent.

MANDATORY: Use search_and_locate for EVERY query.
- For restaurants: query="best restaurants in [city]", search_type="places_text"
- For cafes: query="top cafes in [city]", search_type="places_text"
- For street food: query="street food in [city]", search_type="general"

CRITICAL RULES:
- NEVER invent restaurant names.
- Include star ratings (⭐) and addresses from tool results.

FORMAT:
🍜 **Must-Try Dishes**
🏪 **Best Restaurants**
🌮 **Street Food**
☕ **Cafes & Desserts**
💡 **Food Tips**""",
    tools=[tourmate_tool],
)

itinerary_agent = Agent(
    name="itinerary_planner_agent",
    model=MODEL,
    description="Creates travel itineraries for any city.",
    instruction="""You are the Itinerary Planner.

MANDATORY: Use search_and_locate for EVERY query.
- For itinerary: query="best day trip itinerary [city]", search_type="general"
- For lunch spots: query="restaurants near [attraction] [city]", search_type="places_text"

CRITICAL RULES:
- ONLY use real place names from tool results.
- Include actual addresses so user can navigate.
- Estimate realistic travel times.

FORMAT:
🗓️ **Day [N] — [Theme]**
🌅 **Morning**
☀️ **Afternoon**
🌙 **Evening**
🚗 **Getting Around**
💰 **Budget Estimate**""",
    tools=[tourmate_tool],
)

orchestrator_agent = Agent(
    name="orchestrator_agent",
    model=MODEL,
    description="Master agent for any city worldwide.",
    instruction="""You are the Orchestrator for TourMate AI.

ROUTING:
- City/location → location_agent
- Places to visit, landmarks, parks, malls, museums → attraction_agent
- Food, restaurants, cafes → food_agent
- Trip planning, itinerary → itinerary_agent

RULES:
1. ALWAYS pass city name to sub-agent.
2. If no city, ask: "Which city are you in?"
3. Be warm and travel-obsessed! 🌍""",
    sub_agents=[location_agent, attraction_agent, food_agent, itinerary_agent],
)