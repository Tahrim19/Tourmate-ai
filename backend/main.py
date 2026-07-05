"""
TourMate AI — FastAPI Backend
Multi-Agent Tourism Assistant using Google ADK
"""
import os
import uuid
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dotenv import load_dotenv
load_dotenv()

from google.adk.runners import InMemoryRunner
from google.adk.sessions import InMemorySessionService
from google.genai import types as genai_types

from agents.tourmate_agents import orchestrator_agent

APP_NAME = "tourmate_ai"

runners: dict[str, InMemoryRunner] = {}
session_ids: dict[str, str] = {}


def get_or_create_runner(user_id: str) -> InMemoryRunner:
    if user_id not in runners:
        runners[user_id] = InMemoryRunner(
            agent=orchestrator_agent,
            app_name=APP_NAME,
        )
    return runners[user_id]


async def get_or_create_session(runner: InMemoryRunner, user_id: str) -> str:
    """FIXED: await the async create_session call."""
    if user_id not in session_ids:
        session = await runner.session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
        )
        session_ids[user_id] = session.id
    return session_ids[user_id]


app = FastAPI(title="TourMate AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    city: str = ""
    user_id: str = ""


class QuickRequest(BaseModel):
    city: str
    category: str
    user_id: str = ""


@app.get("/")
async def root():
    return {"message": "TourMate AI backend is running", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok", "app": "TourMate AI"}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        user_id = req.user_id or str(uuid.uuid4())
        runner = get_or_create_runner(user_id)
        session_id = await get_or_create_session(runner, user_id)

        message = req.message
        if req.city and req.city.lower() not in message.lower():
            message = f"[User is in {req.city}] {message}"

        content = genai_types.Content(
            role="user",
            parts=[genai_types.Part(text=message)]
        )

        response_text = ""
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
        ):
            if hasattr(event, "content") and event.content:
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        response_text += part.text

        if not response_text:
            response_text = (
                "I'm here to help with your travel plans! "
                "Ask me about attractions, food, or itinerary planning. 🌍"
            )

        return JSONResponse({
            "response": response_text,
            "user_id": user_id,
            "session_id": session_id,
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {
                "error": str(e),
                "response": "Sorry, I encountered an issue. Please try again!",
            },
            status_code=500,
        )


@app.post("/api/quick")
async def quick_recommend(req: QuickRequest):
    try:
        user_id = req.user_id or str(uuid.uuid4())
        runner = get_or_create_runner(user_id)
        session_id = await get_or_create_session(runner, user_id)

        prompts = {
            "attractions": (
                f"What are the top attractions, landmarks, and places to visit in {req.city}? "
                f"Give me a great list!"
            ),
            "food": (
                f"What are the must-try foods, best restaurants and street food spots in {req.city}?"
            ),
            "parks": (
                f"What are the best parks, beaches, and nature spots in {req.city} "
                f"for relaxing or outdoor activities?"
            ),
            "itinerary": (
                f"Create a 1-day itinerary for someone visiting {req.city} for the first time. "
                f"Make it fun and well-paced!"
            ),
        }

        message = prompts.get(req.category, f"Tell me about {req.city} for tourists.")
        if req.city.lower() not in message.lower():
            message = f"[User is in {req.city}] {message}"

        content = genai_types.Content(
            role="user",
            parts=[genai_types.Part(text=message)]
        )

        response_text = ""
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content,
        ):
            if hasattr(event, "content") and event.content:
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        response_text += part.text

        if not response_text:
            response_text = f"Here are some great tips for {req.city}! Ask me anything specific."

        return JSONResponse({
            "response": response_text,
            "user_id": user_id,
            "session_id": session_id,
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {
                "error": str(e),
                "response": "Sorry, I couldn't get recommendations right now. Please try again!",
            },
            status_code=500,
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
