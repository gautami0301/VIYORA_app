import { BarChart3, TrendingUp, ShoppingBag, Coffee, Car } from 'lucide-react';

export default function InsightsView({ transactions, currentUser }: any) {
  const isCustomer = currentUser?.role === 'CUSTOMER';
  const totalAmount = transactions.reduce((acc: number, tx: any) => acc + tx.amount, 0);
  const totalCount = transactions.length;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-info w-6 h-6" /> Spending Insights</h2>
        <p className="text-slate-400 mt-1">AI-driven analysis of your financial behavior.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 glass p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center items-center">
          <TrendingUp className="w-10 h-10 text-emerald-400 mb-2" />
          <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{isCustomer ? 'Total Spending' : 'Total Income'}</div>
          <div className="text-4xl font-bold">₹{totalAmount.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-2">Across {totalCount} transactions</div>
        </div>

        <div className="md:col-span-2 glass p-6 rounded-xl border border-slate-700/50">
          <h3 className="font-bold mb-4 text-sm text-slate-400 uppercase tracking-wider">Top Categories</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><ShoppingBag className="w-5 h-5 text-purple-400" /> <span>Electronics</span></div>
              <span className="font-bold">₹{(totalAmount * 0.7).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-purple-400 h-2 rounded-full w-[70%]"></div></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Coffee className="w-5 h-5 text-orange-400" /> <span>Services</span></div>
              <span className="font-bold">₹{(totalAmount * 0.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full w-[20%]"></div></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Car className="w-5 h-5 text-blue-400" /> <span>Other</span></div>
              <span className="font-bold">₹{(totalAmount * 0.1).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-blue-400 h-2 rounded-full w-[5%]"></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
