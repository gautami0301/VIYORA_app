import React from 'react';
import { Activity, CheckCircle2, ShieldAlert, Clock, Bot, ExternalLink } from 'lucide-react';
import { createIncident } from '../api';

export default function TransactionsView({ transactions, onOpenIncident, currentUser }: any) {
  const isCustomer = currentUser?.role === 'CUSTOMER';

  const getStatusIcon = (status: string) => {
    if (status === 'SUCCESS' || status === 'COMPLETED' || status === 'RECEIVED' || status === 'RESOLVED') return <CheckCircle2 className="text-primary w-4 h-4" />;
    if (status === 'TIMEOUT' || status === 'FAILED' || status === 'NOT_RECEIVED') return <ShieldAlert className="text-danger w-4 h-4" />;
    return <Clock className="text-warning w-4 h-4" />;
  };

  const getRecipientName = (tx: any) => {
    if (isCustomer) {
       return tx.recipientId === 'USER-ABC-001' ? 'ABC Electronics' : 'Merchant';
    } else {
       return tx.senderId === 'USER-RAHUL-001' ? 'Rahul' : 'Customer';
    }
  };
  
  const getDisplayStatus = (tx: any) => {
    return isCustomer ? tx.senderStatus : tx.recipientStatus;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Activity className="text-info w-6 h-6" /> All Transactions</h2>
          <p className="text-slate-400 mt-1">Complete history of your financial activities.</p>
        </div>
      </div>

      <div className="glass rounded-xl border border-slate-700/50 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-300 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Transaction ID</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">{isCustomer ? 'Recipient' : 'Sender'}</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Amount</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Risk</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400">{tx.id}</td>
                  <td className="px-6 py-4 font-medium">{getRecipientName(tx)}</td>
                  <td className="px-6 py-4">₹{tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(getDisplayStatus(tx))}
                      <span>{getDisplayStatus(tx)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${tx.risk === 'HIGH' ? 'bg-danger/10 border-danger/50 text-danger' : 'bg-primary/10 border-primary/50 text-primary'}`}>
                      {tx.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={async () => {
                        const res = await createIncident(tx.id);
                        onOpenIncident(res.incident_id);
                      }}
                      className="inline-flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition-colors">
                      <Bot className="w-3 h-3" /> Ask VIYORA
                    </button>
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
