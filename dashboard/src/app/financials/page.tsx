"use client";

export default function FinancialsPage() {
  return (
    <div className="flex-1 p-6 animate-in fade-in duration-700 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold tracking-widest text-cyan-200 mb-8 flex items-center gap-3">
        <span className="w-2 h-6 bg-cyan-500 inline-block"></span>
        FINANCIAL TELEMETRY
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-2">Monthly Recurring Revenue (MRR)</div>
          <div className="text-4xl font-bold text-cyan-100">$28,400 <span className="text-sm text-cyan-600">EUR</span></div>
          <div className="text-xs text-green-400 mt-2">+12.4% vs last month</div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-9xl text-cyan-500 font-bold">€</span>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-2">Active Pipeline Value</div>
          <div className="text-4xl font-bold text-cyan-100">$19,250 <span className="text-sm text-cyan-600">EUR</span></div>
          <div className="text-xs text-yellow-400 mt-2">4 deals pending closure</div>
        </div>

        <div className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-2">YTD Revenue</div>
          <div className="text-4xl font-bold text-cyan-100">$142,800 <span className="text-sm text-cyan-600">EUR</span></div>
          <div className="text-xs text-cyan-400 mt-2">Target: $250,000</div>
          {/* Progress bar */}
          <div className="w-full h-1 bg-cyan-950 mt-4">
             <div className="h-full bg-cyan-500 w-[57%] shadow-[0_0_10px_#22d3ee]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md">
           <h2 className="text-sm font-bold border-b border-cyan-800 pb-2 mb-4 uppercase tracking-widest text-cyan-400">
             Recent Transactions Log
           </h2>
           <table className="w-full text-left text-sm">
             <thead>
               <tr className="text-[10px] text-cyan-600 uppercase tracking-widest border-b border-cyan-900">
                 <th className="pb-2 font-normal">Date</th>
                 <th className="pb-2 font-normal">Client</th>
                 <th className="pb-2 font-normal">Service</th>
                 <th className="pb-2 font-normal text-right">Amount</th>
               </tr>
             </thead>
             <tbody className="text-cyan-100">
               <tr className="border-b border-cyan-900/30">
                 <td className="py-3 text-cyan-600">2026-06-25</td>
                 <td>Bakkerij de Vries</td>
                 <td>Website Launch</td>
                 <td className="text-right text-green-400">€2,500</td>
               </tr>
               <tr className="border-b border-cyan-900/30">
                 <td className="py-3 text-cyan-600">2026-06-22</td>
                 <td>Loodgieter Jansen</td>
                 <td>SEO Retainer</td>
                 <td className="text-right text-green-400">€450</td>
               </tr>
               <tr className="border-b border-cyan-900/30">
                 <td className="py-3 text-cyan-600">2026-06-18</td>
                 <td>Tandarts Praktijk A</td>
                 <td>Website Deposit</td>
                 <td className="text-right text-green-400">€1,250</td>
               </tr>
               <tr>
                 <td className="py-3 text-cyan-600">2026-06-15</td>
                 <td>Hosting Fees</td>
                 <td>Vercel / AWS</td>
                 <td className="text-right text-red-400">-€120</td>
               </tr>
             </tbody>
           </table>
        </section>

        <section className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md">
           <h2 className="text-sm font-bold border-b border-cyan-800 pb-2 mb-4 uppercase tracking-widest text-cyan-400">
             Revenue Projection (Next 6 Mo)
           </h2>
           <div className="h-48 w-full flex items-end justify-between gap-2 mt-8">
              {/* Mock Bar Chart */}
              {[40, 55, 65, 80, 85, 100].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full group cursor-crosshair">
                   <div className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">€{Math.floor(height * 0.5)}k</div>
                   <div className="w-full bg-cyan-900/50 hover:bg-cyan-500/80 transition-all border-t border-cyan-400 relative" style={{ height: `${height}%` }}>
                     {i === 5 && <div className="absolute -top-1 left-0 w-full h-[1px] bg-cyan-200 shadow-[0_0_10px_#22d3ee]"></div>}
                   </div>
                   <div className="text-[9px] text-cyan-600 uppercase">Month {i+1}</div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
