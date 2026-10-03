import { Bot, AlertTriangle, Activity, CheckCircle2, ShieldAlert, Clock, ArrowRight, Server, ShieldCheck, Loader2, Search, ArrowRightLeft, Network } from 'lucide-react';
import { createIncident } from '../api';

export default function HomeView({ transactions, incidents, onOpenIncident, onNavigate, demoContext, currentUser }: any) {
  const problemTx = transactions.find((tx: any) => tx.id === 'TXN-VYR-5001' || tx.risk === 'HIGH');
  const isCustomer = currentUser?.role === 'CUSTOMER';
  
  // Dynamic KPIs
  const totalAmount = transactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);
  const successTx = transactions.filter((tx: any) => tx.resolutionStatus === 'RESOLVED' || tx.gatewayStatus === 'SUCCESS').length;
  const pendingTx = transactions.filter((tx: any) => tx.gatewayStatus === 'TIMEOUT' || tx.settlementStatus === 'NOT_COMPLETED').length;
  const activeIncs = incidents.filter((i: any) => i.status === 'ACTIVE').length;
  const resolvedIncs = incidents.filter((i: any) => i.status === 'RESOLVED').length;
  const duplicateRisks = incidents.filter((i: any) => i.type === 'DUPLICATE_RISK' || i.type === 'DUPLICATE_SUSPECTED').length + transactions.filter((t: any) => t.type === 'DUPLICATE_SUSPECTED').length;
  const amountInvestigating = transactions.filter((tx: any) => tx.resolutionStatus === 'PENDING').reduce((acc: number, tx: any) => acc + tx.amount, 0);

  // Use demo state for transaction status if demo is running
  const getDemoStatus = (tx: any) => {
    if (demoContext?.isRunning && tx.id === 'TXN-VYR-5001') {
      return demoContext.transactionState;
    }
    return isCustomer ? tx.senderStatus : tx.recipientStatus;
  };

  const getRecipientName = (tx: any) => {
    if (isCustomer) {
       return tx.recipientId === 'USER-ABC-001' ? 'ABC Electronics' : 'Merchant';
    } else {
       return tx.senderId === 'USER-RAHUL-001' ? 'Rahul' : 'Customer';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'SUCCESS' || status === 'REFUNDED') return <CheckCircle2 className="text-primary w-4 h-4" />;
    if (status === 'TIMEOUT' || status === 'FAILED') return <ShieldAlert className="text-danger w-4 h-4" />;
    return <Clock className="text-warning w-4 h-4" />;
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      
      {/* 1. VIYORA AI AGENT - ACTIVE WORK Section */}
      <div className="glass rounded-2xl border border-primary/50 flex flex-col overflow-hidden shadow-2xl shadow-primary/10">
        <div className="bg-slate-800/80 p-4 flex items-center justify-between border-b border-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-primary/50 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold flex items-center gap-2 text-primary">✦ VIYORA AI AGENT <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> ACTIVE</span></h2>
              <p className="text-xs text-slate-400">Your autonomous financial teammate</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 bg-slate-900/50">
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-white mb-2">VIYORA is already working for you.</h3>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              I'm monitoring your transactions and actively investigating issues, preventing duplicate payments, and verifying transaction outcomes. <br/><br/>
              <strong>VIYORA doesn't just tell you what happened. It investigates, collaborates, acts, verifies, and resolves.</strong>
            </p>

            <div className="flex gap-4">
               <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 flex-1 flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold text-white">{transactions.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider text-center">Transactions<br/>Monitored</span>
               </div>
               <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 flex-1 flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold text-warning">{activeIncs}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider text-center">Active<br/>Investigations</span>
               </div>
               <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 flex-1 flex flex-col justify-center items-center">
                  <span className="text-2xl font-bold text-emerald-400">{resolvedIncs}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider text-center">Actions<br/>Resolved</span>
               </div>
            </div>
          </div>

          <div className="flex-1">
             {demoContext?.isRunning ? (
                <div className="bg-slate-800/80 border border-primary/50 rounded-xl p-5 shadow-lg relative overflow-hidden h-full flex flex-col">
                  {demoContext.step < 12 && <div className="absolute top-0 left-0 w-1 h-full bg-primary animate-pulse"></div>}
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1">
                    {demoContext.step < 12 ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />} 
                    ✦ AUTONOMOUS TASK {demoContext.step === 12 && "- COMPLETE"}
                  </div>
                  <h4 className="font-bold text-white mb-1">Resolving {problemTx?.id || 'TXN-VYR-5001'}</h4>
                  <p className="text-xs text-slate-400 mb-4">₹{problemTx?.amount || 5000} to {problemTx?.recipient || 'ABC Electronics'}</p>
                  
                  <div className="space-y-2 text-xs font-mono flex-1">
                    <div className="flex items-center gap-2"><span className={demoContext.step >= 1 ? 'text-emerald-400' : 'text-slate-600'}>● Detecting</span></div>
                    <div className="flex items-center gap-2"><span className={demoContext.step >= 2 ? 'text-info' : 'text-slate-600'}>● Investigating</span></div>
                    <div className="flex items-center gap-2"><span className={demoContext.step >= 4 ? 'text-warning' : 'text-slate-600'}>● Agent-to-Agent Verification</span></div>
                    <div className="flex items-center gap-2"><span className={demoContext.step >= 8 ? 'text-purple-400' : 'text-slate-600'}>● Decision</span></div>
                    <div className="flex items-center gap-2"><span className={demoContext.step >= 9 ? 'text-danger' : 'text-slate-600'}>● Autonomous Action</span></div>
                    <div className="flex items-center gap-2"><span className={demoContext.step >= 10 ? 'text-primary' : 'text-slate-600'}>● Reconciliation</span></div>
                    <div className="flex items-center gap-2"><span className={demoContext.step >= 11 ? 'text-emerald-400' : 'text-slate-600'}>● Monitoring</span></div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">CURRENT ACTION</div>
                    <div className="text-xs text-white font-mono h-8">
                       {demoContext.autonomousActions[demoContext.autonomousActions.length - 1] || 'Initializing...'}
                    </div>
                  </div>
                </div>
             ) : problemTx ? (
                <div className="bg-slate-800/80 border border-warning/50 rounded-xl p-5 shadow-lg relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 left-0 w-1 h-full bg-warning animate-pulse"></div>
                  <div className="text-[10px] font-bold text-warning uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> CURRENT TASK
                  </div>
                  <h4 className="font-bold text-white mb-1">Investigating {problemTx.id}</h4>
                  <p className="text-xs text-slate-400 mb-4">₹{problemTx.amount} to {problemTx.recipient}</p>
                  
                  <div className="space-y-2 text-xs font-mono flex-1">
                    <div className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Detected inconsistency</div>
                    <div className="flex items-center gap-2 text-slate-300"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Context authorized</div>
                    <div className="flex items-center gap-2 text-warning font-bold"><Loader2 className="w-3 h-3 animate-spin" /> Investigating recipient status</div>
                    <div className="flex items-center gap-2 text-slate-500 pl-5">○ Applying safety policy</div>
                    <div className="flex items-center gap-2 text-slate-500 pl-5">○ Monitoring resolution</div>
                  </div>

                  <button 
                    onClick={async () => {
                      const res = await createIncident(problemTx.id);
                      onOpenIncident(res.incident_id);
                    }}
                    className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-2">
                    <ArrowRight className="w-3 h-3" /> OPEN INVESTIGATION
                  </button>
                </div>
             ) : (
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-lg h-full flex flex-col justify-center items-center text-center">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mb-3 opacity-50" />
                  <h4 className="font-bold text-white mb-1">All Systems Normal</h4>
                  <p className="text-xs text-slate-400">No active incidents require investigation. VIYORA is monitoring background activity.</p>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* NEW INTERACTIVE TRANSACTION INVESTIGATION PANEL */}
      <div className="glass rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden shadow-2xl relative">
         <div className="bg-slate-800/80 p-5 flex items-center justify-between border-b border-slate-700">
           <div>
             <h2 className="text-lg font-bold flex items-center gap-2 text-white"><Search className="w-5 h-5 text-info" /> VIYORA TRANSACTION INVESTIGATION</h2>
             <p className="text-sm text-slate-400 mt-1">Two protected agents investigate the same transaction from opposite sides.</p>
           </div>
           <button onClick={() => onNavigate('network')} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
             <Network className="w-4 h-4" /> View Agent Network
           </button>
         </div>

         <div className="p-8 flex flex-col items-center bg-slate-900/50 relative">
            <div className="w-full max-w-4xl flex items-start justify-between relative z-10">
               {/* Customer Side */}
               <div className="flex-1 bg-slate-800 border border-info/50 rounded-xl p-5 shadow-lg relative">
                 <div className="text-[10px] font-bold text-info uppercase tracking-wider mb-2 flex items-center gap-1">
                   <Bot className="w-4 h-4" /> CUSTOMER AGENT
                 </div>
                 <h3 className="font-bold text-white text-sm mb-1">Rahul's VIYORA Agent</h3>
                 <div className="text-xs font-mono text-slate-300 mt-3 space-y-1 bg-slate-900 p-3 rounded">
                    <div>TXN-VYR-5001</div>
                    <div>₹5,000</div>
                    <div className="text-emerald-400 mt-2 border-t border-slate-700 pt-2">Debit: DEBITED</div>
                    <div className="text-warning">Gateway: TIMEOUT</div>
                 </div>
                 <div className="mt-3 text-[10px] text-slate-500 font-bold uppercase text-center bg-info/10 py-1 rounded">
                   [ Authorized Context ]
                 </div>
               </div>

               {/* Agent Bus */}
               <div className="flex-1 px-4 flex flex-col items-center justify-center relative min-h-[200px]">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-slate-600 z-0 border-dashed border-t border-slate-600"></div>
                  <div className="bg-slate-900 border border-slate-600 px-4 py-3 rounded-lg text-[10px] font-mono font-bold text-slate-300 flex flex-col items-center z-10 relative shadow-2xl min-w-[200px]">
                    <ArrowRightLeft className="w-5 h-5 mb-2 text-primary" />
                    AGENT BUS
                    <div className="text-slate-500 mt-2 text-center text-[9px] leading-relaxed">
                      Transaction-scoped<br/>evidence exchange
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-1 items-center z-10 text-center">
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">✓ Privacy Boundary Enforced</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">✓ Minimum Evidence Exchange</span>
                  </div>
               </div>

               {/* Merchant Side */}
               <div className="flex-1 bg-slate-800 border border-warning/50 rounded-xl p-5 shadow-lg relative">
                 <div className="text-[10px] font-bold text-warning uppercase tracking-wider mb-2 flex items-center gap-1">
                   <Server className="w-4 h-4" /> MERCHANT AGENT
                 </div>
                 <h3 className="font-bold text-white text-sm mb-1">ABC Electronics VIYORA Agent</h3>
                 <div className="text-xs font-mono text-slate-300 mt-3 space-y-1 bg-slate-900 p-3 rounded">
                    <div>TXN-VYR-5001</div>
                    <div className="text-danger mt-2 border-t border-slate-700 pt-2">Receipt: NOT RECEIVED</div>
                    <div className="text-danger">Confirmation: NOT CONFIRMED</div>
                    <div className="text-danger">Settlement: NOT COMPLETED</div>
                 </div>
                 <div className="mt-3 text-[10px] text-slate-500 font-bold uppercase text-center bg-warning/10 py-1 rounded">
                   [ Authorized Context ]
                 </div>
               </div>
            </div>

            <div className="w-full max-w-4xl mt-8 pt-8 border-t border-slate-700 flex gap-8">
               <div className="flex-1">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Evidence Comparison</div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-3 rounded border border-slate-700 text-xs font-mono">
                      <div className="text-info font-bold mb-2">CUSTOMER AGENT</div>
                      <div className="text-slate-300">Debit = DEBITED</div>
                      <div className="text-slate-300">Gateway = TIMEOUT</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded border border-slate-700 text-xs font-mono relative">
                      <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-slate-500 font-bold text-sm bg-slate-900 px-1 rounded">VS</div>
                      <div className="text-warning font-bold mb-2">MERCHANT AGENT</div>
                      <div className="text-slate-300">Receipt = NOT RECEIVED</div>
                      <div className="text-slate-300">Settlement = NOT COMPLETED</div>
                    </div>
                 </div>
               </div>
               <div className="w-[300px] flex flex-col justify-center">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">VIYORA FINDING</div>
                 <div className="bg-danger/10 border border-danger/30 rounded p-4">
                   <div className="text-danger font-bold flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4" /> UNCERTAIN PAYMENT</div>
                   <p className="text-[10px] text-slate-300">"Both sides confirm that the transaction has not reached a final state."</p>
                   <div className="mt-3 flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Risk Level:</span>
                     <span className="text-[10px] bg-danger text-white px-2 py-0.5 rounded font-bold">HIGH</span>
                   </div>
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. AUTONOMOUS METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">{isCustomer ? 'TOTAL MONEY SENT' : 'TOTAL RECEIVED'}</div>
          <div className="text-xl font-bold">₹{totalAmount.toLocaleString()}</div>
        </div>
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">{isCustomer ? 'SUCCESSFUL PAYMENTS' : 'SUCCESSFUL RECEIPTS'}</div>
          <div className="text-xl font-bold text-primary">{successTx}</div>
        </div>
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">{isCustomer ? 'PENDING TRANSACTIONS' : 'PENDING RECEIPTS'}</div>
          <div className="text-xl font-bold text-warning">{pendingTx}</div>
        </div>
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">{isCustomer ? 'AMOUNT UNDER INVESTIGATION' : 'UNMATCHED PAYMENTS'}</div>
          <div className="text-xl font-bold text-info">₹{amountInvestigating.toLocaleString()}</div>
        </div>
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">ACTIVE INCIDENTS</div>
          <div className="text-xl font-bold text-danger">{activeIncs}</div>
        </div>
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">DUPLICATE RISKS</div>
          <div className="text-xl font-bold text-orange-400">{duplicateRisks}</div>
        </div>
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">{isCustomer ? 'RESOLVED INCIDENTS' : 'AUTO-RESOLVED'}</div>
          <div className="text-xl font-bold text-emerald-400">{resolvedIncs}</div>
        </div>
        <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
          <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">{isCustomer ? 'AGENT-TO-AGENT VERIFICATIONS' : 'SETTLEMENT PENDING'}</div>
          <div className="text-xl font-bold text-purple-400">{isCustomer ? 12 : pendingTx}</div>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS */}
      <div className="glass rounded-xl border border-slate-700/50 flex flex-col flex-1 min-h-[300px]">
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-info" /> Transaction Context</h3>
          <button onClick={() => onNavigate('transactions')} className="text-xs text-info hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
        </div>
        <div className="p-0 overflow-x-auto flex-1">
          <table className="w-full text-left text-sm h-full">
            <thead className="bg-slate-800/30 text-slate-400 sticky top-0">
              <tr>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Recipient</th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Risk Level</th>
                <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {transactions.slice(0, 5).map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-medium">{getRecipientName(tx)}</td>
                  <td className="px-5 py-4">₹{tx.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 flex items-center gap-2">{getStatusIcon(getDemoStatus(tx))} {getDemoStatus(tx)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${tx.risk === 'HIGH' && getDemoStatus(tx) !== 'VERIFIED' ? 'bg-danger/10 border-danger/50 text-danger' : 'bg-primary/10 border-primary/50 text-primary'}`}>
                      {getDemoStatus(tx) === 'VERIFIED' ? 'RESOLVED' : tx.risk}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {tx.risk === 'HIGH' && getDemoStatus(tx) !== 'VERIFIED' ? (
                      <button onClick={async () => {
                        const res = await createIncident(tx.id);
                        onOpenIncident(res.incident_id);
                      }} className="text-[10px] uppercase font-bold bg-danger/20 text-danger hover:bg-danger/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1 inline-flex">
                        <Bot className="w-3 h-3" /> View Investigation
                      </button>
                    ) : getDemoStatus(tx) === 'VERIFIED' ? (
                      <span className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1 justify-end">
                         <CheckCircle2 className="w-3 h-3" /> Reconciled + Verified
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase text-slate-500 font-bold flex items-center gap-1 justify-end">
                         <ShieldCheck className="w-3 h-3 text-emerald-500" /> Monitored
                      </span>
                    )}
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
