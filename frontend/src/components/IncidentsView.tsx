import { AlertTriangle, ChevronRight } from 'lucide-react';

export default function IncidentsView({ incidents, onOpenIncident }: any) {

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="text-warning w-6 h-6" /> Incident Management</h2>
          <p className="text-slate-400 mt-1">Track and resolve transaction anomalies with VIYORA.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {incidents.length === 0 && <div className="text-slate-500">No active incidents.</div>}

        {incidents.map((inc: any) => (
          <div key={inc.id} className="glass p-6 rounded-xl border border-slate-700/50 flex justify-between items-center hover:border-slate-500 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm text-slate-300 bg-slate-800 px-2 py-1 rounded">{inc.id}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${inc.status === 'RESOLVED' ? 'bg-primary/10 border-primary text-primary' : 'bg-warning/10 border-warning text-warning'}`}>
                  {inc.status}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${inc.risk === 'HIGH' ? 'bg-danger/10 border-danger text-danger' : 'bg-slate-700 border-slate-600 text-slate-300'}`}>
                  RISK: {inc.risk}
                </span>
              </div>
              <div className="font-bold text-lg">{inc.type.replace('_', ' ')}</div>
              <div className="text-sm text-slate-400 mt-1">Associated Transaction: {inc.transactionId}</div>
            </div>
            <button 
              onClick={() => onOpenIncident(inc.id)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Case <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
