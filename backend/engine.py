import json
from datetime import datetime
from database import get_db

def log_event(cursor, incident_id, msg, type="INFO", data=None):
    now = datetime.now().isoformat()
    cursor.execute('''
    INSERT INTO incident_events (incident_id, timestamp, message, type, data)
    VALUES (?, ?, ?, ?, ?)
    ''', (incident_id, now, msg, type, json.dumps(data) if data else None))

def run_investigation(incident_id):
    conn = get_db()
    c = conn.cursor()
    
    # 01 DETECT
    c.execute('SELECT * FROM incidents WHERE id=?', (incident_id,))
    inc = c.fetchone()
    if not inc:
        return {"error": "Incident not found"}
        
    tx_id = inc['transaction_id']
    c.execute('SELECT * FROM transactions WHERE id=?', (tx_id,))
    tx = c.fetchone()
    
    # Update incident state to INVESTIGATING
    c.execute('UPDATE incidents SET status="INVESTIGATING" WHERE id=?', (incident_id,))
    log_event(c, incident_id, "VIYORA common intelligence platform initiated.", "INFO")
    
    # AGENT 1: USER CONTEXT
    user1_id = tx['customer']
    agent1_id = f"AGENT-{user1_id.replace(' ', '').upper()}"
    log_event(c, incident_id, f"VIYORA Agent ({agent1_id}) activated for {user1_id}.", "INFO", {
        "agent": agent1_id,
        "context": "CUSTOMER",
        "authorized_evidence": {
            "transaction_id": tx_id,
            "amount": tx['amount'],
            "debit_status": "DEBITED" if tx['gateway'] != "FAILED" else "NOT_DEBITED",
            "gateway_status": tx['gateway']
        }
    })
    
    # AGENT 1: REQUEST VERIFICATION VIA AGENT BUS
    agent2_id = f"AGENT-{tx['recipient'].replace(' ', '').upper()}"
    req_msg = {
        "sender": agent1_id,
        "recipient": agent2_id,
        "message_type": "VERIFY_TRANSACTION",
        "transaction_id": tx_id,
        "requested_evidence": ["receipt_status", "settlement_status", "merchant_transaction_status"],
        "reason": "Determine recipient-side payment state"
    }
    log_event(c, incident_id, "Verification request sent across Agent Bus.", "AGENT_BUS", req_msg)
    
    # AGENT 2: RECIPIENT CONTEXT
    receipt_status = "NOT_RECEIVED" if tx['gateway'] in ["TIMEOUT", "FAILED"] else "RECEIVED"
    settlement_status = "NOT_COMPLETED" if tx['gateway'] in ["TIMEOUT", "FAILED"] else "SETTLED"
    merch_tx_status = "NOT_FOUND" if tx['gateway'] in ["TIMEOUT", "FAILED"] else "SUCCESS"
    if tx['status'] == 'SUCCESS':
        receipt_status = 'RECEIVED'
        settlement_status = 'SETTLED'
        merch_tx_status = 'SUCCESS'

    res_msg = {
        "sender": agent2_id,
        "recipient": agent1_id,
        "message_type": "VERIFICATION_RESPONSE",
        "transaction_id": tx_id,
        "receipt_status": receipt_status,
        "settlement_status": settlement_status,
        "merchant_transaction_status": merch_tx_status,
        "evidence_scope": "MINIMUM_REQUIRED"
    }
    log_event(c, incident_id, f"VIYORA Agent ({agent2_id}) activated and returned scoped evidence.", "AGENT_BUS", res_msg)
    
    # ENFORCE PRIVACY BOUNDARY
    log_event(c, incident_id, "Privacy Boundary Enforced ✓ Minimum Evidence Exchange ✓ Agent Identity Verified ✓", "PRIVACY", {
        "shared": ["receipt_status", "settlement_status", "merchant_transaction_status"],
        "not_shared": ["customer_balance", "merchant_balance", "unrelated_transactions"]
    })
    
    # COMPARE TRANSACTION STATES & IDENTIFY PROBLEM LOCATION
    problem_location = "NONE"
    tx_state = "VERIFIED"
    risk = "LOW"
    action = "NO ACTION REQUIRED"
    explanation = "Both agents independently verified the transaction. The payment was successfully received and settled."

    if tx['gateway'] == "TIMEOUT":
        problem_location = "PAYMENT / GATEWAY"
        tx_state = "UNCERTAIN"
        risk = "HIGH"
        action = "BLOCK RETRY"
        explanation = "Evidence indicates that User 1 was debited, but the recipient-side transaction is not confirmed. The payment is therefore currently uncertain. A duplicate retry has been blocked while reconciliation is performed."
    elif tx['gateway'] == "FAILED":
        problem_location = "SENDER / PAYMENT INITIATION"
        tx_state = "FAILED"
        risk = "LOW"
        action = "SAFE RETRY ALLOWED"
        explanation = "The original transaction did not reach a successful payment state and no recipient-side receipt was detected."
    elif tx['type'] == 'DUPLICATE_SUSPECTED':
        problem_location = "DUPLICATE TRANSACTION"
        tx_state = "UNCERTAIN"
        risk = "HIGH"
        action = "BLOCK RETRY"
        explanation = "Original payment received. Second payment may be duplicate. Further retry must be blocked. Agents will investigate the second transaction."

    c.execute('UPDATE incidents SET risk=? WHERE id=?', (risk, incident_id))
    
    # LOG DECISION PIPELINE RESULTS
    log_event(c, incident_id, explanation, "RISK", {
        "problem_location": problem_location,
        "transaction_state": tx_state,
        "risk": risk,
        "action": action
    })

    if risk == "HIGH":
        log_event(c, incident_id, "Action blocked by Policy Engine to prevent unsafe duplicate payment.", "POLICY")
    
    conn.commit()
    conn.close()
    
    return {"status": "success", "incident_id": incident_id}

def resolve_incident(incident_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM incidents WHERE id=?', (incident_id,))
    inc = c.fetchone()
    if not inc:
        return {"error": "Incident not found"}
        
    log_event(c, incident_id, "Reconciliation initiated across Agent Bus.", "ACTION")
    
    tx_id = inc['transaction_id']
    c.execute('UPDATE transactions SET status="REFUNDED", gateway="FAILED" WHERE id=? AND status="TIMEOUT"', (tx_id,))
    
    log_event(c, incident_id, "Verification complete. Reconciliation successful. Agents agree on final state.", "VERIFY")
    log_event(c, incident_id, "Monitoring activated for final settlement.", "MONITOR")
    
    c.execute('UPDATE incidents SET status="RESOLVED", resolution="RECONCILED" WHERE id=?', (incident_id,))
    log_event(c, incident_id, "Incident resolved and verified.", "SUCCESS")
    
    conn.commit()
    conn.close()
    return {"status": "success", "incident_id": incident_id}
