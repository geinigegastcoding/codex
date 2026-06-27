"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCompanyData, syncExternalData } from "./actions";

export default function CompanyOverview() {
  const [data, setData] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    getCompanyData().then(setData);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    const res = await syncExternalData();
    if (res.success) {
      const newData = await getCompanyData();
      setData(newData);
    } else {
      alert(res.message);
    }
    setIsSyncing(false);
  };

  const metrics = [
    { label: "Monthly Revenue", value: `€${data?.financials?.mrr || 0}`, trend: data?.financials?.mrr > 0 ? "+10%" : "0%", isPositive: data?.financials?.mrr > 0 },
    { label: "Revenue Growth Rate", value: `${data?.financials?.revenueGrowth || 0}%`, trend: "0%", isPositive: true },
    { label: "Profit Margin", value: `${data?.financials?.profitMargin || 0}%`, trend: "0%", isPositive: true },
    { label: "Cash Flow", value: `€${data?.financials?.cashFlow || 0}`, trend: "0%", isPositive: true },
    { label: "Lead to Customer Rate", value: `${data?.financials?.leadToCustomer || 0}%`, trend: "0%", isPositive: true },
    { label: "CPA (Cost Per Acquisition)", value: `€${data?.financials?.cpa || 0}`, trend: "Organic", isPositive: true },
    { label: "ROI Report", value: `${data?.financials?.roi || 0}%`, trend: "0%", isPositive: true },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="border-b border-cyan-900/50 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-cyan-100 tracking-widest uppercase">Financial Overview</h1>
          <p className="text-cyan-600 text-sm mt-1">High-level metrics, revenue trajectory, and core operations.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-cyan-950/50 border border-cyan-500 text-cyan-300 text-xs tracking-widest uppercase hover:bg-cyan-900/80 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSyncing ? <span className="animate-spin text-lg">↻</span> : <span>⟳</span>}
          {isSyncing ? "Syncing APIs..." : "Sync External Data"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={metric.label}
            className="p-4 border border-cyan-800/50 bg-cyan-950/10 backdrop-blur-sm rounded flex flex-col gap-2 hover:border-cyan-500/50 transition-colors"
          >
            <div className="text-cyan-600 text-xs tracking-widest uppercase">{metric.label}</div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold text-cyan-200">{metric.value}</div>
              <div className={`text-xs font-mono ${metric.isPositive ? "text-green-400" : "text-red-400"}`}>
                {metric.trend}
              </div>
            </div>
            {/* Visual Bar */}
            <div className="h-1 w-full bg-cyan-950 mt-2 rounded overflow-hidden">
              <div 
                className={`h-full ${metric.isPositive ? "bg-cyan-500" : "bg-red-500"}`} 
                style={{ width: `${Math.random() * 40 + 40}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-6 border border-cyan-800/50 bg-cyan-950/10 backdrop-blur-sm rounded">
        <h2 className="text-cyan-500 text-sm tracking-widest uppercase mb-4">Revenue Trajectory</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {/* Real chart from Kennis Vault */}
          {(data?.financials?.trajectory || [0,0,0,0,0,0,0,0,0,0,0,0]).map((val: number, idx: number) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${val > 0 ? val : 5}%` }}
              transition={{ delay: 0.5 + idx * 0.05, duration: 0.5 }}
              className="w-full bg-cyan-800/50 hover:bg-cyan-400/80 transition-colors relative group"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-cyan-200 bg-cyan-950 px-2 py-1 border border-cyan-800 rounded pointer-events-none transition-opacity">
                €{val}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[10px] text-cyan-600 tracking-widest">
          <span>JAN</span>
          <span>FEB</span>
          <span>MAR</span>
          <span>APR</span>
          <span>MAY</span>
          <span>JUN</span>
          <span>JUL</span>
          <span>AUG</span>
          <span>SEP</span>
          <span>OCT</span>
          <span>NOV</span>
          <span>DEC</span>
        </div>
      </div>
    </div>
  );
}
