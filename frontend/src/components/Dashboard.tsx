import { useEffect, useState } from 'react';
import { fetchTransactions, createIncident } from '../api';
import { ShieldAlert, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export default function Dashboard({ onIncidentCreated }: { onIncidentCreated: (id: string) => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions().then(data => setTransactions(data.transactions || []));
  }, []);

  const handleAskViyora = async (txId: string) => {
    const res = await createIncident(txId);
    onIncidentCreated(res.incident_id);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'SUCCESS' || status === 'REFUNDED') return <CheckCircle2 className="text-primary w-5 h-5" />;
    if (status === 'TIMEOUT' || status === 'FAILED') return <ShieldAlert className="text-danger w-5 h-5" />;
    return <Clock className="text-warning w-5 h-5" />;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
          <p className="text-gray-400 text-sm">Monitor and resolve your payment issues</p>
        </div>
        <button 
          onClick={() => handleAskViyora("TXN-VYR-5001")}
          className="bg-primary hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
          <PlayCircle className="w-5 h-5" />
          ▶ RUN VIYORA DEMO
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-300 text-sm">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Recipient</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Risk</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-300">{tx.id}</td>
                <td className="px-6 py-4">{tx.recipient}</td>
                <td className="px-6 py-4">₹{tx.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                    <span className="text-sm font-medium">{tx.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${tx.risk === 'HIGH' ? 'bg-danger/10 border-danger text-danger' : 'bg-primary/10 border-primary text-primary'}`}>
                    {tx.risk}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleAskViyora(tx.id)}
                    className="text-sm text-info hover:text-blue-300 transition-colors underline-offset-4 hover:underline">
                    Ask Viyora
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
