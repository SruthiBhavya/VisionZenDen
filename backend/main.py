import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Database Setup
conn = sqlite3.connect("zenden.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duration INTEGER
)
""")

conn.commit()

# CORS (Allow frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
def home():
    return {"message": "ZenDen backend running"}


@app.post("/sessions")
def save_session(data: dict):
    """
    Save a completed focus session
    """
    duration = int(data.get("duration_minutes", 0))

    # Basic validation
    if duration <= 0:
        return {"error": "Invalid duration"}

    cursor.execute(
        "INSERT INTO sessions (duration) VALUES (?)",
        (duration,)
    )
    conn.commit()

    return {"message": "Session saved"}


@app.get("/stats")
def get_stats():
    """
    Return total sessions and total minutes
    """
    cursor.execute("SELECT COUNT(*), SUM(duration) FROM sessions")
    result = cursor.fetchone()

    total_sessions = result[0] or 0
    total_minutes = result[1] or 0

    return {
        "total_sessions": total_sessions,
        "total_minutes": total_minutes
    }