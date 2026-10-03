import { useEffect, useState } from 'react';
import { runInvestigation, fetchIncidentReport, resolveIncident } from '../api';
import { Bot, Network, AlertTriangle, CheckCircle, Server, ShieldCheck, User, Loader2, Activity, Shield, CheckCircle2 } from 'lucide-react';

export default function AgentConsole({ incidentId, onBack, demoContext }: { incidentId: string, onBack: () => void, demoContext?: any }) {
  const [report, setReport] = useState<any>(null);
  const [localStage, setLocalStage] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);

  // Use demoContext step to drive the UI if the demo is running, otherwise use localStage
  const stage = (demoContext?.isRunning && incidentId === 'TXN-VYR-5001') ? 
    (demoContext.step <= 1 ? 0 : 
     demoContext.step <= 3 ? 1 : 
     demoContext.step <= 7 ? 2 : 
     demoContext.step <= 8 ? 3 : 
     demoContext.step <= 9 ? 4 : 
     demoContext.step <= 11 ? 5 : 6) 
    : localStage;

  const fetchAndSetReport = async () => {
    const data = await fetchIncidentReport(incidentId);
    setReport(data);
    setLogs(data.events || []);
  };

  useEffect(() => {
    fetchAndSetReport();
  }, [incidentId]);

  const startInvestigation = async () => {
    setLocalStage(1); // INVESTIGATING
    setTimeout(() => setLocalStage(2), 1000); // VERIFYING
    setTimeout(() => setLocalStage(3), 2000); // DECIDING
    setTimeout(async () => {
      await runInvestigation(incidentId);
      await fetchAndSetReport();
      setLocalStage(4); // ACTING
    }, 3000);
  };

  const handleResolve = async () => {
    setLocalStage(5); // VERIFYING OUTCOME
    setTimeout(async () => {
      await resolveIncident(incidentId);
      await fetchAndSetReport();
      setLocalStage(6); // MONITORING / RESOLVED
    }, 2000);
  };

  if (!report) return <div className="p-8 flex justify-center items-center h-full"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  const { transaction } = report;

  return (
    <div className="flex h-full w-full">
      {/* Main Autonomous Interface (Center) */}
      <div className="flex-1 flex flex-col border-r border-slate-700/50 bg-slate-900">
        
        {/* Header */}
        <div className="h-16 border-b border-primary/30 flex items-center px-6 bg-slate-800/80 shrink-0 justify-between shadow-lg z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700">←</button>
            <div className="bg-slate-900 p-1.5 rounded-full border border-primary/50 relative">
                 <Bot className="w-6 h-6 text-primary" />
                 <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <h3 className="font-bold text-slate-200">VIYORA AI AGENT</h3>
              <p className="text-xs text-info font-mono uppercase tracking-wider">Autonomous Incident Resolution</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 shadow-inner">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">INCIDENT</span>
               <span className="text-xs font-mono text-white">{incidentId}</span>
             </div>
          </div>
        </div>

        {/* Autonomous Lifecycle UI */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col max-w-4xl mx-auto w-full">
          
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Agent Lifecycle</h4>
            <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700 font-mono text-[10px]">
               <div className={`flex flex-col items-center gap-1 ${stage >= 0 ? 'text-primary' : 'text-slate-600'}`}><CheckCircle className="w-4 h-4" /> DETECTED</div>
               <div className="flex-1 h-px bg-slate-700 mx-2"></div>
               <div className={`flex flex-col items-center gap-1 ${stage >= 1 ? 'text-info' : 'text-slate-600'}`}>{stage === 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} INVESTIGATE</div>
               <div className="flex-1 h-px bg-slate-700 mx-2"></div>
               <div className={`flex flex-col items-center gap-1 ${stage >= 2 ? 'text-warning' : 'text-slate-600'}`}>{stage === 2 ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} VERIFY</div>
               <div className="flex-1 h-px bg-slate-700 mx-2"></div>
               <div className={`flex flex-col items-center gap-1 ${stage >= 3 ? 'text-purple-400' : 'text-slate-600'}`}>{stage === 3 ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} DECIDE</div>
               <div className="flex-1 h-px bg-slate-700 mx-2"></div>
               <div className={`flex flex-col items-center gap-1 ${stage >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>{stage === 4 ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} ACT</div>
               <div className="flex-1 h-px bg-slate-700 mx-2"></div>
               <div className={`flex flex-col items-center gap-1 ${stage >= 6 ? 'text-primary' : 'text-slate-600'}`}>{stage === 5 ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} RESOLVED</div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Step 1: Detect */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex items-start gap-4">
              <div className="bg-slate-900 p-2 rounded-full border border-slate-600"><AlertTriangle className="w-5 h-5 text-warning" /></div>
              <div className="flex-1">
                <div className="text-xs font-bold text-warning uppercase tracking-wider mb-1">STEP 1 — DETECT</div>
                <h4 className="text-sm font-bold text-white mb-2">Payment state inconsistency detected.</h4>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-sm text-slate-300 font-mono">
                  TXN: {transaction?.id} <br/>
                  Amount: ₹{transaction?.amount} → {transaction?.recipient} <br/>
                  Context: User account debited, but gateway timeout detected.
                </div>
                {stage === 0 && (
                  <button onClick={startInvestigation} className="mt-4 bg-primary hover:bg-emerald-400 text-slate-900 font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
                    <Bot className="w-4 h-4" /> AUTHORIZE AUTONOMOUS INVESTIGATION
                  </button>
                )}
              </div>
            </div>

            {/* Step 2 & 3 & 4: Investigate & Verify */}
            {stage >= 1 && (
              <div className="bg-slate-800 border border-info/30 rounded-xl p-5 shadow-lg flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in">
                <div className="bg-slate-900 p-2 rounded-full border border-info/50"><Network className="w-5 h-5 text-info" /></div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-info uppercase tracking-wider mb-1">STEP 2-4 — INVESTIGATE & VERIFY</div>
                  <h4 className="text-sm font-bold text-white mb-2">Cross-Agent Verification in progress...</h4>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Checking {transaction?.customer}'s transaction context.</div>
                    {stage >= 2 && <div className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Requesting recipient-side verification.</div>}
                    {stage >= 2 && <div className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Scoped verification request sent to {transaction?.recipient} Agent over Agent Bus.</div>}
                    
                    {stage >= 3 && (
                      <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 mt-2">
                        <div className="text-xs text-slate-500 font-mono mb-2">EVIDENCE RECEIVED FROM RECIPIENT AGENT:</div>
                        <ul className="text-sm font-mono text-warning space-y-1 ml-2">
                          <li>- Transaction not found.</li>
                          <li>- Receipt not received.</li>
                          <li>- Settlement not completed.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 & 6: Decide & Act */}
            {stage >= 4 && (
              <div className="bg-slate-800 border border-danger/30 rounded-xl p-5 shadow-lg flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in">
                <div className="bg-slate-900 p-2 rounded-full border border-danger/50"><Shield className="w-5 h-5 text-danger" /></div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-danger uppercase tracking-wider mb-1">STEP 5-8 — REASON, DECIDE & ACT</div>
                  <h4 className="text-sm font-bold text-white mb-2">Both sides indicate that the payment has not reached a final state.</h4>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Transaction State</div>
                      <div className="text-warning font-bold">UNCERTAIN</div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Risk Level</div>
                      <div className="text-danger font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> HIGH RISK</div>
                    </div>
                  </div>

                  {demoContext?.escalationStatus === 'ESCALATED' ? (
                     <div className="bg-danger/10 border border-danger/30 p-4 rounded-lg">
                       <div className="text-xs text-danger font-bold uppercase mb-1">AUTONOMOUS ACTION TAKEN</div>
                       <div className="text-white text-sm font-bold">Escalated to human review.</div>
                       <div className="text-slate-300 text-sm mt-1">Evidence is insufficient to safely resolve this transaction automatically.</div>
                     </div>
                  ) : (
                     <div className="bg-danger/10 border border-danger/30 p-4 rounded-lg">
                       <div className="text-xs text-danger font-bold uppercase mb-1">AUTONOMOUS ACTION TAKEN</div>
                       <div className="text-white text-sm font-bold">Duplicate retry BLOCKED.</div>
                       <div className="text-slate-300 text-sm mt-1">Retrying now could result in a duplicate payment since the previous one hasn't reached a final state.</div>
                     </div>
                  )}

                  {stage === 4 && demoContext?.escalationStatus !== 'ESCALATED' && (
                    <button onClick={handleResolve} className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                      <ShieldCheck className="w-5 h-5" /> AUTHORIZE RECONCILIATION
                    </button>
                  )}
                  {demoContext?.escalationStatus === 'ESCALATED' && (
                    <div className="mt-4 w-full bg-slate-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                      <User className="w-5 h-5" /> AWAITING HUMAN REVIEW
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Resolve & Monitor */}
            {stage >= 6 && (
              <div className="bg-slate-800 border border-primary/30 rounded-xl p-5 shadow-lg flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in">
                <div className="bg-slate-900 p-2 rounded-full border border-primary/50"><CheckCircle className="w-5 h-5 text-primary" /></div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">STEP 9-10 — RESOLUTION & MONITORING</div>
                  <h4 className="text-sm font-bold text-white mb-2">Reconciliation initiated successfully.</h4>
                  <p className="text-sm text-slate-300 mb-2">VIYORA will continue monitoring in the background until the transaction reaches a final state and the refund is fully processed.</p>
                  <div className="bg-slate-900/80 p-3 rounded border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Monitoring active
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Intelligence Sidebar (Right) */}
      <div className="w-80 bg-slate-900/50 flex flex-col flex-shrink-0 border-l border-slate-700/50">
        <div className="p-5 border-b border-slate-700/50 bg-slate-800/30">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" /> Active Policy Engine
          </h4>
        </div>
        
        <div className="p-5 flex flex-col gap-6 overflow-y-auto">
          
          {/* Agent Bus */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agent Network</span>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg flex flex-col items-center relative shadow-inner">
              <div className="flex justify-between w-full relative z-10 px-2">
                <div className={`flex flex-col items-center gap-1 ${stage >= 1 ? 'text-info' : 'text-slate-500'}`}>
                  <Bot className="w-6 h-6" />
                  <span className="text-[9px] font-mono font-bold">CUSTOMER</span>
                </div>
                <div className={`flex flex-col items-center gap-1 ${stage >= 2 ? 'text-warning' : 'text-slate-500'}`}>
                  <Server className="w-6 h-6" />
                  <span className="text-[9px] font-mono font-bold">RECIPIENT</span>
                </div>
              </div>
              <div className="absolute top-7 left-10 right-10 h-[2px] bg-slate-700">
                {stage >= 2 && <div className="h-full bg-info animate-pulse"></div>}
              </div>
              {stage >= 2 && (
                <div className="mt-4 w-full bg-emerald-900/20 border border-emerald-500/30 p-2 rounded text-center">
                  <span className="text-emerald-400 text-[10px] font-bold tracking-wider">✓ PRIVACY BOUNDARY ENFORCED</span>
                </div>
              )}
            </div>
          </div>

          {/* Policy Decision Box */}
          {stage >= 4 && (
            <div className="flex flex-col gap-2 animate-in fade-in">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Policy Engine Decision</span>
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg text-xs space-y-3 font-mono shadow-inner">
                {demoContext?.escalationStatus === 'ESCALATED' ? (
                  <>
                    <div>
                      <div className="text-slate-500 mb-1">AI Recommendation:</div>
                      <div className="text-white">"Escalate to human review."</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Policy Matched:</div>
                      <div className="text-danger font-bold">"Evidence is insufficient to safely resolve this transaction."</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Action Triggered:</div>
                      <div className="text-danger font-bold">"HUMAN ESCALATION REQUIRED"</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-slate-500 mb-1">AI Recommendation:</div>
                      <div className="text-white">"Do not retry."</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Policy Matched:</div>
                      <div className="text-warning">"Previous payment has not reached a final state."</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Permission:</div>
                      <div className="text-danger font-bold">"Retry blocked."</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Action Triggered:</div>
                      <div className="text-emerald-400 font-bold">"RECONCILIATION + MONITORING"</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Timeline */}
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Execution Log</span>
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 shadow-inner min-h-[150px]">
              <div className="space-y-4 border-l-2 border-slate-700 pl-4 ml-2 text-[10px] font-mono">
                {logs.length === 0 && <div className="text-slate-500 italic">Awaiting telemetry...</div>}
                {logs.map((log: any, i: number) => {
                  let color = 'text-slate-400';
                  let dot = 'bg-slate-500';
                  if (log.type === 'RISK' || log.type === 'POLICY') { color = 'text-danger'; dot = 'bg-danger'; }
                  else if (log.type === 'SUCCESS' || log.type === 'VERIFY' || log.type === 'PRIVACY') { color = 'text-emerald-400'; dot = 'bg-emerald-400'; }
                  else if (log.type === 'AGENT_BUS') { color = 'text-info'; dot = 'bg-info'; }

                  return (
                    <div key={i} className="relative animate-in slide-in-from-left-2 fade-in">
                      <div className={`w-2.5 h-2.5 rounded-full ${dot} absolute -left-[21px] top-0 border-2 border-slate-800`} />
                      <div className={`${color} font-bold mb-0.5`}>[{log.type}]</div>
                      <div className="text-slate-300 leading-tight">{log.message}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
