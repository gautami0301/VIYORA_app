import React from 'react';
import { FileBarChart, Download, FileJson } from 'lucide-react';

export default function ReportsView() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-8 h-full">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><FileBarChart className="text-primary w-6 h-6" /> Reports & Audit</h2>
        <p className="text-slate-400 mt-1">Export transaction history and agent resolution audits.</p>
      </div>

      <div className="grid gap-4">
        <div className="glass p-6 rounded-xl border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
          <div>
            <h3 className="font-bold text-lg">Incident Resolution Audit</h3>
            <p className="text-sm text-slate-400 mt-1">Complete cryptographic timeline of Agent actions, risk decisions, and policy enforcements for all incidents.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <FileJson className="w-4 h-4 text-info" /> EXPORT JSON
          </button>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
          <div>
            <h3 className="font-bold text-lg">Transaction History</h3>
            <p className="text-sm text-slate-400 mt-1">Export all daily, weekly, or monthly transaction records with settlement statuses.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Download className="w-4 h-4 text-primary" /> EXPORT CSV
          </button>
        </div>
        
        <div className="glass p-6 rounded-xl border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/30 transition-colors">
          <div>
            <h3 className="font-bold text-lg">Privacy Compliance Report</h3>
            <p className="text-sm text-slate-400 mt-1">Proof of data minimization and boundaries enforced during agent-to-agent negotiation.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Download className="w-4 h-4 text-primary" /> EXPORT PDF
          </button>
        </div>
      </div>
    </div>
  );
}
