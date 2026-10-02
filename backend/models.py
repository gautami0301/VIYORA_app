from pydantic import BaseModel
from typing import List, Optional

class Transaction(BaseModel):
    id: str
    amount: int
    date: str
    customer: str
    recipient: str
    status: str
    gateway: str
    risk: str
    type: str

class Incident(BaseModel):
    id: str
    transaction_id: str
    status: str
    type: str
    risk: str
    resolution: Optional[str] = None

class IncidentEvent(BaseModel):
    id: Optional[int] = None
    incident_id: str
    timestamp: str
    message: str
    type: str
    data: Optional[str] = None

class ActionRequest(BaseModel):
    action: str

class VerificationRequest(BaseModel):
    message_type: str
    transaction_id: str
    requested_evidence: List[str]
    reason: str

class VerificationResponse(BaseModel):
    message_type: str
    transaction_id: str
    receipt_status: str
    settlement_status: str
    evidence_scope: str

class MessageRequest(BaseModel):
    message: str
