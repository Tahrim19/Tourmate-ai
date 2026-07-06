# TourMate AI

> Your AI-powered travel companion for exploring any city worldwide.

TourMate AI helps tourists discover attractions, food, and plan itineraries using live data from Google Search and Google Maps Places API. Built with a multi-agent backend and a modern React frontend.

---

## Features

- **Smart City Input** — Enter any city worldwide (no restrictions)
- **Natural Language Chat** — Ask anything: "What to do in Lahore?", "Best biryani in Karachi", "Plan my day"
- **Four Agent Modes** (Auto-Routed):
  - **Discover** — Attractions, landmarks, parks, malls, museums
  - **Eat** — Restaurants, street food, cafes, must-try dishes
  - **Nature** — Parks, outdoor spots, walking areas
  - **Plan** — Day-by-day itineraries with time blocks
- **Live Data Integration** — Real-time info from Google Search + Google Maps Places API (ratings, addresses, open hours)
- **Multi-Turn Memory** — Remembers your city across messages
- **Rich UI Cards** — Parsed responses with ⭐ ratings, 📍 addresses, and structured sections

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI, Google ADK, Vertex AI (Gemini 2.5 Flash), Google Maps Places API |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Lucide React |
| **Deployment** | Google Cloud Run (backend), Vercel (frontend) |

---

## Project Structure

```
tourmate-ai/
├── backend/
│   ├── main.py                    # FastAPI app + ADK Runner
│   ├── agents/
│   │   ├── __init__.py
│   │   └── tourmate_agents.py     # 5 agents (orchestrator + 4 sub-agents)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example               # Template for env vars
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                # Screen router (Splash → Home → Chat)
│   │   ├── api.js                 # API client with timeout + retry
│   │   ├── parser.js              # Emoji text → structured cards
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Global state + localStorage
│   │   ├── hooks/
│   │   │   └── useChat.js         # Chat operations hook
│   │   └── components/
│   │       ├── SplashScreen.jsx   # City input with auto-suggest
│   │       ├── HomeScreen.jsx     # Hero + category cards
│   │       └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example               # Template for env vars
├── .gitignore
└── README.md                      
```

---

## Quick Start

### Prerequisites

- Python 
- Node.js 
- Google Cloud account (for backend deployment)
- Google Maps API key with Places API enabled

---

## Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tahrim19/tourmate-ai.git
cd tourmate-ai/backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the template and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=your_region
GOOGLE_MAPS_API_KEY=your-places-api-key
```

**Where to get these:**

| Variable | Source |
|----------|--------|
| `GOOGLE_CLOUD_PROJECT` | Google Cloud Console → Project selector |
| `GOOGLE_CLOUD_LOCATION` | Region where Vertex AI runs |
| `GOOGLE_MAPS_API_KEY` | Google Cloud Console → APIs & Services → Credentials → Create API Key → Enable Places API |

### 5. Authenticate with Google Cloud

```bash
# Local development (opens browser)
gcloud auth application-default login

# Cloud Shell / headless
gcloud auth login
```

### 6. Run Locally

```bash
uvicorn main:app --reload --port 8080
```

Test at: `http://localhost:8080/docs` (Swagger UI)

### 7. Deploy to Cloud Run

```bash
gcloud run deploy tourmate-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GOOGLE_GENAI_USE_VERTEXAI=TRUE,GOOGLE_CLOUD_PROJECT=your-project-id,GOOGLE_CLOUD_LOCATION=your_region,GOOGLE_MAPS_API_KEY=your-places-api-key" \
  --memory 1Gi
```

After deploy, note the service URL (e.g., `https://tourmate-ai-xxx.run.app`).

---

## Frontend Setup

### 1. Navigate to Frontend

```bash
cd tourmate-ai/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the template and fill in your backend URL:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=https://your-backend-url.run.app
```

**For local development:**
```env
VITE_API_URL=http://localhost:8080
```

### 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

### 6. Deploy (Example: Vercel)

```bash
npm install -g vercel
vercel --prod
```

Set `VITE_API_URL` in Vercel dashboard → Project Settings → Environment Variables.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_GENAI_USE_VERTEXAI` | Yes | Set to `TRUE` to use Vertex AI
| `GOOGLE_CLOUD_PROJECT` | Yes | Your Google Cloud project ID |
| `GOOGLE_CLOUD_LOCATION` | Yes | Vertex AI region |
| `GOOGLE_MAPS_API_KEY` | Yes | Google Maps API key with Places API enabled |
| `PORT` | No | Server port (default: 8080, Cloud Run sets automatically) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL (e.g., `https://your-app.run.app` or `http://localhost:8080`) |

---

## API Endpoints

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/chat` | POST | `{message, city, user_id}` | `{response, user_id, session_id}` |
| `/api/quick` | POST | `{city, category, user_id}` | `{response, user_id, session_id}` |
| `/health` | GET | — | `{status: "ok"}` |

**Category options for `/api/quick`:** `attractions`, `food`, `parks`, `itinerary`

---

## How It Works

### Multi-Agent Architecture

```
User Message
    ↓
Orchestrator Agent (routes intent)
    ↓
├─ Location Agent      → "I'm in Lahore" → confirms city
├─ Attraction Agent      → "What to visit?" → finds places
├─ Food Agent            → "Where to eat?" → finds restaurants
└─ Itinerary Agent       → "Plan my day" → builds schedule
```

### Response Parsing

The backend returns structured text with emoji markers:

```
🏛️ **Top Attractions**
* **Badshahi Mosque** — ⭐4.8 — Mughal masterpiece
  📍 Walled City, Lahore

🌳 **Parks & Nature**
* **Shalimar Gardens** — ⭐4.6 — UNESCO site
```

The frontend parser converts this into rich UI cards with ratings, addresses, and images.

---


## License

MIT License — feel free to use, modify, and distribute.

---

## Acknowledgments

- Built with [Google ADK](https://developers.google.com/adk) and [Vertex AI](https://cloud.google.com/vertex-ai)
- Maps data powered by [Google Maps Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- UI inspired by modern travel apps with custom Framer Motion animations
