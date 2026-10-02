// store.ts

export type UserRole = 'CUSTOMER' | 'MERCHANT';

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

export const USERS: Record<string, User> = {
  RAHUL: { id: 'USER-RAHUL-001', name: 'Rahul', role: 'CUSTOMER', agentId: 'AGENT-RAHUL' },
  ABC: { id: 'USER-ABC-001', name: 'ABC Electronics', role: 'MERCHANT', agentId: 'AGENT-ABC' },
};

export const AGENTS: Record<string, Agent> = {
  'AGENT-RAHUL': { id: 'AGENT-RAHUL', ownerId: 'USER-RAHUL-001', role: 'CUSTOMER', status: 'ACTIVE' },
  'AGENT-ABC': { id: 'AGENT-ABC', ownerId: 'USER-ABC-001', role: 'MERCHANT', status: 'ACTIVE' },
};

// Generate 25+ Transactions
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-VYR-5001',
    senderId: 'USER-RAHUL-001',
    recipientId: 'USER-ABC-001',
    amount: 5000,
    timestamp: new Date().toISOString(),
    senderStatus: 'DEBITED',
    recipientStatus: 'NOT_RECEIVED',
    gatewayStatus: 'TIMEOUT',
    settlementStatus: 'NOT_COMPLETED',
    risk: 'HIGH',
    incidentId: 'INC-VYR-5001',
    resolutionStatus: 'PENDING',
    type: 'UNCERTAIN'
  },
  {
    id: 'TXN-VYR-5002',
    senderId: 'USER-RAHUL-001',
    recipientId: 'USER-ABC-001',
    amount: 5000,
    timestamp: new Date().toISOString(),
    senderStatus: 'DEBITED',
    recipientStatus: 'RECEIVED',
    gatewayStatus: 'SUCCESS',
    settlementStatus: 'COMPLETED',
    risk: 'HIGH',
    incidentId: 'INC-VYR-5002',
    resolutionStatus: 'RESOLVED',
    type: 'DUPLICATE_SUSPECTED'
  },
  ...Array.from({ length: 25 }).map((_, i) => {
    const isSender = i % 2 === 0;
    const isSuccess = i % 5 !== 0;
    return {
      id: `TXN-SIM-${1000 + i}`,
      senderId: isSender ? 'USER-RAHUL-001' : `USER-RANDOM-${i}`,
      recipientId: isSender ? (i % 3 === 0 ? 'USER-ABC-001' : `USER-MERCHANT-${i}`) : 'USER-ABC-001',
      amount: (i + 1) * 250,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      senderStatus: isSuccess ? 'DEBITED' : 'FAILED',
      recipientStatus: isSuccess ? 'RECEIVED' : 'NOT_RECEIVED',
      gatewayStatus: isSuccess ? 'SUCCESS' : 'FAILED',
      settlementStatus: isSuccess ? 'COMPLETED' : 'NOT_COMPLETED',
      risk: isSuccess ? 'LOW' : 'MEDIUM',
      incidentId: null,
      resolutionStatus: isSuccess ? 'RESOLVED' : 'FAILED',
      type: 'STANDARD'
    };
  })
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-VYR-5001',
    transactionId: 'TXN-VYR-5001',
    type: 'UNCERTAIN_PAYMENT',
    risk: 'HIGH',
    status: 'ACTIVE',
    evidence: null,
    actions: [],
    resolution: null
  },
  {
    id: 'INC-VYR-5002',
    transactionId: 'TXN-VYR-5002',
    type: 'DUPLICATE_RISK',
    risk: 'HIGH',
    status: 'RESOLVED',
    evidence: { reason: 'Previous transaction reached confirmed state.' },
    actions: ['BLOCK RETRY'],
    resolution: 'BLOCKED'
  }
];

class GlobalStore {
  transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  incidents: Incident[] = [...INITIAL_INCIDENTS];

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
    return this.transactions.filter(t => t.senderId === userId || t.recipientId === userId);
  }

  getIncidents(userId: string) {
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
}

export const store = new GlobalStore();
