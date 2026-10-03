import { ShieldCheck, Lock, EyeOff, Server, AlertTriangle } from 'lucide-react';

export default function SecurityView(_props: any) {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="text-primary w-6 h-6" /> Security & Privacy Model</h2>
        <p className="text-slate-400">VIYORA operates on a strict privacy-bounded architecture ensuring maximum security and minimal data exposure.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl border border-slate-700/50">
          <EyeOff className="w-8 h-8 text-info mb-4" />
          <h3 className="font-bold text-lg mb-2">Data Minimization</h3>
          <p className="text-sm text-slate-400">Agents exchange only the absolute minimum evidence required to resolve an incident. No unrelated transactions or personal data ever crosses the Agent Bus.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50">
          <Lock className="w-8 h-8 text-warning mb-4" />
          <h3 className="font-bold text-lg mb-2">Permission Boundaries</h3>
          <p className="text-sm text-slate-400">Every agent operates within a strict permission scope. Customer Agents cannot read merchant balances; Recipient Agents cannot see customer financial history.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50">
          <Server className="w-8 h-8 text-primary mb-4" />
          <h3 className="font-bold text-lg mb-2">Agent Isolation</h3>
          <p className="text-sm text-slate-400">Customer and Merchant agents operate independently in isolated execution environments, communicating only via the strictly regulated Agent Bus protocol.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50">
          <AlertTriangle className="w-8 h-8 text-danger mb-4" />
          <h3 className="font-bold text-lg mb-2">Policy-Gated Autonomy</h3>
          <p className="text-sm text-slate-400">No agent can independently authorize actions that move real money. High-risk actions like retrying an uncertain payment are aggressively blocked by the central Policy Engine.</p>
        </div>
      </div>
    </div>
  );
}
