import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, AlertTriangle, Minus, ArrowRight, ChevronDown, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { createIncident } from '../api';

export default function FloatingCompanion({ transactions, currentUser, onNavigate, onOpenIncident, demoContext }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [contextTx, setContextTx] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const problemTx = transactions?.find((tx: any) => tx.id === 'TXN-VYR-5001' || tx.risk === 'HIGH');
  const [hasAlert, setHasAlert] = useState(false);
  const isCustomer = currentUser?.role === 'CUSTOMER';
  const customerName = currentUser?.name || 'User';

  const getRecipientName = (tx: any) => {
    if (isCustomer) {
       return tx.recipientId === 'USER-ABC-001' ? 'ABC Electronics' : 'Merchant';
    } else {
       return tx.senderId === 'USER-RAHUL-001' ? 'Rahul' : 'Customer';
    }
  };

  useEffect(() => {
    if (problemTx && messages.length === 0) {
      setHasAlert(true);
      setMessages([
        {
          sender: 'ai',
          type: 'activity',
          task: `Investigating ₹${problemTx.amount} payment`,
          status: 'Investigating',
          activities: [
            'Transaction identified',
            'Sender-side evidence checked',
            'Recipient verification requested',
            'Agent Bus response received',
            'Payment state compared',
            'Retry safety policy applied',
            'Reconciliation initiated'
          ],
          nextAction: 'Monitoring transaction',
          targetId: problemTx.id
        },
        {
          sender: 'ai',
          type: 'text',
          text: `Hi ${customerName}, I am actively handling a payment anomaly with ${problemTx ? getRecipientName(problemTx) : 'the counterparty'}.\n\nBoth sides indicate the payment has not reached a final state. I have blocked any unsafe retries to prevent duplicate charges and initiated reconciliation.`,
          action: { label: 'Open Investigation', type: 'investigate', target: problemTx?.id }
        }
      ]);
    } else if (!demoContext?.isRunning && messages.length === 0) {
      setMessages([
        {
          sender: 'ai',
          type: 'text',
          text: `Hi ${customerName}, I am your Autonomous Financial Teammate. I am actively monitoring your transactions in the background.\n\nAll systems are normal right now. Let me know if you need any specific data.`,
          suggestions: ["Show my recent payments", "How much did I spend this week?", "Check for duplicate payments"]
        }
      ]);
    }
  }, [transactions, demoContext?.isRunning]); // Added demoContext dependency

  // Demo effect for floating companion
  useEffect(() => {
    if (demoContext?.isRunning) {
      const step = demoContext.step;
      if (step === 1 && !isOpen) setIsOpen(true);
      
      const newMsgs = [...messages];
      
      if (step === 1) {
        newMsgs.push({ sender: 'ai', type: 'text', text: "⚡ I detected an inconsistency in your ₹5,000 payment." });
      } else if (step === 2) {
        newMsgs.push({ sender: 'ai', type: 'text', text: "I am checking your transaction history." });
      } else if (step === 4) {
        newMsgs.push({ sender: 'ai', type: 'text', text: "I've contacted the recipient's VIYORA Agent over the Agent Bus." });
      } else if (step === 6) {
        newMsgs.push({ sender: 'ai', type: 'text', text: "The recipient agent reports that the payment was not received." });
      } else if (step === 9) {
        newMsgs.push({ sender: 'ai', type: 'text', text: "I'm blocking a duplicate retry while I reconcile the transaction." });
      } else if (step === 11) {
        newMsgs.push({ sender: 'ai', type: 'text', text: "Reconciliation completed." });
      } else if (step === 12) {
        newMsgs.push({ sender: 'ai', type: 'text', text: "The payment is now verified. Incident resolved autonomously." });
      }

      if (newMsgs.length > messages.length) {
        setMessages(newMsgs);
      }
    }
  }, [demoContext?.step]);

  useEffect(() => {
    if (isOpen) {
      setHasAlert(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const processInput = async (text: string) => {
    const lower = text.toLowerCase();
    let responseText = "I can fetch transaction data or run an investigation on a specific payment. What would you like me to do?";
    let action = null;
    let suggestions = [];
    let newContext = contextTx;

    if (lower.includes('spend') && (lower.includes('today') || lower.includes('this week') || lower.includes('how much'))) {
      const total = transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);
      const largest = [...transactions].sort((a: any, b: any) => b.amount - a.amount)[0];
      responseText = `I calculated your recent ${isCustomer ? 'spending' : 'income'}: ₹${total.toLocaleString()}.\n\nYour largest transaction was ₹${largest.amount.toLocaleString()} ${isCustomer ? 'to' : 'from'} ${getRecipientName(largest)}.`;
      if (largest.risk === 'HIGH') {
        responseText += `\n\nNote: I am already autonomously investigating this high-risk transaction.`;
        action = { label: `View Investigation`, type: 'investigate', target: largest.id };
      }
      newContext = largest;
    } 
    else if (lower.includes('why hasn\'t') || (lower.includes('payment') && lower.includes('reach'))) {
      responseText = `I will find the transaction, verify both sides over the Agent Bus, and apply our safety policy to resolve it.`;
      const target = transactions.find((tx: any) => tx.gatewayStatus === 'TIMEOUT' || tx.gatewayStatus === 'FAILED');
      if (target) {
        action = { label: `Investigate ${getRecipientName(target)}`, type: 'investigate', target: target.id };
      }
    }
    else if (lower.includes('recent') || lower.includes('show') && lower.includes('transaction')) {
      responseText = `I am opening your transaction context now.`;
      action = { label: 'View Transactions', type: 'navigate', target: 'transactions' };
    }
    else if (lower.includes('pending')) {
      const pending = transactions.filter((tx: any) => tx.gatewayStatus === 'TIMEOUT' || tx.settlementStatus === 'NOT_COMPLETED');
      if (pending.length > 0) {
        responseText = `You have ${pending.length} pending payment(s).\n\n₹${pending[0].amount.toLocaleString()} ${isCustomer ? 'to' : 'from'} ${getRecipientName(pending[0])}.`;
        action = { label: 'View Transactions', type: 'navigate', target: 'transactions' };
      } else {
        responseText = `You don't have any pending payments right now.`;
      }
    }
    else if (lower.includes('failed')) {
      const failed = transactions.filter((tx: any) => tx.gatewayStatus === 'FAILED');
      responseText = `You have ${failed.length} failed payment(s).`;
    }
    else if (lower.includes('twice') || lower.includes('duplicate')) {
      const dupe = transactions.find((tx: any) => tx.risk === 'HIGH' || tx.type === 'DUPLICATE_SUSPECTED');
      if (dupe) {
        responseText = `I detected a duplicate payment risk for ₹${dupe.amount.toLocaleString()} ${isCustomer ? 'to' : 'from'} ${getRecipientName(dupe)}. I have already blocked further retries.`;
        action = { label: 'View Investigation', type: 'investigate', target: dupe.id };
        newContext = dupe;
      } else {
        responseText = `I scanned your history. I have not detected any duplicate payments.`;
      }
    }
    else if (lower.includes('incident') || lower.includes('problem')) {
      responseText = `I'll open the Incident Operations dashboard.`;
      action = { label: 'View Incidents', type: 'navigate', target: 'incidents' };
    }
    else if (lower.includes('agent') || lower.includes('communication') || lower.includes('network')) {
      responseText = `I will show you the Agent Bus where I collaborate with Merchant Agents.`;
      action = { label: 'Open Agent Network', type: 'navigate', target: 'network' };
    }
    
    setContextTx(newContext);
    return { text: responseText, action, suggestions };
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const newMsgs = [...messages, { sender: 'user', type: 'text', text }];
    setMessages(newMsgs);
    setInput('');
    
    // Simulate thinking
    setTimeout(async () => {
      const response = await processInput(text);
      setMessages([...newMsgs, { sender: 'ai', type: 'text', ...response }]);
    }, 600);
  };

  const executeAction = async (action: any) => {
    if (action.type === 'navigate') {
      onNavigate(action.target);
      if (window.innerWidth < 768) setIsOpen(false); // Close on mobile navigation
    } else if (action.type === 'investigate') {
      const res = await createIncident(action.target);
      onOpenIncident(res.incident_id);
      if (window.innerWidth < 768) setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {hasAlert && !isOpen && (
          <div className="bg-danger text-white text-xs font-bold px-3 py-1 rounded-full mb-2 animate-bounce shadow-lg shadow-danger/20">
            1 Active Task
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 ${isOpen ? 'bg-slate-700 text-white' : 'bg-primary text-slate-900 shadow-primary/30'}`}>
          {isOpen ? <ChevronDown className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
          {hasAlert && !isOpen && <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full border-2 border-slate-900"></span>}
        </button>
      </div>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[420px] h-[650px] max-h-[85vh] glass-panel rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden z-50 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="h-16 bg-slate-800/90 border-b border-primary/30 flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-1.5 rounded-full border border-primary/50 relative">
                 <Bot className="w-5 h-5 text-primary" />
                 <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border border-slate-900 animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-white tracking-wide">VIYORA AI AGENT</h3>
                <p className="text-[10px] text-slate-400 font-mono">Autonomous Teammate ● Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1"><Minus className="w-5 h-5" /></button>
          </div>

          {/* Privacy Indicator */}
          <div className="bg-slate-900/80 py-1.5 flex justify-center border-b border-slate-700/50">
            <span className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 uppercase tracking-wider">
               <ShieldCheck className="w-3 h-3" /> User Context Authorized
            </span>
          </div>

          {/* Messages / Activity Feed */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-2 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Agent Activity Card Type */}
                {m.type === 'activity' && (
                  <div className="w-full bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-lg mt-2 mb-2">
                     <div className="bg-slate-900/80 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 flex justify-between items-center">
                       <span className="flex items-center gap-1.5"><Loader2 className="w-3 h-3 text-info animate-spin" /> CURRENT TASK</span>
                       <span className="text-info">{m.status}</span>
                     </div>
                     <div className="p-4">
                        <div className="font-bold text-sm text-white mb-4">"{m.task}"</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ACTIVITY LOG</div>
                        <div className="space-y-2 mb-4">
                           {m.activities.map((act: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2 text-xs font-mono">
                                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                 <span className="text-slate-300">{act}</span>
                              </div>
                           ))}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 mt-4 border-t border-slate-700 pt-3">NEXT ACTION</div>
                        <div className="text-xs font-medium text-info">"{m.nextAction}"</div>
                     </div>
                  </div>
                )}

                {/* Standard Text Type */}
                {m.type === 'text' && (
                  <div className={`flex max-w-[90%] ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.sender === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center mr-2 mt-1 shrink-0 border border-slate-700">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <div className={`p-3 text-sm whitespace-pre-wrap leading-relaxed ${m.sender === 'user' ? 'bg-primary/90 text-slate-900 rounded-2xl rounded-tr-sm shadow-md' : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-slate-700 shadow-md'}`}>
                        {m.text}
                      </div>
                      {m.action && (
                        <button 
                          onClick={() => executeAction(m.action)}
                          className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-between transition-colors shadow-lg
                            ${m.action.type === 'investigate' ? 'bg-danger hover:bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                          {m.action.label}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {m.suggestions && (
                        <div className="flex flex-col gap-1.5 mt-1">
                          {m.suggestions.map((s: string, j: number) => (
                            <button key={j} onClick={() => handleSend(s)} className="text-left text-xs bg-slate-800/80 border border-slate-700 hover:border-primary/50 text-slate-300 p-2.5 rounded-lg transition-colors">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-800/90 border-t border-slate-700/50">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                placeholder="Give VIYORA a task..." 
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-full py-3 pl-4 pr-12 outline-none focus:border-primary transition-colors text-sm"
              />
              <button 
                onClick={() => handleSend(input)}
                className="absolute right-1.5 w-9 h-9 bg-primary hover:bg-emerald-400 text-slate-900 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
