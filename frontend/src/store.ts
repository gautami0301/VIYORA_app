// store.ts

export type UserRole = 'CUSTOMER' | 'MERCHANT' | 'PARENT_AGENT';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  agentId: string;
}

export interface Agent {
  id: string;
  ownerId: string;
  role: UserRole;
  status: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  recipientId: string;
  amount: number;
  timestamp: string;
  senderStatus: string;
  recipientStatus: string;
  gatewayStatus: string;
  settlementStatus: string;
  risk: string;
  incidentId: string | null;
  resolutionStatus: string;
  type: string;
  agentRecommendation?: string;
  category?: string;
  failureReason?: string;
}

export interface Incident {
  id: string;
  transactionId: string;
  type: string;
  risk: string;
  status: string;
  evidence: any;
  actions: string[];
  resolution: string | null;
}

export interface MerchantConnection {
  userId: string;
  merchantId: string;
  authorized: boolean;
  status: string;
}

export const USERS: Record<string, User> = {
  VIYORA: { id: 'viyora-parent', name: 'VIYORA', role: 'PARENT_AGENT', agentId: 'AGENT-VIYORA' },
  RAHUL: { id: 'USER-RAHUL-001', name: 'Rahul', role: 'CUSTOMER', agentId: 'AGENT-RAHUL' },
  PRIYA: { id: 'USER-PRIYA-001', name: 'Priya', role: 'CUSTOMER', agentId: 'AGENT-PRIYA' },
  ARJUN: { id: 'USER-ARJUN-001', name: 'Arjun', role: 'CUSTOMER', agentId: 'AGENT-ARJUN' },
  SNEHA: { id: 'USER-SNEHA-001', name: 'Sneha', role: 'CUSTOMER', agentId: 'AGENT-SNEHA' },
  ABC: { id: 'USER-ABC-001', name: 'ABC Electronics', role: 'MERCHANT', agentId: 'AGENT-ABC' },
  AMAZON: { id: 'USER-AMAZON-001', name: 'Amazon', role: 'MERCHANT', agentId: 'AGENT-AMAZON' },
  ZOMATO: { id: 'USER-ZOMATO-001', name: 'Zomato', role: 'MERCHANT', agentId: 'AGENT-ZOMATO' },
  RELIANCE: { id: 'USER-RELIANCE-001', name: 'Reliance Digital', role: 'MERCHANT', agentId: 'AGENT-RELIANCE' },
};

export const AGENTS: Record<string, Agent> = {
  'AGENT-VIYORA': { id: 'AGENT-VIYORA', ownerId: 'viyora-parent', role: 'PARENT_AGENT', status: 'ACTIVE' },
  'AGENT-RAHUL': { id: 'AGENT-RAHUL', ownerId: 'USER-RAHUL-001', role: 'CUSTOMER', status: 'ACTIVE' },
  'AGENT-PRIYA': { id: 'AGENT-PRIYA', ownerId: 'USER-PRIYA-001', role: 'CUSTOMER', status: 'ACTIVE' },
  'AGENT-ARJUN': { id: 'AGENT-ARJUN', ownerId: 'USER-ARJUN-001', role: 'CUSTOMER', status: 'ACTIVE' },
  'AGENT-SNEHA': { id: 'AGENT-SNEHA', ownerId: 'USER-SNEHA-001', role: 'CUSTOMER', status: 'ACTIVE' },
  'AGENT-ABC': { id: 'AGENT-ABC', ownerId: 'USER-ABC-001', role: 'MERCHANT', status: 'ACTIVE' },
  'AGENT-AMAZON': { id: 'AGENT-AMAZON', ownerId: 'USER-AMAZON-001', role: 'MERCHANT', status: 'ACTIVE' },
  'AGENT-ZOMATO': { id: 'AGENT-ZOMATO', ownerId: 'USER-ZOMATO-001', role: 'MERCHANT', status: 'ACTIVE' },
  'AGENT-RELIANCE': { id: 'AGENT-RELIANCE', ownerId: 'USER-RELIANCE-001', role: 'MERCHANT', status: 'ACTIVE' },
};

const now = Date.now();
const tStamp = (hoursAgo: number) => new Date(now - hoursAgo * 3600000).toISOString();

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // RAHUL -> AMAZON
  { id: 'R-001', senderId: 'USER-RAHUL-001', recipientId: 'USER-AMAZON-001', amount: 3499, timestamp: tStamp(1), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', category: 'Electronics', agentRecommendation: 'TRANSACTION CONSISTENT' },
  { id: 'R-002', senderId: 'USER-RAHUL-001', recipientId: 'USER-AMAZON-001', amount: 8999, timestamp: tStamp(2), senderStatus: 'DEBITED', recipientStatus: 'NOT_RECEIVED', gatewayStatus: 'PENDING', settlementStatus: 'NOT_COMPLETED', risk: 'MEDIUM', incidentId: null, resolutionStatus: 'PENDING', type: 'STANDARD', agentRecommendation: 'WAIT & MONITOR' },
  
  // RAHUL -> ABC ELECTRONICS
  { id: 'R-003', senderId: 'USER-RAHUL-001', recipientId: 'USER-ABC-001', amount: 5200, timestamp: tStamp(3), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', category: 'Electronics', agentRecommendation: 'TRANSACTION CONSISTENT' },
  { id: 'R-004', senderId: 'USER-RAHUL-001', recipientId: 'USER-ABC-001', amount: 6750, timestamp: tStamp(4), senderStatus: 'DEBITED', recipientStatus: 'NOT_RECEIVED', gatewayStatus: 'TIMEOUT', settlementStatus: 'NOT_COMPLETED', risk: 'HIGH', incidentId: 'R-INC-001', resolutionStatus: 'PENDING', type: 'UNCERTAIN', failureReason: 'Gateway timeout', agentRecommendation: 'WAIT & MONITOR' },

  // PRIYA -> ABC ELECTRONICS
  { id: 'P-001', senderId: 'USER-PRIYA-001', recipientId: 'USER-ABC-001', amount: 5000, timestamp: tStamp(1.5), senderStatus: 'DEBITED', recipientStatus: 'NOT_RECEIVED', gatewayStatus: 'TIMEOUT', settlementStatus: 'NOT_COMPLETED', risk: 'HIGH', incidentId: 'P-INC-001', resolutionStatus: 'PENDING', type: 'UNCERTAIN', failureReason: 'Gateway timeout', agentRecommendation: 'WAIT & MONITOR' },
  { id: 'P-002', senderId: 'USER-PRIYA-001', recipientId: 'USER-ABC-001', amount: 2499, timestamp: tStamp(5), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', agentRecommendation: 'TRANSACTION CONSISTENT' },

  // PRIYA -> ZOMATO
  { id: 'P-003', senderId: 'USER-PRIYA-001', recipientId: 'USER-ZOMATO-001', amount: 1200, timestamp: tStamp(0.5), senderStatus: 'DEBITED', recipientStatus: 'NOT_RECEIVED', gatewayStatus: 'TIMEOUT', settlementStatus: 'NOT_COMPLETED', risk: 'HIGH', incidentId: 'P-INC-002', resolutionStatus: 'PENDING', type: 'UNCERTAIN', failureReason: 'Payment timeout', agentRecommendation: 'WAIT & MONITOR' },
  { id: 'P-004', senderId: 'USER-PRIYA-001', recipientId: 'USER-ZOMATO-001', amount: 640, timestamp: tStamp(24), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', category: 'Food', agentRecommendation: 'TRANSACTION CONSISTENT' },

  // ARJUN -> AMAZON
  { id: 'A-001', senderId: 'USER-ARJUN-001', recipientId: 'USER-AMAZON-001', amount: 2799, timestamp: tStamp(10), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', agentRecommendation: 'TRANSACTION CONSISTENT' },
  { id: 'A-002', senderId: 'USER-ARJUN-001', recipientId: 'USER-AMAZON-001', amount: 12499, timestamp: tStamp(2), senderStatus: 'DEBITED', recipientStatus: 'NOT_RECEIVED', gatewayStatus: 'PENDING', settlementStatus: 'NOT_COMPLETED', risk: 'MEDIUM', incidentId: null, resolutionStatus: 'PENDING', type: 'STANDARD', failureReason: 'Merchant confirmation delayed', agentRecommendation: 'WAIT & MONITOR' },

  // ARJUN -> RELIANCE DIGITAL
  { id: 'A-003', senderId: 'USER-ARJUN-001', recipientId: 'USER-RELIANCE-001', amount: 18999, timestamp: tStamp(1.2), senderStatus: 'FAILED', recipientStatus: 'NOT_RECEIVED', gatewayStatus: 'FAILED', settlementStatus: 'NOT_COMPLETED', risk: 'MEDIUM', incidentId: 'A-INC-001', resolutionStatus: 'PENDING', type: 'UNCERTAIN', failureReason: 'Payment gateway error', agentRecommendation: 'SAFE TO RETRY' },
  { id: 'A-004', senderId: 'USER-ARJUN-001', recipientId: 'USER-RELIANCE-001', amount: 4999, timestamp: tStamp(48), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', agentRecommendation: 'TRANSACTION CONSISTENT' },

  // SNEHA -> ZOMATO
  { id: 'S-001', senderId: 'USER-SNEHA-001', recipientId: 'USER-ZOMATO-001', amount: 850, timestamp: tStamp(5), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', agentRecommendation: 'TRANSACTION CONSISTENT' },
  { id: 'S-002', senderId: 'USER-SNEHA-001', recipientId: 'USER-ZOMATO-001', amount: 1850, timestamp: tStamp(0.8), senderStatus: 'DEBITED', recipientStatus: 'NOT_RECEIVED', gatewayStatus: 'FAILED', settlementStatus: 'NOT_COMPLETED', risk: 'HIGH', incidentId: 'S-INC-001', resolutionStatus: 'PENDING', type: 'UNCERTAIN', failureReason: 'Order/payment mismatch', agentRecommendation: 'DO NOT RETRY UNTIL VERIFIED' },

  // SNEHA -> AMAZON
  { id: 'S-003', senderId: 'USER-SNEHA-001', recipientId: 'USER-AMAZON-001', amount: 4299, timestamp: tStamp(72), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'SUCCESS', settlementStatus: 'COMPLETED', risk: 'LOW', incidentId: null, resolutionStatus: 'RESOLVED', type: 'STANDARD', agentRecommendation: 'TRANSACTION CONSISTENT' },
  { id: 'S-004', senderId: 'USER-SNEHA-001', recipientId: 'USER-AMAZON-001', amount: 7499, timestamp: tStamp(1), senderStatus: 'DEBITED', recipientStatus: 'RECEIVED', gatewayStatus: 'PENDING', settlementStatus: 'NOT_COMPLETED', risk: 'MEDIUM', incidentId: null, resolutionStatus: 'PENDING', type: 'STANDARD', failureReason: 'Settlement confirmation delayed', agentRecommendation: 'WAIT & MONITOR' },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'R-INC-001',
    transactionId: 'R-004',
    type: 'UNCERTAIN_PAYMENT',
    risk: 'HIGH',
    status: 'ACTIVE',
    evidence: {
      userAnalysis: 'Detect failed transaction. Compare amount with previous ABC Electronics transactions. Detect whether duplicate retry should be avoided.',
      merchantAnalysis: 'Gateway timeout detected. Payment capture not confirmed. Order not fulfilled. No settlement recorded.',
      recommendation: 'WAIT & MONITOR'
    },
    actions: ['Immediate retry blocked', 'Reconciliation requested', 'Monitoring active'],
    resolution: null
  },
  {
    id: 'P-INC-001',
    transactionId: 'P-001',
    type: 'UNCERTAIN_PAYMENT',
    risk: 'HIGH',
    status: 'ACTIVE',
    evidence: {
      userAnalysis: 'Analyze transaction, Priya history, previous ABC Electronics spending, anomaly, retry risk.',
      merchantAnalysis: 'Gateway timeout. Payment capture uncertain. Order not confirmed. Settlement pending reconciliation.',
      recommendation: 'WAIT & MONITOR'
    },
    actions: ['Immediate retry blocked', 'Reconciliation initiated', 'Monitoring active'],
    resolution: null
  },
  {
    id: 'P-INC-002',
    transactionId: 'P-003',
    type: 'UNCERTAIN_PAYMENT',
    risk: 'HIGH',
    status: 'ACTIVE',
    evidence: {
      userAnalysis: 'Fetch transaction details. Fetch Priya recent Zomato transaction history. Compare spending pattern. Detect failed payment. Check retry risk.',
      merchantAnalysis: 'Payment timeout detected. Restaurant order was not confirmed. Payment capture is uncertain. No completed settlement found.',
      recommendation: 'WAIT & MONITOR'
    },
    actions: ['Retry blocked', 'Merchant verification requested', 'Monitoring active'],
    resolution: null
  },
  {
    id: 'A-INC-001',
    transactionId: 'A-003',
    type: 'PAYMENT_FAILURE',
    risk: 'MEDIUM',
    status: 'ACTIVE',
    evidence: {
      userAnalysis: 'High-value transaction. Failure detected. Check whether payment was actually captured.',
      merchantAnalysis: 'Payment authorization failed. Order not created. No settlement recorded.',
      recommendation: 'SAFE TO RETRY'
    },
    actions: ['Recommend safe retry', 'Notify user'],
    resolution: null
  },
  {
    id: 'S-INC-001',
    transactionId: 'S-002',
    type: 'ORDER_MISMATCH',
    risk: 'HIGH',
    status: 'ACTIVE',
    evidence: {
      userAnalysis: 'Amount is above recent average. Check whether payment was captured.',
      merchantAnalysis: 'Order creation failed. Payment capture not confirmed. No settlement recorded.',
      recommendation: 'DO NOT RETRY UNTIL VERIFIED'
    },
    actions: ['Block retry', 'Initiate merchant verification'],
    resolution: null
  }
];

export const INITIAL_CONNECTIONS: MerchantConnection[] = [
  { userId: 'USER-RAHUL-001', merchantId: 'USER-AMAZON-001', authorized: true, status: 'CONNECTED' },
  { userId: 'USER-RAHUL-001', merchantId: 'USER-ABC-001', authorized: true, status: 'CONNECTED' },
  { userId: 'USER-PRIYA-001', merchantId: 'USER-ABC-001', authorized: true, status: 'CONNECTED' },
  { userId: 'USER-PRIYA-001', merchantId: 'USER-ZOMATO-001', authorized: true, status: 'CONNECTED' },
  { userId: 'USER-ARJUN-001', merchantId: 'USER-AMAZON-001', authorized: true, status: 'CONNECTED' },
  { userId: 'USER-ARJUN-001', merchantId: 'USER-RELIANCE-001', authorized: true, status: 'CONNECTED' },
  { userId: 'USER-SNEHA-001', merchantId: 'USER-ZOMATO-001', authorized: true, status: 'CONNECTED' },
  { userId: 'USER-SNEHA-001', merchantId: 'USER-AMAZON-001', authorized: true, status: 'CONNECTED' },
];

class GlobalStore {
  transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  incidents: Incident[] = [...INITIAL_INCIDENTS];
  merchantConnections: MerchantConnection[] = [...INITIAL_CONNECTIONS];

  listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  getTransactions(userId: string) {
    if (userId === 'viyora-parent') return this.transactions;
    return this.transactions.filter(t => t.senderId === userId || t.recipientId === userId);
  }

  getIncidents(userId: string) {
    if (userId === 'viyora-parent') return this.incidents;
    const userTxIds = new Set(this.getTransactions(userId).map(t => t.id));
    return this.incidents.filter(i => userTxIds.has(i.transactionId));
  }

  updateTransactionState(id: string, updates: Partial<Transaction>) {
    const idx = this.transactions.findIndex(t => t.id === id);
    if (idx > -1) {
      this.transactions[idx] = { ...this.transactions[idx], ...updates };
      this.notify();
    }
  }

  updateIncidentState(id: string, updates: Partial<Incident>) {
    const idx = this.incidents.findIndex(i => i.id === id);
    if (idx > -1) {
      this.incidents[idx] = { ...this.incidents[idx], ...updates };
      this.notify();
    }
  }

  getConnections(userId: string) {
    if (userId === 'viyora-parent') return this.merchantConnections;
    return this.merchantConnections.filter(c => c.userId === userId);
  }

  toggleConnection(userId: string, merchantId: string) {
    const idx = this.merchantConnections.findIndex(c => c.userId === userId && c.merchantId === merchantId);
    if (idx > -1) {
      this.merchantConnections[idx].authorized = !this.merchantConnections[idx].authorized;
      this.merchantConnections[idx].status = this.merchantConnections[idx].authorized ? 'CONNECTED' : 'DISCONNECTED';
    } else {
      this.merchantConnections.push({ userId, merchantId, authorized: true, status: 'CONNECTED' });
    }
    this.notify();
  }
}

export const store = new GlobalStore();
