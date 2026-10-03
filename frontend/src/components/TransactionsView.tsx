import { Activity, CheckCircle2, ShieldAlert, Clock, Bot, AlertTriangle } from 'lucide-react';
import { createIncident } from '../api';
import { USERS } from '../store';

export default function TransactionsView({ transactions, onOpenIncident }: any) {
  const getStatusIcon = (status: string) => {
    if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'RECEIVED' || status === 'RESOLVED') return <CheckCircle2 className="text-primary w-4 h-4" />;
    if (status === 'TIMEOUT' || status === 'FAILED' || status === 'NOT_RECEIVED') return <ShieldAlert className="text-danger w-4 h-4" />;
    return <Clock className="text-warning w-4 h-4" />;
  };

  const getUserName = (id: string) => USERS[Object.keys(USERS).find(k => USERS[k].id === id) || '']?.name || 'Unknown';
  const getAgentName = (id: string) => USERS[Object.keys(USERS).find(k => USERS[k].id === id) || '']?.agentId || 'AI Agent';

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Activity className="text-info w-6 h-6" /> All Transactions</h2>
          <p className="text-slate-400 mt-1">Complete history of financial activities across the network.</p>
        </div>
      </div>

      <div className="glass rounded-xl border border-slate-700/50 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-300 sticky top-0">
              <tr>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">User</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Merchant</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Transaction ID</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Amount</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Risk</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Agent</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Incident</th>
                <th className="px-4 py-4 font-medium uppercase tracking-wider text-[10px]">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 font-bold">{getUserName(tx.senderId)}</td>
                  <td className="px-4 py-4">{getUserName(tx.recipientId)}</td>
                  <td className="px-4 py-4 font-mono text-slate-400">{tx.id}</td>
                  <td className="px-4 py-4 font-mono">₹{tx.amount.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.gatewayStatus)}
                      <span className="text-xs">{tx.gatewayStatus}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${tx.risk === 'HIGH' ? 'bg-danger/10 border-danger/50 text-danger' : tx.risk === 'MEDIUM' ? 'bg-warning/10 border-warning/50 text-warning' : 'bg-primary/10 border-primary/50 text-primary'}`}>
                      {tx.risk}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[10px] text-info flex items-center gap-1 mt-2.5">
                    <Bot className="w-3 h-3" /> {getAgentName(tx.senderId)}
                  </td>
                  <td className="px-4 py-4">
                    {tx.incidentId ? (
                      <button 
                        onClick={async () => {
                          const res = await createIncident(tx.id);
                          onOpenIncident(res.incident_id);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] bg-danger/20 hover:bg-danger/30 text-danger px-2 py-1 rounded transition-colors border border-danger/30">
                        <AlertTriangle className="w-3 h-3" /> Incident
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-[10px] font-bold">
                    {tx.agentRecommendation || 'WAIT & MONITOR'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
