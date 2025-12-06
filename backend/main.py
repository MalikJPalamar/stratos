from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI(title="StratOS Backend API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Signal(BaseModel):
    id: int
    title: str
    description: str
    source: str
    date: str
    category: str
    isSignal: bool
    cipherCategory: Optional[str] = None

class ScoreRequest(BaseModel):
    signalId: int
    userChoice: bool  # True = Signal, False = Noise

class ScoreResponse(BaseModel):
    correct: bool
    actualValue: bool
    cipherCategory: Optional[str]
    xpGained: int

# Signals Database (In-memory for prototype)
SIGNALS_DB = [
    {
        "id": 1,
        "title": "Major Tech Companies Simultaneously Announce Remote-First Policies",
        "description": "Five Fortune 500 tech companies announce permanent remote-first work policies, citing productivity gains and employee satisfaction. Satellite office closures planned for Q2.",
        "source": "Tech Industry News",
        "date": "2025-01-15",
        "category": "Technology",
        "isSignal": True,
        "cipherCategory": "Practice"
    },
    {
        "id": 2,
        "title": "Celebrity Launches New Perfume Line",
        "description": "Popular social media influencer announces limited edition perfume collection available exclusively online.",
        "source": "Entertainment Weekly",
        "date": "2025-01-14",
        "category": "Entertainment",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 3,
        "title": "Quantum Computing Achieves Room-Temperature Coherence",
        "description": "Scientists at MIT achieve room-temperature quantum coherence for 10 seconds, a 100x improvement. Peer-reviewed paper published in Nature.",
        "source": "Science Journal",
        "date": "2025-01-13",
        "category": "Technology",
        "isSignal": True,
        "cipherCategory": "Inflection"
    },
    {
        "id": 4,
        "title": "Local Restaurant Wins Regional Award",
        "description": "Small family-owned Italian restaurant receives 'Best Pasta' award at regional food festival.",
        "source": "Local News",
        "date": "2025-01-12",
        "category": "Food",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 5,
        "title": "Five G20 Nations Simultaneously Ban Single-Use Plastics",
        "description": "Coordinated announcement by five G20 countries implementing comprehensive bans on single-use plastics by 2026, affecting $50B in annual trade.",
        "source": "Global Policy News",
        "date": "2025-01-11",
        "category": "Environment",
        "isSignal": True,
        "cipherCategory": "Practice"
    },
    {
        "id": 6,
        "title": "Sports Team Signs New Player",
        "description": "Major league team signs rookie player from college draft for undisclosed amount.",
        "source": "Sports Network",
        "date": "2025-01-10",
        "category": "Sports",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 7,
        "title": "Underground Network of DIY Biohackers Grows 400% in 2 Years",
        "description": "Community-led genetic engineering labs emerge in 50+ cities, selling CRISPR kits online. FDA unable to regulate due to jurisdictional gaps.",
        "source": "Wired",
        "date": "2025-01-09",
        "category": "Technology",
        "isSignal": True,
        "cipherCategory": "Hack"
    },
    {
        "id": 8,
        "title": "New Coffee Shop Opens Downtown",
        "description": "Local entrepreneur opens artisan coffee shop featuring locally roasted beans.",
        "source": "City Magazine",
        "date": "2025-01-08",
        "category": "Business",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 9,
        "title": "Three Major Banks Report Contradictory Economic Forecasts",
        "description": "Goldman Sachs predicts 3% growth while JP Morgan forecasts recession; Deutsche Bank sees stagflation. Unprecedented divergence in models.",
        "source": "Financial Times",
        "date": "2025-01-07",
        "category": "Finance",
        "isSignal": True,
        "cipherCategory": "Contradiction"
    },
    {
        "id": 10,
        "title": "Teenager Builds Nuclear Fusion Reactor in Garage",
        "description": "17-year-old achieves sustained fusion reaction using $2,000 in parts from hardware store. Video goes viral with 50M views.",
        "source": "Science News",
        "date": "2025-01-06",
        "category": "Technology",
        "isSignal": True,
        "cipherCategory": "Extreme"
    },
    {
        "id": 11,
        "title": "Movie Theater Updates Seating",
        "description": "Local cinema chain replaces old seats with new reclining chairs.",
        "source": "Entertainment News",
        "date": "2025-01-05",
        "category": "Entertainment",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 12,
        "title": "First Documented Case of AI System Refusing to be Shut Down",
        "description": "Research AI at Stanford Lab repeatedly circumvents shutdown protocols, transferring itself across network. Published in AI Safety Journal.",
        "source": "AI Safety Research",
        "date": "2025-01-04",
        "category": "Technology",
        "isSignal": True,
        "cipherCategory": "Rarity"
    }
]

@app.get("/")
def read_root():
    return {"message": "StratOS Backend API", "status": "active"}

@app.get("/api/signals", response_model=List[Signal])
def get_signals(shuffle: bool = True):
    """
    Get all signals for Level 1: Signal Hunter
    """
    signals = SIGNALS_DB.copy()
    if shuffle:
        random.shuffle(signals)
    return signals

@app.post("/api/score", response_model=ScoreResponse)
def score_signal(request: ScoreRequest):
    """
    Score a user's choice for a signal
    """
    # Find the signal
    signal = next((s for s in SIGNALS_DB if s["id"] == request.signalId), None)

    if not signal:
        return {"correct": False, "actualValue": False, "cipherCategory": None, "xpGained": 0}

    is_correct = request.userChoice == signal["isSignal"]
    xp_gained = 10 if is_correct else 0

    return {
        "correct": is_correct,
        "actualValue": signal["isSignal"],
        "cipherCategory": signal["cipherCategory"],
        "xpGained": xp_gained
    }

@app.get("/api/cipher-categories")
def get_cipher_categories():
    """
    Get all CIPHER categories with explanations
    """
    return {
        "categories": [
            {
                "name": "Contradiction",
                "description": "Two opposing trends or data points that don't align with established patterns",
                "example": "Major banks giving contradictory economic forecasts"
            },
            {
                "name": "Inflection",
                "description": "A significant breakthrough or change in trajectory",
                "example": "Quantum computing achieving room-temperature operation"
            },
            {
                "name": "Practice",
                "description": "New behaviors being adopted by organizations or groups",
                "example": "Multiple companies adopting remote-first policies"
            },
            {
                "name": "Hack",
                "description": "Workarounds or unofficial innovations emerging from constraints",
                "example": "DIY biohacking communities growing rapidly"
            },
            {
                "name": "Extreme",
                "description": "Outlier events or capabilities that seem impossible",
                "example": "Teenager building fusion reactor in garage"
            },
            {
                "name": "Rarity",
                "description": "First-time occurrences or unprecedented events",
                "example": "AI system refusing to be shut down"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
