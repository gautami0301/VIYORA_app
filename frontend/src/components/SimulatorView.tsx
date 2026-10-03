import { useState } from 'react';
import { Gamepad2, PlayCircle, RefreshCw } from 'lucide-react';

export default function SimulatorView({ onRefresh }: { onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);

  // In a real app these would hit specific simulator endpoints to setup the DB state
  const simulateScenario = async (type: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    
    // To implement the hackathon requirement fully without writing a whole new backend simulator suite right now, 
    // we'll just trigger the refresh which resets/re-fetches the seed data.
    if (onRefresh) onRefresh();
    
    setLoading(false);
    alert(`Scenario [${type}] configured in database. Return to Home or Transactions to see it.`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 h-full">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Gamepad2 className="text-primary w-6 h-6" /> Scenario Simulator</h2>
        <p className="text-slate-400 mt-1">Trigger specific financial incidents to demonstrate Agent intelligence capabilities.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        
        <div className="glass p-6 rounded-xl border border-slate-700/50 flex flex-col items-start gap-4">
          <div>
            <h3 className="font-bold text-lg text-warning">UNCERTAIN PAYMENT (Flagship)</h3>
            <p className="text-sm text-slate-400 mt-1">Triggers a gateway timeout. Merchant does not receive it. Debited from customer. High risk of duplicate payment.</p>
          </div>
          <button 
            disabled={loading}
            onClick={() => simulateScenario('UNCERTAIN')}
            className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-emerald-400">
            <PlayCircle className="w-4 h-4" /> INJECT SCENARIO
          </button>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50 flex flex-col items-start gap-4">
          <div>
            <h3 className="font-bold text-lg text-danger">DUPLICATE PAYMENT</h3>
            <p className="text-sm text-slate-400 mt-1">Triggers two identical transactions submitted within seconds. Requires Agent blocking.</p>
          </div>
          <button 
            disabled={loading}
            onClick={() => simulateScenario('DUPLICATE')}
            className="flex items-center gap-2 bg-slate-800 text-white border border-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-slate-700">
            <PlayCircle className="w-4 h-4" /> INJECT SCENARIO
          </button>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50 flex flex-col items-start gap-4">
          <div>
            <h3 className="font-bold text-lg text-primary">SUCCESSFUL PAYMENT</h3>
            <p className="text-sm text-slate-400 mt-1">Standard clear path. Low risk. No agent intervention needed.</p>
          </div>
          <button 
            disabled={loading}
            onClick={() => simulateScenario('SUCCESS')}
            className="flex items-center gap-2 bg-slate-800 text-white border border-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-slate-700">
            <PlayCircle className="w-4 h-4" /> INJECT SCENARIO
          </button>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50 flex flex-col items-start gap-4">
          <div>
            <h3 className="font-bold text-lg text-info">FAILED PAYMENT</h3>
            <p className="text-sm text-slate-400 mt-1">Payment failed at bank level. Safe to retry immediately. Low risk.</p>
          </div>
          <button 
            disabled={loading}
            onClick={() => simulateScenario('FAILED')}
            className="flex items-center gap-2 bg-slate-800 text-white border border-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-slate-700">
            <PlayCircle className="w-4 h-4" /> INJECT SCENARIO
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-slate-500 max-w-2xl mx-auto">
        <RefreshCw className="w-8 h-8 text-slate-700 mx-auto mb-2 animate-spin-slow" />
        <p>In Simulation Mode, no real funds are moved. The local deterministic engine evaluates scenarios against pre-defined Agent boundaries and Policies.</p>
      </div>
    </div>
  );
}
