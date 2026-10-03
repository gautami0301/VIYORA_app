import { AlertTriangle, ChevronRight } from 'lucide-react';

export default function IncidentsView({ incidents, currentUser, onOpenIncident, demoContext }: any) {
  const isCustomer = currentUser?.role === 'CUSTOMER';

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="text-warning w-6 h-6" /> Incident Management</h2>
          <p className="text-slate-400 mt-1">Track and resolve transaction anomalies with VIYORA.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {incidents.length === 0 && !demoContext?.isRunning && <div className="text-slate-500">No active incidents.</div>}
        
        {/* Inject demo incident if running or present */}
        {(demoContext?.isRunning || incidents.find((i: any) => i.id === 'INC-VYR-5001')) && (
          <div className="glass p-6 rounded-xl border border-warning/50 flex justify-between items-center hover:border-warning transition-colors bg-warning/5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm text-slate-300 bg-slate-800 px-2 py-1 rounded">INC-VYR-5001</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${demoContext?.step === 12 ? 'bg-primary/10 border-primary text-primary' : 'bg-warning/10 border-warning text-warning'}`}>
                  {demoContext?.step === 12 ? 'RESOLVED' : 'ACTIVE'}
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded border bg-danger/10 border-danger text-danger">
                  RISK: HIGH
                </span>
              </div>
              <div className="font-bold text-lg">{demoContext?.escalationStatus === 'ESCALATED' ? 'ESCALATED TO HUMAN REVIEW' : demoContext?.step === 12 ? 'RECONCILED + VERIFIED' : 'UNCERTAIN PAYMENT'}</div>
              <div className="text-sm text-slate-400 mt-1">Associated Transaction: TXN-VYR-5001 ({isCustomer ? '₹5,000 to ABC Electronics' : '₹5,000 from Rahul'})</div>
            </div>
            <button 
              onClick={() => onOpenIncident('INC-VYR-5001')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View Case <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        )}

        {incidents.filter((i: any) => i.id !== 'INC-VYR-5001').map((inc: any) => (
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
