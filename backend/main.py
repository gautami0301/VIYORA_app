from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_db
from models import Transaction, Incident, IncidentEvent, ActionRequest, MessageRequest
import engine
import uuid

app = FastAPI(title="VIYORA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/transactions")
def get_transactions():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM transactions")
    txs = [dict(row) for row in c.fetchall()]
    conn.close()
    return {"transactions": txs}

@app.get("/api/transactions/{tx_id}")
def get_transaction(tx_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM transactions WHERE id=?", (tx_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return dict(row)
    raise HTTPException(404, "Transaction not found")

@app.get("/api/incidents")
def get_incidents():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM incidents")
    rows = [dict(row) for row in c.fetchall()]
    conn.close()
    return {"incidents": rows}

@app.post("/api/incidents")
def create_incident(req: dict):
    tx_id = req.get("transaction_id")
    if not tx_id:
        raise HTTPException(400, "transaction_id required")
    inc_id = f"INC-{uuid.uuid4().hex[:6].upper()}"
    if tx_id == "TXN-VYR-5001":
        inc_id = "INC-VYR-5001"
        
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO incidents (id, transaction_id, status, type, risk) VALUES (?, ?, ?, ?, ?)",
              (inc_id, tx_id, "OPEN", "UNCERTAIN_PAYMENT", "UNKNOWN"))
    conn.commit()
    engine.log_event(c, inc_id, f"User reported payment problem for {tx_id}", "USER")
    conn.commit()
    conn.close()
    
    return {"incident_id": inc_id}

@app.get("/api/incidents/{incident_id}")
def get_incident(incident_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM incidents WHERE id=?", (incident_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return dict(row)
    raise HTTPException(404, "Incident not found")

@app.get("/api/incidents/{incident_id}/timeline")
def get_incident_timeline(incident_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM incident_events WHERE incident_id=? ORDER BY id ASC", (incident_id,))
    rows = [dict(row) for row in c.fetchall()]
    conn.close()
    return {"events": rows}

@app.post("/api/incidents/{incident_id}/investigate")
def investigate_incident(incident_id: str):
    return engine.run_investigation(incident_id)

@app.post("/api/incidents/{incident_id}/resolve")
def resolve_incident(incident_id: str):
    return engine.resolve_incident(incident_id)

@app.get("/api/incidents/{incident_id}/report")
def get_report(incident_id: str):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM incidents WHERE id=?", (incident_id,))
    inc = c.fetchone()
    if not inc:
        raise HTTPException(404)
        
    c.execute("SELECT * FROM incident_events WHERE incident_id=? ORDER BY id ASC", (incident_id,))
    events = [dict(r) for r in c.fetchall()]
    
    c.execute("SELECT * FROM transactions WHERE id=?", (inc['transaction_id'],))
    tx = c.fetchone()
    
    conn.close()
    return {
        "incident": dict(inc),
        "transaction": dict(tx) if tx else None,
        "events": events
    }
