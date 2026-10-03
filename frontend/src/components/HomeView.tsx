import { Bot, Activity, CheckCircle2, ShieldAlert, Clock, ArrowRight, Server, ShieldCheck, Loader2, Search, ArrowRightLeft, Network, Users, Lightbulb, User, Home as HomeIcon } from 'lucide-react';
import { createIncident } from '../api';
import { store, USERS } from '../store';

export default function HomeView({ transactions, onOpenIncident, onNavigate, demoContext, currentUser }: any) {
  const problemTx = transactions.find((tx: any) => tx.id === 'TXN-VYR-5001' || tx.risk === 'HIGH');
  const isCustomer = currentUser?.role === 'CUSTOMER';
  
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

  if (currentUser?.role !== 'PARENT_AGENT') {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full custom-scrollbar">
        {/* 1. MY VIYORA AI AGENT */}
        <div className="glass rounded-2xl border border-emerald-500/50 flex flex-col shadow-2xl shadow-emerald-500/10 shrink-0">
          <div className="bg-slate-800/80 p-6 flex items-start gap-4 border-b border-emerald-500/30 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-emerald-500/50 flex items-center justify-center shrink-0">
              <Bot className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-emerald-400 tracking-wide">
                ✦ MY VIYORA <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE</span>
              </h2>
              <p className="text-sm font-bold text-white mt-1 uppercase tracking-widest">PERSONAL AI AGENT</p>
              <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Your autonomous financial teammate.
              </p>
            </div>
          </div>
        </div>

        {/* 2. MY FINANCIAL SUMMARY */}
        <div className="shrink-0 mt-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" /> MY FINANCIAL SUMMARY
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
            <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
              <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">My Transactions</div>
              <div className="text-xl font-bold">{transactions.length}</div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
              <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">My Patterns</div>
              <div className="text-xl font-bold text-primary">3</div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
              <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">My Active Incidents</div>
              <div className="text-xl font-bold text-danger">{transactions.some((t:any) => t.risk === 'HIGH') ? '1' : '0'}</div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
              <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">My Spending</div>
              <div className="text-xl font-bold text-emerald-400">₹{transactions.reduce((acc: number, t: any) => acc + t.amount, 0).toLocaleString()}</div>
            </div>
            <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
              <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">My Recommendations</div>
              <div className="text-xl font-bold text-warning">2</div>
            </div>
          </div>
        </div>

        {/* 3. MY MERCHANT CONNECTIONS */}
        <div className="shrink-0">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Network className="w-4 h-4 text-info" /> MY MERCHANT CONNECTIONS
             </h3>
             <button onClick={() => onNavigate('merchant-connections')} className="text-xs text-info hover:underline">View Analysis</button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {Object.values(USERS).filter((u: any) => u.role === 'MERCHANT').map((m: any) => {
               const connections = store.getConnections(currentUser.id);
               const isConnected = connections.find((c: any) => c.merchantId === m.id)?.authorized;
               
               return (
                 <div key={m.id} 
                      onClick={() => store.toggleConnection(currentUser.id, m.id)} 
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${isConnected ? 'bg-slate-800/80 border-info/50 hover:bg-slate-800' : 'bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/40 opacity-70'}`}>
                   <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                     <HomeIcon className={`w-3 h-3 ${isConnected ? 'text-info' : 'text-slate-500'}`} /> {m.name}
                   </h4>
                   <div className="text-[10px] flex justify-between items-center mt-2">
                     <span className="text-slate-400">Merchant AI Agent</span>
                     <span className={`font-bold uppercase ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>{isConnected ? 'Connected' : 'Disconnected'}</span>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* 4. MY AI AGENT ACTIVITY */}
        {problemTx && (
        <div className="shrink-0 bg-slate-800/80 border border-danger/40 rounded-2xl p-6 relative flex flex-col mt-4">
            <div className="absolute top-0 left-0 w-1 h-full bg-danger animate-pulse rounded-l-2xl"></div>
            <div className="text-[10px] font-bold text-danger uppercase tracking-wider mb-2 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> MY AI AGENT ACTIVITY
            </div>
            <h3 className="font-bold text-white text-lg mb-1">Investigating Incident</h3>
            <p className="text-xs text-slate-400 mb-4">Your agent is resolving a transaction issue on your behalf.</p>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex justify-between items-center text-xs font-mono">
               <div>
                  <div className="text-slate-500 uppercase tracking-widest mb-1 text-[10px]">Transaction</div>
                  <div className="text-white">{problemTx.id}</div>
               </div>
               <div>
                  <div className="text-slate-500 uppercase tracking-widest mb-1 text-[10px]">Merchant</div>
                  <div className="text-white">{getRecipientName(problemTx)}</div>
               </div>
               <button onClick={() => {
                 onOpenIncident(problemTx.incidentId || 'INC-VYR-5001');
               }} className="bg-danger/20 text-danger hover:bg-danger/30 px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                 View Incident <ArrowRight className="w-3 h-3" />
               </button>
            </div>
        </div>
        )}

        {/* 5. MY RECENT INSIGHTS */}
        <div className="shrink-0 mt-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
             <Lightbulb className="w-4 h-4 text-warning" /> MY RECENT INSIGHTS
          </h3>
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
             <p className="text-xs text-slate-300 leading-relaxed mb-4">
               "Based on your patterns, I expect a payment to one of your connected merchants within the next 10 days."
             </p>
             <button className="text-[10px] font-bold bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors uppercase text-info border border-slate-600">
               View Details
             </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full custom-scrollbar">
      
      {/* 1. VIYORA PARENT AI AGENT */}
      <div className="glass rounded-2xl border border-primary/50 flex flex-col shadow-2xl shadow-primary/10 shrink-0">
        <div className="bg-slate-800/80 p-6 flex items-start gap-4 border-b border-primary/30 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-primary/50 flex items-center justify-center shrink-0">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 text-primary tracking-wide">
              ✦ VIYORA <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> ACTIVE</span>
            </h2>
            <p className="text-sm font-bold text-white mt-1 uppercase tracking-widest">PARENT AI AGENT</p>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Autonomous financial intelligence across users, merchants and transactions.
            </p>
            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed max-w-3xl">
              VIYORA continuously monitors transaction activity across connected participants, identifies patterns and anomalies, forecasts possible upcoming activity, provides suggestions, and autonomously investigates transaction incidents.
            </p>
          </div>
        </div>
      </div>

      {/* 2. PARTICIPANTS UNDER VIYORA */}
      <div className="shrink-0">
         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
           <Users className="w-4 h-4 text-info" /> PARTICIPANTS UNDER VIYORA
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">USERS</div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><User className="w-3 h-3 text-primary" /> Rahul</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">126</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">4</span></div>
                      <div className="flex justify-between"><span>Incidents:</span> <span className="text-danger">1 active</span></div>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><User className="w-3 h-3 text-primary" /> Priya</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">89</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">3</span></div>
                      <div className="flex justify-between"><span>Incidents:</span> <span className="text-emerald-400">0 active</span></div>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><User className="w-3 h-3 text-primary" /> Arjun</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">104</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">2</span></div>
                      <div className="flex justify-between"><span>Incidents:</span> <span className="text-emerald-400">0 active</span></div>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><User className="w-3 h-3 text-primary" /> Sneha</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">73</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">3</span></div>
                      <div className="flex justify-between"><span>Incidents:</span> <span className="text-emerald-400">0 active</span></div>
                    </div>
                 </div>
               </div>
            </div>

            <div>
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-700 pb-2">MERCHANTS</div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><HomeIcon className="w-3 h-3 text-warning" /> ABC Electronics</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">2,481</span></div>
                      <div className="flex justify-between"><span>Customers:</span> <span className="text-white">734</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">182</span></div>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><HomeIcon className="w-3 h-3 text-warning" /> Amazon</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">1,824</span></div>
                      <div className="flex justify-between"><span>Customers:</span> <span className="text-white">512</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">97</span></div>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><HomeIcon className="w-3 h-3 text-warning" /> Zomato</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">1,156</span></div>
                      <div className="flex justify-between"><span>Customers:</span> <span className="text-white">421</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">64</span></div>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><HomeIcon className="w-3 h-3 text-warning" /> Reliance Digital</h4>
                    <div className="text-[10px] text-slate-400 space-y-1 font-mono">
                      <div className="flex justify-between"><span>Transactions:</span> <span className="text-white">843</span></div>
                      <div className="flex justify-between"><span>Customers:</span> <span className="text-white">213</span></div>
                      <div className="flex justify-between"><span>Patterns:</span> <span className="text-white">31</span></div>
                    </div>
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. VIYORA GLOBAL INTELLIGENCE */}
      <div className="shrink-0 mt-4">
        <div className="mb-4">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <Activity className="w-4 h-4 text-purple-400" /> VIYORA GLOBAL INTELLIGENCE
           </h3>
           <p className="text-xs text-slate-500 mt-1">Aggregated insights and continuous monitoring across the network.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-6">
          <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">User Agents Active</div>
            <div className="text-xl font-bold">4</div>
          </div>
          <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Merchant Agents</div>
            <div className="text-xl font-bold text-primary">4</div>
          </div>
          <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Agent Bus Communications</div>
            <div className="text-xl font-bold text-info">24/sec</div>
          </div>
          <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Transactions Analyzed</div>
            <div className="text-xl font-bold text-warning">8</div>
          </div>
          <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Active Incidents</div>
            <div className="text-xl font-bold text-danger">3</div>
          </div>
          <div className="glass p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
            <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase tracking-wider">Personalized Recommendations</div>
            <div className="text-xl font-bold text-purple-400">8</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
           <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-lg">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">GLOBAL OBSERVATION</div>
             <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <div className="text-xs text-slate-400 mb-3 font-mono">
                  Multiple individual user agents completed authorized merchant-side verification.
                  <br/><br/>
                  <span className="text-emerald-400">Priya AI Agent:</span> WAIT & MONITOR
                  <br/><br/>
                  <span className="text-info">Arjun AI Agent:</span> SAFE TO RETRY
                </div>
             </div>
           </div>
        </div>
      </div>



      {/* 7. LIVE MULTI-AGENT ANALYSIS */}
      <div className="glass rounded-2xl border border-slate-700/50 flex flex-col shadow-2xl relative shrink-0">
         <div className="bg-slate-800/80 p-5 flex items-center justify-between border-b border-slate-700 rounded-t-2xl">
           <div>
             <h2 className="text-lg font-bold flex items-center gap-2 text-white"><Search className="w-5 h-5 text-info" /> LIVE MULTI-AGENT ANALYSIS</h2>
             <p className="text-sm text-slate-400 mt-1">Simultaneous agent-to-agent negotiations across the network.</p>
           </div>
           <button onClick={() => onNavigate('network')} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
             <Network className="w-4 h-4" /> View Agent Network
           </button>
         </div>

         <div className="p-8 flex flex-col items-center bg-slate-900/50 relative rounded-b-2xl overflow-hidden gap-8">
            {/* Analysis Flow 1: Priya vs Zomato */}
            <div className="w-full max-w-5xl flex items-start justify-between relative z-10 border border-slate-700 p-4 rounded-xl bg-slate-800/40">
               <div className="absolute top-0 left-0 w-1 h-full bg-warning rounded-l-xl"></div>
               {/* Customer Side */}
               <div className="flex-1 bg-slate-800 border border-info/50 rounded-xl p-4 shadow-lg relative">
                 <div className="text-[10px] font-bold text-info uppercase tracking-wider mb-2 flex items-center gap-1">
                   <Bot className="w-4 h-4" /> PRIYA AI AGENT
                 </div>
                 <h3 className="font-bold text-white text-sm mb-1">Analyzing P-003</h3>
                 <div className="text-xs font-mono text-slate-300 mt-3 space-y-1 bg-slate-900 p-3 rounded">
                    <div>Amount: ₹1,200</div>
                    <div className="text-emerald-400">Debit: DEBITED</div>
                    <div className="text-warning">Gateway: TIMEOUT</div>
                 </div>
                 <div className="mt-2 text-[10px] font-bold text-slate-400">Context: Above recent average. Payment mismatch detected.</div>
               </div>

               {/* Agent Bus */}
               <div className="flex-1 px-4 flex flex-col items-center justify-center relative min-h-[160px]">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-slate-600 z-0 border-dashed border-t border-slate-600"></div>
                  <div className="bg-slate-900 border border-slate-600 px-4 py-2 rounded-lg text-[10px] font-mono font-bold text-slate-300 flex flex-col items-center z-10 relative shadow-2xl">
                    <ArrowRightLeft className="w-4 h-4 mb-1 text-primary" />
                    AGENT BUS
                  </div>
                  <div className="mt-2 flex flex-col gap-1 items-center z-10 text-center">
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Authorized Context</span>
                    <span className="text-[9px] text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20 animate-pulse">Negotiating</span>
                  </div>
               </div>

               {/* Merchant Side */}
               <div className="flex-1 bg-slate-800 border border-warning/50 rounded-xl p-4 shadow-lg relative">
                 <div className="text-[10px] font-bold text-warning uppercase tracking-wider mb-2 flex items-center gap-1">
                   <Server className="w-4 h-4" /> ZOMATO AI AGENT
                 </div>
                 <h3 className="font-bold text-white text-sm mb-1">Analyzing P-003</h3>
                 <div className="text-xs font-mono text-slate-300 mt-3 space-y-1 bg-slate-900 p-3 rounded">
                    <div className="text-danger">Receipt: NOT RECEIVED</div>
                    <div className="text-danger">Order: NOT CONFIRMED</div>
                 </div>
                 <div className="mt-2 text-[10px] font-bold text-warning">Finding: WAIT & MONITOR</div>
               </div>
            </div>

            {/* Analysis Flow 2: Arjun vs Reliance Digital */}
            <div className="w-full max-w-5xl flex items-start justify-between relative z-10 border border-slate-700 p-4 rounded-xl bg-slate-800/40">
               <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-xl"></div>
               {/* Customer Side */}
               <div className="flex-1 bg-slate-800 border border-info/50 rounded-xl p-4 shadow-lg relative">
                 <div className="text-[10px] font-bold text-info uppercase tracking-wider mb-2 flex items-center gap-1">
                   <Bot className="w-4 h-4" /> ARJUN AI AGENT
                 </div>
                 <h3 className="font-bold text-white text-sm mb-1">Analyzing A-003</h3>
                 <div className="text-xs font-mono text-slate-300 mt-3 space-y-1 bg-slate-900 p-3 rounded">
                    <div>Amount: ₹18,999</div>
                    <div className="text-warning">Debit: PENDING</div>
                    <div className="text-danger">Gateway: FAILED</div>
                 </div>
                 <div className="mt-2 text-[10px] font-bold text-slate-400">Context: Large transaction. Bank delay detected.</div>
               </div>

               {/* Agent Bus */}
               <div className="flex-1 px-4 flex flex-col items-center justify-center relative min-h-[160px]">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-slate-600 z-0 border-dashed border-t border-slate-600"></div>
                  <div className="bg-slate-900 border border-slate-600 px-4 py-2 rounded-lg text-[10px] font-mono font-bold text-slate-300 flex flex-col items-center z-10 relative shadow-2xl">
                    <ArrowRightLeft className="w-4 h-4 mb-1 text-primary" />
                    AGENT BUS
                  </div>
                  <div className="mt-2 flex flex-col gap-1 items-center z-10 text-center">
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Authorized Context</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Verified</span>
                  </div>
               </div>

               {/* Merchant Side */}
               <div className="flex-1 bg-slate-800 border border-emerald-500/50 rounded-xl p-4 shadow-lg relative">
                 <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                   <Server className="w-4 h-4" /> RELIANCE DIGITAL AI AGENT
                 </div>
                 <h3 className="font-bold text-white text-sm mb-1">Analyzing A-003</h3>
                 <div className="text-xs font-mono text-slate-300 mt-3 space-y-1 bg-slate-900 p-3 rounded">
                    <div className="text-emerald-400">Receipt: CANCELLED</div>
                    <div className="text-emerald-400">Order: VOIDED</div>
                 </div>
                 <div className="mt-2 text-[10px] font-bold text-emerald-400">Finding: SAFE TO RETRY</div>
               </div>
            </div>
         </div>
      </div>

      {/* 8. TRANSACTION CONTEXT */}
      <div className="glass rounded-xl border border-slate-700/50 flex flex-col flex-1 shrink-0 min-h-[300px]">
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-info" /> Transaction Context</h3>
          <button onClick={() => onNavigate('transactions')} className="text-xs text-info hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
        </div>
        <div className="p-0 overflow-auto flex-1 max-h-[400px] custom-scrollbar">
          <table className="w-full text-left text-sm h-full">
            <thead className="bg-slate-800/30 text-slate-400 sticky top-0 z-10">
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
