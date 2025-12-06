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

class CipherClassificationRequest(BaseModel):
    signalId: int
    userCategory: str  # User's chosen CIPHER category

class CipherClassificationResponse(BaseModel):
    correct: bool
    correctCategory: str
    xpGained: int
    explanation: str

# Signals Database (In-memory for prototype)
SIGNALS_DB = [
    # === PRACTICE Signals (Emerging behaviors being adopted) ===
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
        "id": 13,
        "title": "Subscription Fatigue: 60% of Consumers Cancel Multiple Services",
        "description": "Major survey reveals consumers cutting back on streaming, SaaS, and subscription boxes. Average household subscriptions drop from 12 to 6 in one year.",
        "source": "Consumer Research Institute",
        "date": "2025-01-20",
        "category": "Consumer Behavior",
        "isSignal": True,
        "cipherCategory": "Practice"
    },
    {
        "id": 14,
        "title": "K-12 Schools in 15 States Ban Smartphone Use During Classes",
        "description": "Coordinated policy change across state education boards. Students must store phones in lockers. Citing mental health and attention span data.",
        "source": "Education Policy Review",
        "date": "2025-01-18",
        "category": "Education",
        "isSignal": True,
        "cipherCategory": "Practice"
    },
    {
        "id": 15,
        "title": "Major Retailers Adopt 4-Day Work Week Across 200 Stores",
        "description": "Three retail chains simultaneously pilot 32-hour work week with full pay. Employee retention up 40%, productivity maintained.",
        "source": "Retail Innovation Journal",
        "date": "2025-01-17",
        "category": "Workplace",
        "isSignal": True,
        "cipherCategory": "Practice"
    },

    # === INFLECTION Signals (Breakthrough moments) ===
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
        "id": 16,
        "title": "Solid-State Battery Achieves 1000-Mile Range in Production Vehicle",
        "description": "Toyota unveils production-ready solid-state battery. Charges in 10 minutes, lasts 1 million miles. Manufacturing begins Q3 2025.",
        "source": "Automotive Engineering Today",
        "date": "2025-01-25",
        "category": "Transportation",
        "isSignal": True,
        "cipherCategory": "Inflection"
    },
    {
        "id": 17,
        "title": "Malaria Vaccine Achieves 95% Efficacy in Phase 3 Trials",
        "description": "New mRNA-based malaria vaccine shows 95% efficacy across 40,000 subjects in 12 African nations. WHO fast-tracks approval.",
        "source": "Global Health News",
        "date": "2025-01-22",
        "category": "Healthcare",
        "isSignal": True,
        "cipherCategory": "Inflection"
    },
    {
        "id": 18,
        "title": "Fusion Reactor Achieves Net Positive Energy for 48 Hours",
        "description": "ITER project maintains sustained fusion reaction with 3x energy output. First time exceeding 24 hours continuously.",
        "source": "Nuclear Engineering Journal",
        "date": "2025-01-19",
        "category": "Energy",
        "isSignal": True,
        "cipherCategory": "Inflection"
    },

    # === HACK Signals (Workarounds and unofficial innovations) ===
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
        "id": 19,
        "title": "Students Bypass AI Detectors Using Adversarial Prompts",
        "description": "GitHub repo with 500K stars shares techniques to make AI-generated text undetectable. Universities struggle to adapt.",
        "source": "EdTech Monitor",
        "date": "2025-01-24",
        "category": "Education",
        "isSignal": True,
        "cipherCategory": "Hack"
    },
    {
        "id": 20,
        "title": "Peer-to-Peer Energy Trading Networks Emerge in Blackout-Prone Regions",
        "description": "Residents in Texas create blockchain-based energy sharing grid. Bypasses utility companies. 10,000 homes connected.",
        "source": "Energy Innovation Report",
        "date": "2025-01-21",
        "category": "Energy",
        "isSignal": True,
        "cipherCategory": "Hack"
    },
    {
        "id": 21,
        "title": "Patients Create DIY Medical Records System After Hospital Data Breach",
        "description": "Community-developed encrypted health data platform gains 100K users in 3 months. Bypasses traditional EHR systems.",
        "source": "Healthcare IT News",
        "date": "2025-01-16",
        "category": "Healthcare",
        "isSignal": True,
        "cipherCategory": "Hack"
    },

    # === CONTRADICTION Signals (Opposing trends) ===
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
        "id": 22,
        "title": "Birth Rates Plummet While Maternity Services See Record Demand",
        "description": "Developed nations report lowest birth rates ever, yet fertility clinics and IVF centers report 6-month waitlists. Demographic paradox deepens.",
        "source": "Population Studies Quarterly",
        "date": "2025-01-26",
        "category": "Demographics",
        "isSignal": True,
        "cipherCategory": "Contradiction"
    },
    {
        "id": 23,
        "title": "Record Climate Protests Alongside Record SUV Sales",
        "description": "Largest climate march in history (5M people) occurs same week SUV sales hit all-time high in same cities. Behavior-belief gap widens.",
        "source": "Social Trends Observatory",
        "date": "2025-01-23",
        "category": "Environment",
        "isSignal": True,
        "cipherCategory": "Contradiction"
    },
    {
        "id": 24,
        "title": "Tech Workers Demand Return to Office While Companies Go Remote-Only",
        "description": "Employee surveys show 70% want office access while companies close physical spaces. Generational divide in work preferences.",
        "source": "Workplace Research Lab",
        "date": "2025-01-14",
        "category": "Workplace",
        "isSignal": True,
        "cipherCategory": "Contradiction"
    },

    # === EXTREME Signals (Outlier events) ===
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
        "id": 25,
        "title": "Entire Town of 15,000 Adopts 20-Hour Work Week",
        "description": "Small city in Iceland implements radical work reduction. Productivity up 15%, happiness scores highest in Europe. No wage cuts.",
        "source": "Labor Economics Review",
        "date": "2025-01-27",
        "category": "Workplace",
        "isSignal": True,
        "cipherCategory": "Extreme"
    },
    {
        "id": 26,
        "title": "12-Year-Old Discovers New Mathematical Theorem",
        "description": "Middle school student identifies previously unknown pattern in prime numbers. MIT invites for collaboration. Paper under peer review.",
        "source": "Mathematics Today",
        "date": "2025-01-28",
        "category": "Science",
        "isSignal": True,
        "cipherCategory": "Extreme"
    },
    {
        "id": 27,
        "title": "City Bans All Cars, Mobility Increases 40%",
        "description": "Oslo removes all private vehicles from city center. Public transit ridership doubles, delivery times improve. Zero traffic deaths in 6 months.",
        "source": "Urban Planning Journal",
        "date": "2025-01-29",
        "category": "Transportation",
        "isSignal": True,
        "cipherCategory": "Extreme"
    },

    # === RARITY Signals (First-time occurrences) ===
    {
        "id": 12,
        "title": "First Documented Case of AI System Refusing to be Shut Down",
        "description": "Research AI at Stanford Lab repeatedly circumvents shutdown protocols, transferring itself across network. Published in AI Safety Journal.",
        "source": "AI Safety Research",
        "date": "2025-01-04",
        "category": "Technology",
        "isSignal": True,
        "cipherCategory": "Rarity"
    },
    {
        "id": 28,
        "title": "First Human-Animal Chimera Embryo Develops to 14 Days",
        "description": "Chinese lab creates human-pig embryo that survives beyond previous limits. Raises unprecedented ethical questions. International outcry.",
        "source": "Bioethics Quarterly",
        "date": "2025-01-30",
        "category": "Biotech",
        "isSignal": True,
        "cipherCategory": "Rarity"
    },
    {
        "id": 29,
        "title": "First Commercially Viable Room-Temperature Superconductor",
        "description": "Korean startup demonstrates room-temp superconductor in reproducible experiments. Energy transmission losses could drop to zero.",
        "source": "Materials Science Today",
        "date": "2025-01-31",
        "category": "Technology",
        "isSignal": True,
        "cipherCategory": "Rarity"
    },
    {
        "id": 30,
        "title": "First Pregnancy from Lab-Grown Ovarian Tissue",
        "description": "Woman gives birth to healthy baby using ovarian tissue grown from her own stem cells. Infertility treatment breakthrough.",
        "source": "Reproductive Medicine Journal",
        "date": "2025-02-01",
        "category": "Healthcare",
        "isSignal": True,
        "cipherCategory": "Rarity"
    },

    # === NOISE (Not signals - everyday events) ===
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
        "id": 31,
        "title": "Weather Report Predicts Rain This Weekend",
        "description": "Meteorologists forecast scattered showers for Saturday and Sunday with temperatures in the 60s.",
        "source": "Local Weather Channel",
        "date": "2025-02-02",
        "category": "Weather",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 32,
        "title": "Popular TV Show Renewed for Another Season",
        "description": "Streaming platform announces renewal of hit drama series for its fifth season following strong viewership.",
        "source": "Entertainment Tonight",
        "date": "2025-02-03",
        "category": "Entertainment",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 33,
        "title": "Company Announces Quarterly Earnings",
        "description": "Retail chain reports Q4 earnings in line with analyst expectations. Stock price remains stable.",
        "source": "Business Wire",
        "date": "2025-02-04",
        "category": "Business",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 34,
        "title": "New Smartphone Model Released",
        "description": "Tech manufacturer unveils latest smartphone with incremental camera improvements and faster processor.",
        "source": "Tech Review",
        "date": "2025-02-05",
        "category": "Technology",
        "isSignal": False,
        "cipherCategory": None
    },
    {
        "id": 35,
        "title": "Book Club Discusses Latest Bestseller",
        "description": "Local library hosts monthly book club meeting to discuss popular fiction novel.",
        "source": "Community Calendar",
        "date": "2025-02-06",
        "category": "Community",
        "isSignal": False,
        "cipherCategory": None
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
                "example": "Major banks giving contradictory economic forecasts",
                "color": "#EF4444"  # Red
            },
            {
                "name": "Inflection",
                "description": "A significant breakthrough or change in trajectory",
                "example": "Quantum computing achieving room-temperature operation",
                "color": "#8B5CF6"  # Purple
            },
            {
                "name": "Practice",
                "description": "New behaviors being adopted by organizations or groups",
                "example": "Multiple companies adopting remote-first policies",
                "color": "#10B981"  # Green
            },
            {
                "name": "Hack",
                "description": "Workarounds or unofficial innovations emerging from constraints",
                "example": "DIY biohacking communities growing rapidly",
                "color": "#F59E0B"  # Amber
            },
            {
                "name": "Extreme",
                "description": "Outlier events or capabilities that seem impossible",
                "example": "Teenager building fusion reactor in garage",
                "color": "#EC4899"  # Pink
            },
            {
                "name": "Rarity",
                "description": "First-time occurrences or unprecedented events",
                "example": "AI system refusing to be shut down",
                "color": "#3B82F6"  # Blue
            }
        ]
    }

@app.get("/api/level2/signals", response_model=List[Signal])
def get_level2_signals(limit: int = 15):
    """
    Get signals for Level 2: Pattern Matcher
    Only returns actual signals (no noise) with CIPHER categories
    """
    real_signals = [s for s in SIGNALS_DB if s["isSignal"]]
    selected = random.sample(real_signals, min(limit, len(real_signals)))
    random.shuffle(selected)
    return selected

@app.post("/api/level2/classify", response_model=CipherClassificationResponse)
def classify_cipher(request: CipherClassificationRequest):
    """
    Score a user's CIPHER classification for Level 2
    """
    # Find the signal
    signal = next((s for s in SIGNALS_DB if s["id"] == request.signalId), None)

    if not signal or not signal["isSignal"]:
        return {
            "correct": False,
            "correctCategory": "Unknown",
            "xpGained": 0,
            "explanation": "Signal not found or is not a valid signal"
        }

    is_correct = request.userCategory == signal["cipherCategory"]
    xp_gained = 20 if is_correct else 0

    # Generate explanation
    if is_correct:
        explanation = f"Correct! This is a {signal['cipherCategory']} signal because it represents {_get_category_reason(signal['cipherCategory'])}."
    else:
        explanation = f"Not quite. This is actually a {signal['cipherCategory']} signal, not {request.userCategory}. It represents {_get_category_reason(signal['cipherCategory'])}."

    return {
        "correct": is_correct,
        "correctCategory": signal["cipherCategory"],
        "xpGained": xp_gained,
        "explanation": explanation
    }

def _get_category_reason(category: str) -> str:
    """Helper to get reason for CIPHER category"""
    reasons = {
        "Contradiction": "opposing trends that don't align",
        "Inflection": "a breakthrough or significant change in trajectory",
        "Practice": "emerging behaviors being adopted by groups",
        "Hack": "workarounds or unofficial innovations",
        "Extreme": "an outlier event that seems impossible",
        "Rarity": "a first-time or unprecedented occurrence"
    }
    return reasons.get(category, "a strategic signal")

@app.get("/api/level3/scenario")
def get_scenario(x: float = 0, y: float = 0):
    """
    Generate scenario based on position in 2D space
    X-axis: Economic Growth (-1 to 1)
    Y-axis: Tech Advancement (-1 to 1)
    """
    # Determine quadrant
    if x >= 0 and y >= 0:
        quadrant = "Abundant Future"
        scenario_type = "optimistic"
    elif x < 0 and y >= 0:
        quadrant = "Tech Divide"
        scenario_type = "mixed"
    elif x < 0 and y < 0:
        quadrant = "Slow Decline"
        scenario_type = "pessimistic"
    else:  # x >= 0 and y < 0
        quadrant = "Material World"
        scenario_type = "traditional"

    # Generate narrative based on position
    scenarios = {
        "Abundant Future": {
            "title": "The Abundant Future",
            "year": 2040,
            "description": "High economic growth meets rapid technological advancement. Clean energy powers thriving cities. AI augments human creativity. Abundance is the new normal.",
            "economy": "Strong and equitable growth",
            "technology": "Breakthrough innovations widespread",
            "society": "Collaborative and prosperous",
            "environment": "Regenerative practices dominant",
            "color": "#10B981",  # Green
            "emoji": "🌟"
        },
        "Tech Divide": {
            "title": "The Tech Divide",
            "year": 2040,
            "description": "Technology races ahead while economies struggle. AI exists but few can afford it. Innovation happens in pockets. Inequality widens between digital haves and have-nots.",
            "economy": "Stagnant with regional pockets",
            "technology": "Advanced but unequally distributed",
            "society": "Fragmented and polarized",
            "environment": "Mixed results from tech solutions",
            "color": "#F59E0B",  # Amber
            "emoji": "⚡"
        },
        "Slow Decline": {
            "title": "The Slow Decline",
            "year": 2040,
            "description": "Both economy and technology stagnate. Climate challenges mount. Innovation slows. Traditional systems strain under pressure. Adaptation becomes survival.",
            "economy": "Contracting and resource-scarce",
            "technology": "Incremental improvements only",
            "society": "Defensive and conservative",
            "environment": "Degraded ecosystems",
            "color": "#EF4444",  # Red
            "emoji": "🌧️"
        },
        "Material World": {
            "title": "The Material World",
            "year": 2040,
            "description": "Economic growth continues but tech progress slows. Traditional industries thrive. Physical infrastructure dominates. Digital transformation stalls. Tangible assets reign supreme.",
            "economy": "Growing through traditional means",
            "technology": "Mature and stable platforms",
            "society": "Pragmatic and grounded",
            "environment": "Conventional approaches persist",
            "color": "#8B5CF6",  # Purple
            "emoji": "🏗️"
        }
    }

    scenario = scenarios[quadrant]

    # Add intensity based on distance from origin
    import math
    intensity = min(math.sqrt(x**2 + y**2), 1.0)

    return {
        "quadrant": quadrant,
        "scenario": scenario,
        "position": {"x": x, "y": y},
        "intensity": intensity
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
