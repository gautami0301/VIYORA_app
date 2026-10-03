import { FolderLock, Lock, CheckCircle2 } from 'lucide-react';

export default function EvidenceView({ demoContext, currentUser }: any) {
  const isCustomer = currentUser?.role === 'CUSTOMER';
  let receiptStatus = 'NOT_RECEIVED';
  let settlementStatus = 'NOT_COMPLETED';
  
  if (demoContext?.isRunning) {
     if (demoContext.step >= 6) {
       receiptStatus = demoContext.evidence?.receipt || 'NOT_RECEIVED';
       settlementStatus = demoContext.evidence?.settlement || 'NOT_COMPLETED';
     }
     if (demoContext.step === 12) {
       receiptStatus = 'RECEIVED';
       settlementStatus = 'COMPLETED';
     }
  }
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><FolderLock className="text-primary w-6 h-6" /> Evidence Vault</h2>
        <p className="text-slate-400 mt-1">Cryptographically verified data points collected by agents.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl border border-slate-700/50">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <CheckCircle2 className="w-5 h-5 text-info" /> {isCustomer ? 'My Evidence (Rahul)' : 'Counterparty Evidence (Rahul)'}
          </h3>
          <ul className="space-y-3 font-mono text-sm text-slate-300">
            <li className="flex justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-500">Transaction ID:</span> <span>TXN-VYR-5001</span></li>
            <li className="flex justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-500">Amount:</span> <span>₹5,000</span></li>
            <li className="flex justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-500">Debit Status:</span> <span className="text-primary">DEBITED</span></li>
            <li className="flex justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-500">Gateway:</span> <span className="text-danger">TIMEOUT</span></li>
          </ul>
        </div>

        <div className="glass p-6 rounded-xl border border-slate-700/50">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
            <CheckCircle2 className="w-5 h-5 text-warning" /> {!isCustomer ? 'My Evidence (ABC Electronics)' : 'Counterparty Evidence (ABC)'}
          </h3>
          <ul className="space-y-3 font-mono text-sm text-slate-300">
            <li className="flex justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-500">Tx Reference:</span> <span>MER-992-01</span></li>
            <li className="flex justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-500">Receipt Status:</span> <span className={receiptStatus === 'RECEIVED' ? 'text-primary' : receiptStatus === 'UNKNOWN' ? 'text-slate-500' : 'text-danger'}>{receiptStatus}</span></li>
            <li className="flex justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-500">Settlement Status:</span> <span className={settlementStatus === 'COMPLETED' ? 'text-primary' : settlementStatus === 'UNKNOWN' ? 'text-slate-500' : 'text-danger'}>{settlementStatus}</span></li>
          </ul>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border border-danger/30 bg-danger/5 mt-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-danger border-b border-danger/30 pb-2">
          <Lock className="w-5 h-5" /> Restricted Data (Never Shared)
        </h3>
        <div className="grid grid-cols-2 gap-4 font-mono text-sm text-slate-400">
          <div className="p-3 bg-slate-900/50 rounded flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500" /> Customer Account Balance</div>
          <div className="p-3 bg-slate-900/50 rounded flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500" /> Merchant Account Balance</div>
          <div className="p-3 bg-slate-900/50 rounded flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500" /> Unrelated Transactions</div>
          <div className="p-3 bg-slate-900/50 rounded flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500" /> Personal Identity Details</div>
        </div>
      </div>
    </div>
  );
}
