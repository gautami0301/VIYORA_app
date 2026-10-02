import React, { useState } from 'react';
import { Network, Server, Bot, ArrowRightLeft, ShieldCheck, AlertTriangle, Shield, CheckCircle2, ChevronRight, Activity, Search } from 'lucide-react';

export default function AgentNetworkView({ transactions, demoContext, currentUser }: any) {
  const [selectedTxId, setSelectedTxId] = useState<string>('TXN-VYR-5001');
  const viewMode = currentUser?.role === 'CUSTOMER' ? 'CUSTOMER' : 'MERCHANT';

  const tx = transactions?.find((t: any) => t.id === selectedTxId) || transactions?.[0] || {
    id: 'TXN-VYR-5001',
    senderId: 'USER-RAHUL-001',
    recipientId: 'USER-ABC-001',
    amount: 5000,
    gatewayStatus: 'TIMEOUT',
    risk: 'HIGH',
    type: 'STANDARD'
  };

  const isHighRisk = tx.risk === 'HIGH';
  const customerName = tx.senderId === 'USER-RAHUL-001' ? 'Rahul' : 'Customer';
  const merchantName = tx.recipientId === 'USER-ABC-001' ? 'ABC Electronics' : 'Merchant';

  // Computed state for demo logic based on transaction
  let debitStatus = tx.gatewayStatus === 'FAILED' ? 'NOT_DEBITED' : 'DEBITED';
  let receiptStatus = tx.gatewayStatus === 'SUCCESS' ? 'RECEIVED' : 'NOT_RECEIVED';
  let settlementStatus = tx.gatewayStatus === 'SUCCESS' ? 'SETTLED' : 'NOT_COMPLETED';

  if (demoContext?.isRunning && tx.id === 'TXN-VYR-5001') {
     if (demoContext.step >= 6) {
       receiptStatus = demoContext.evidence?.receipt || 'NOT_RECEIVED';
       settlementStatus = demoContext.evidence?.settlement || 'NOT_COMPLETED';
     }
     if (demoContext.step === 12) {
       receiptStatus = 'RECEIVED';
       settlementStatus = 'COMPLETED';
     }
  }
  
  let problemLocation = 'NONE';
  let txState = 'VERIFIED';
  let action = 'NO ACTION REQUIRED';

  if (tx.gatewayStatus === 'TIMEOUT') {
    problemLocation = 'PAYMENT / GATEWAY';
    txState = 'UNCERTAIN';
    action = 'BLOCK RETRY & RECONCILE';
  } else if (tx.gatewayStatus === 'FAILED') {
    problemLocation = 'SENDER / PAYMENT INITIATION';
    txState = 'FAILED';
    action = 'SAFE RETRY MAY BE ALLOWED';
  } else if (tx.type === 'DUPLICATE_SUSPECTED') {
    problemLocation = 'DUPLICATE TRANSACTION';
    txState = 'UNCERTAIN';
    action = 'BLOCK RETRY & INVESTIGATE';
  }

  if (demoContext?.isRunning && tx.id === 'TXN-VYR-5001') {
    txState = demoContext.transactionState;
    if (demoContext.step >= 8) {
      action = demoContext.policyDecision?.action || 'BLOCK RETRY & RECONCILE';
    }
  }

  const customerAgentStatus = (demoContext?.isRunning && tx.id === 'TXN-VYR-5001') ? demoContext.agentStatus : 'IDLE';
  const merchantAgentStatus = (demoContext?.isRunning && tx.id === 'TXN-VYR-5001') ? (demoContext.step >= 4 && demoContext.step <= 6 ? 'VERIFYING' : demoContext.step > 6 ? 'VERIFIED' : 'IDLE') : 'IDLE';

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Network className="text-info w-6 h-6" /> Agent-to-Agent Network</h2>
          <p className="text-slate-400 mt-1">Live visualization of VIYORA instances collaborating across the Agent Bus.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <select 
            className="bg-transparent text-sm font-mono outline-none text-info"
            value={tx.id}
            onChange={(e) => setSelectedTxId(e.target.value)}
          >
            {transactions?.map((t: any) => (
              <option key={t.id} value={t.id} className="bg-slate-800">{t.id}</option>
            ))}
            {!transactions?.length && <option value="TXN-VYR-5001">TXN-VYR-5001</option>}
          </select>
        </div>
      </div>

      <div className="glass rounded-xl border border-slate-700/50 flex flex-col p-8 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="text-center mb-6 relative z-10">
          <span className="text-xs font-bold bg-slate-800 text-white px-3 py-1 rounded-full border border-slate-700">
            Viewing as {viewMode === 'CUSTOMER' ? customerName : merchantName}
          </span>
        </div>
        
        {/* TOP: Agent Collaboration */}
        <div className="w-full flex items-start justify-between relative z-10 mb-12">
          {/* Agent 1 (Customer) */}
          <div className={`glass p-6 rounded-2xl border ${customerAgentStatus !== 'IDLE' ? 'border-info bg-info/5' : 'border-slate-700'} flex flex-col items-center shadow-[0_0_30px_rgba(59,130,246,0.15)] w-72 transition-all ${viewMode === 'MERCHANT' ? 'opacity-40 grayscale blur-[2px]' : ''}`}>
            <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">COMMON VIYORA ENGINE</div>
            <Bot className={`w-12 h-12 mb-2 ${customerAgentStatus !== 'IDLE' ? 'text-info' : 'text-slate-500'}`} />
            <h3 className="font-bold text-sm text-center text-white">VIYORA AGENT</h3>
            <div className="text-[10px] font-bold text-info uppercase tracking-wider mb-2 flex items-center gap-1">
              {customerAgentStatus !== 'IDLE' && customerAgentStatus !== 'RESOLVED' && <Loader2 className="w-3 h-3 animate-spin" />}
              ● {customerAgentStatus}
            </div>
            <p className="text-sm font-mono text-white mt-1 border-b border-slate-700 pb-2 w-full text-center">{customerName}</p>
            <p className="text-[10px] text-slate-400 mt-2 font-bold tracking-wider">CUSTOMER CONTEXT</p>
            <div className="mt-4 w-full bg-slate-900/50 p-3 rounded text-[10px] text-left text-slate-300 font-mono space-y-1 relative">
              {viewMode === 'MERCHANT' ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm text-danger font-bold text-[10px]">
                   🔒 UNAUTHORIZED
                 </div>
              ) : null}
              <div><span className="text-info">Tx:</span> {tx.id}</div>
              <div><span className="text-info">Amount:</span> ₹{tx.amount}</div>
              <div><span className="text-info">Debit:</span> {debitStatus}</div>
              <div><span className="text-info">Gateway:</span> {tx.gatewayStatus}</div>
            </div>
            <div className="mt-3 text-[10px] text-center text-slate-500">Authorized local data only.</div>
            
            {/* New permissions visualization */}
            {viewMode === 'CUSTOMER' && (
              <div className="w-full mt-4 bg-slate-900 border border-slate-700 rounded p-3 text-[9px] text-left">
                <div className="text-emerald-400 font-bold mb-1 border-b border-slate-700 pb-1">✓ Authorized Access</div>
                <div className="text-slate-300">Transaction ID, Amount, Debit status, Gateway status, Retry history</div>
                <div className="text-danger font-bold mt-2 mb-1 border-b border-slate-700 pb-1">🔒 Restricted (No Access)</div>
                <div className="text-slate-500">Merchant balance, Merchant unrelated txns, Merchant financial history</div>
              </div>
            )}
          </div>

          {/* Agent Bus */}
          <div className="flex-1 px-4 relative h-64 flex flex-col items-center justify-center">
            {/* Arrows */}
            <div className="absolute inset-x-4 top-[40%] h-0.5 bg-slate-700">
               <div className="h-full bg-slate-500 w-[50%] animate-pulse"></div>
            </div>
            
            {/* Bus Core */}
            <div className={`bg-slate-900 border ${demoContext?.isRunning && demoContext.step >= 4 && demoContext.step <= 7 ? 'border-primary shadow-primary/20' : 'border-slate-600'} px-6 py-4 rounded-lg text-xs font-mono font-bold text-slate-300 flex flex-col items-center z-10 relative shadow-2xl w-full max-w-xs transition-colors`}>
              <ArrowRightLeft className={`w-6 h-6 mb-2 ${demoContext?.isRunning && demoContext.step >= 4 && demoContext.step <= 7 ? 'text-primary' : 'text-slate-400'}`} />
              AGENT BUS
              <div className="w-full mt-3 space-y-2 h-24 overflow-y-auto custom-scrollbar flex flex-col justify-end">
                {demoContext?.isRunning && tx.id === 'TXN-VYR-5001' ? (
                  demoContext.agentMessages.map((m: any, i: number) => (
                    <div key={i} className="bg-slate-800 p-2 rounded text-[9px] border border-slate-700 flex flex-col animate-in fade-in slide-in-from-bottom-2">
                       <span className={`${m.sender === 'AGENT BUS' ? 'text-primary' : m.sender === 'AGENT 1' ? 'text-info' : 'text-warning'} mb-1`}>{m.sender}</span>
                       <span className="text-slate-300 whitespace-pre-wrap">{m.text}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-slate-800 p-2 rounded text-[9px] border border-slate-700 flex flex-col">
                       <span className="text-info mb-1">req: VERIFY_TRANSACTION</span>
                       <span className="text-slate-500">scope: receipt_status, settlement</span>
                    </div>
                    <div className="bg-slate-800 p-2 rounded text-[9px] border border-slate-700 flex flex-col">
                       <span className="text-warning mb-1">res: VERIFICATION_RESPONSE</span>
                       <span className="text-slate-500">scope: MINIMUM_REQUIRED</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Privacy Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 z-10 max-w-sm">
              <span className="text-[10px] text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Privacy Boundary Enforced
              </span>
              <span className="text-[10px] text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Minimum Evidence Exchange
              </span>
              <span className="text-[10px] text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Agent Identity Verified
              </span>
              <span className="text-[10px] text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Transaction Scope Enforced
              </span>
            </div>
          </div>

          {/* Agent 2 (Merchant) */}
          <div className={`glass p-6 rounded-2xl border ${merchantAgentStatus !== 'IDLE' ? 'border-warning bg-warning/5' : 'border-slate-700'} flex flex-col items-center shadow-[0_0_30px_rgba(245,158,11,0.15)] w-72 transition-all ${viewMode === 'CUSTOMER' ? 'opacity-40 grayscale blur-[2px]' : ''}`}>
            <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2">COMMON VIYORA ENGINE</div>
            <Server className={`w-12 h-12 mb-2 ${merchantAgentStatus !== 'IDLE' ? 'text-warning' : 'text-slate-500'}`} />
            <h3 className="font-bold text-sm text-center text-white">VIYORA AGENT</h3>
            <div className="text-[10px] font-bold text-warning uppercase tracking-wider mb-2 flex items-center gap-1">
              {merchantAgentStatus === 'VERIFYING' && <Loader2 className="w-3 h-3 animate-spin" />}
              {merchantAgentStatus === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-warning" />}
              ● {merchantAgentStatus}
            </div>
            <p className="text-sm font-mono text-white mt-1 border-b border-slate-700 pb-2 w-full text-center">{merchantName}</p>
            <p className="text-[10px] text-slate-400 mt-2 font-bold tracking-wider">MERCHANT CONTEXT</p>
            <div className="mt-4 w-full bg-slate-900/50 p-3 rounded text-[10px] text-left text-slate-300 font-mono space-y-1 relative">
              {viewMode === 'CUSTOMER' ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm text-danger font-bold text-[10px]">
                   🔒 UNAUTHORIZED
                 </div>
              ) : null}
              <div><span className="text-warning">Tx:</span> {tx.gatewayStatus === 'SUCCESS' ? tx.id : 'NOT FOUND'}</div>
              <div><span className="text-warning">Amount:</span> ₹{tx.amount}</div>
              <div><span className="text-warning">Receipt:</span> {receiptStatus}</div>
              <div><span className="text-warning">Settle:</span> {settlementStatus}</div>
            </div>
            <div className="mt-3 text-[10px] text-center text-slate-500">Authorized local data only.</div>

            {/* New permissions visualization */}
            {viewMode === 'MERCHANT' && (
              <div className="w-full mt-4 bg-slate-900 border border-slate-700 rounded p-3 text-[9px] text-left">
                <div className="text-emerald-400 font-bold mb-1 border-b border-slate-700 pb-1">✓ Authorized Access</div>
                <div className="text-slate-300">Transaction reference, Receipt status, Settlement status, Merchant-side state</div>
                <div className="text-danger font-bold mt-2 mb-1 border-b border-slate-700 pb-1">🔒 Restricted (No Access)</div>
                <div className="text-slate-500">Customer balance, Customer unrelated txns, Customer financial history</div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM: Pipeline UI */}
        <div className="relative z-10 w-full pt-8 border-t border-slate-700/50">
          <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" /> Agent Resolution Pipeline
          </h3>

          <div className="flex items-stretch justify-between w-full gap-2">
            
            <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">Evidence Synthesis</span>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div>Customer: {debitStatus}</div>
                <div>Merchant: {receiptStatus}</div>
              </div>
            </div>

            <div className="flex items-center text-slate-600"><ChevronRight className="w-5 h-5" /></div>

            <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">Transaction State</span>
              <div className={`text-sm font-bold ${txState === 'UNCERTAIN' ? 'text-warning' : txState === 'FAILED' ? 'text-danger' : 'text-primary'}`}>
                {txState}
              </div>
            </div>

            <div className="flex items-center text-slate-600"><ChevronRight className="w-5 h-5" /></div>

            <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">Problem Location</span>
              <div className="text-sm font-bold text-slate-300">
                {problemLocation}
              </div>
            </div>

            <div className="flex items-center text-slate-600"><ChevronRight className="w-5 h-5" /></div>

            <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">Risk Level</span>
              <div className={`text-sm font-bold flex items-center gap-1 ${isHighRisk ? 'text-danger' : 'text-primary'}`}>
                {isHighRisk && <AlertTriangle className="w-4 h-4" />} {tx.risk}
              </div>
            </div>

            <div className="flex items-center text-slate-600"><ChevronRight className="w-5 h-5" /></div>

            <div className="flex-1 bg-slate-800/50 p-4 rounded-lg border border-primary/30 flex flex-col items-center text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="text-[10px] font-bold text-primary uppercase mb-2 flex items-center gap-1"><Shield className="w-3 h-3" /> Policy Decision</span>
              <div className="text-xs font-bold text-white">
                {action}
              </div>
            </div>
            
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-slate-300 max-w-2xl mx-auto relative z-10 bg-slate-900 p-4 rounded-xl border border-slate-700">
          <span className="font-bold text-white block mb-2">"VIYORA doesn't take sides. VIYORA investigates both sides."</span>
          One common intelligence platform where every participant has a protected VIYORA Agent that can collaborate with other agents using minimum required evidence.
        </div>
      </div>
    </div>
  );
}
