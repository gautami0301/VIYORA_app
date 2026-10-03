import { store, USERS } from './store';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTransactions() {
  await delay(100);
  return { transactions: store.transactions };
}

export async function fetchIncidents() {
  await delay(100);
  return { incidents: store.incidents };
}

export async function createIncident(transactionId: string) {
  await delay(300);
  const incidentId = `INC-VYR-${Math.floor(1000 + Math.random() * 9000)}`;
  store.incidents.push({
    id: incidentId,
    transactionId,
    type: 'MANUAL_INVESTIGATION',
    risk: 'MEDIUM',
    status: 'ACTIVE',
    evidence: null,
    actions: [],
    resolution: null
  });
  store.notify();
  return { incident_id: incidentId };
}

export async function runInvestigation(incidentId: string) {
  await delay(500);
  return { status: 'investigated', incidentId };
}

export async function resolveIncident(incidentId: string) {
  await delay(500);
  store.updateIncidentState(incidentId, { status: 'RESOLVED', resolution: 'RECONCILED + VERIFIED' });
  return { status: 'resolved' };
}

export async function fetchIncidentReport(incidentId: string) {
  await delay(200);
  const incident = store.incidents.find(i => i.id === incidentId);
  const transaction = store.transactions.find(t => t.id === incident?.transactionId);
  
  const getUserName = (id: string) => {
    const userKey = Object.keys(USERS).find(k => USERS[k].id === id);
    return userKey ? USERS[userKey].name : 'Unknown';
  };
  
  return {
    incident,
    transaction: transaction ? {
      ...transaction,
      customer: getUserName(transaction.senderId),
      recipient: getUserName(transaction.recipientId)
    } : null,
    events: [
      { type: 'SYSTEM', message: `Incident ${incidentId} opened.` },
      { type: 'VERIFY', message: `Customer context authorized.` },
      { type: 'AGENT_BUS', message: `Evidence requested via Agent Bus.` },
      { type: 'RISK', message: `Risk assessed as ${incident?.risk || transaction?.risk || 'UNKNOWN'}.` }
    ]
  };
}
