import { Network, Bot, CheckCircle2 } from 'lucide-react';
import { USERS, store } from '../store';

export default function MerchantConnectionsView({ currentUser }: any) {
  if (!currentUser || currentUser.role === 'PARENT_AGENT') {
    return <div className="p-8 text-center text-slate-400">Please switch to an individual user workspace.</div>;
  }

  const connections = store.getConnections(currentUser.id);
  const authorizedMerchantIds = connections.filter((c: any) => c.authorized).map((c: any) => c.merchantId);
  const merchants = Object.values(USERS).filter((u: any) => u.role === 'MERCHANT' && authorizedMerchantIds.includes(u.id));

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full h-full overflow-y-auto custom-scrollbar">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-2">
          <Network className="w-5 h-5 text-info" /> MY MERCHANT CONNECTIONS
        </h2>
        <p className="text-sm text-slate-400">Authorized merchant AI agents that your personal agent can communicate with over the Agent Bus.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {merchants.map(merchant => {
          const merchantTx = store.transactions.filter(tx => tx.senderId === currentUser.id && tx.recipientId === merchant.id);
          const txCount = merchantTx.length;
          const incidentCount = merchantTx.filter(tx => tx.incidentId).length;
          
          return (
            <div key={merchant.id} className="glass rounded-2xl border border-slate-700/50 p-6 flex flex-col shadow-lg hover:border-slate-500 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">{merchant.name}</h3>
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CONNECTED
                </span>
              </div>
              
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Transactions</span>
                  <span className="text-white font-mono font-bold">{txCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Active Incidents</span>
                  <span className={incidentCount > 0 ? "text-warning font-mono font-bold" : "text-white font-mono font-bold"}>{incidentCount}</span>
                </div>
              </div>
              
              <div className="mt-auto bg-slate-900/80 border border-slate-700 p-3 rounded-lg flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="bg-slate-800 p-1.5 rounded-full border border-slate-600"><Bot className="w-4 h-4 text-info" /></div>
                   <span className="text-xs font-bold text-slate-300">{merchant.name} AI Agent</span>
                 </div>
                 <span className="text-[9px] text-slate-500 font-mono tracking-wider">AUTHORIZED</span>
              </div>
            </div>
          );
        })}
        {merchants.length === 0 && (
          <div className="text-slate-500 col-span-2">No active merchant connections found.</div>
        )}
      </div>
    </div>
  );
}
