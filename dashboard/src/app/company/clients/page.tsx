"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCompanyData } from "../actions";

export default function ClientsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getCompanyData().then(setData);
  }, []);

  const funnelStages = [
    { name: "Website Visitors", count: data?.funnel?.visitors || 0, conversion: "100%" },
    { name: "Leads Captured", count: data?.funnel?.captured || 0, conversion: `${((data?.funnel?.captured || 0) / (data?.funnel?.visitors || 1) * 100).toFixed(1)}%` },
    { name: "Qualified Leads", count: data?.funnel?.qualified || 0, conversion: `${((data?.funnel?.qualified || 0) / (data?.funnel?.captured || 1) * 100).toFixed(1)}%` },
    { name: "Proposals Sent", count: data?.funnel?.proposals || 0, conversion: `${((data?.funnel?.proposals || 0) / (data?.funnel?.qualified || 1) * 100).toFixed(1)}%` },
    { name: "Closed Deals", count: data?.funnel?.closed || 0, conversion: `${((data?.funnel?.closed || 0) / (data?.funnel?.proposals || 1) * 100).toFixed(1)}%` },
  ];

  const activeProjects = data?.projects || [];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="border-b border-cyan-900/50 pb-4">
        <h1 className="text-2xl font-bold text-cyan-100 tracking-widest uppercase">Clients & Projects</h1>
        <p className="text-cyan-600 text-sm mt-1">Supervision on projects, customer funnel, and client hub.</p>
      </header>

      {/* Customer Funnel */}
      <section>
        <h2 className="text-cyan-500 text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="text-cyan-300">▼</span> Customer Funnel
        </h2>
        <div className="flex flex-col gap-2">
          {funnelStages.map((stage, idx) => {
            const maxWidth = 100;
            const width = Math.max(20, maxWidth - (idx * 15));
            return (
              <motion.div 
                key={stage.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-32 text-right text-xs text-cyan-600 uppercase tracking-wider">{stage.name}</div>
                <div className="flex-1 h-8 bg-cyan-950/30 rounded flex items-center p-1">
                  <div 
                    className="h-full bg-cyan-800/80 rounded flex items-center px-3 text-cyan-100 text-xs font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    style={{ width: `${width}%` }}
                  >
                    {stage.count}
                  </div>
                </div>
                <div className="w-16 text-xs text-cyan-500 font-mono">{stage.conversion}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Active Projects */}
      <section>
        <h2 className="text-cyan-500 text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="text-cyan-300">⬢</span> Project Supervision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeProjects.map((project: any, idx: number) => (
            <motion.div 
              key={project.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="p-4 border border-cyan-800/50 bg-cyan-950/10 rounded flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-cyan-100 font-bold">{project.name}</div>
                  <div className="text-cyan-600 text-xs">{project.client}</div>
                </div>
                <div className="px-2 py-1 bg-cyan-900/50 text-[10px] text-cyan-300 uppercase tracking-wider rounded">
                  {project.status}
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-cyan-500 mb-1">
                  <span>PROGRESS</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-cyan-950 rounded overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Client Hub */}
      <section>
        <h2 className="text-cyan-500 text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
          <span className="text-cyan-300">≡</span> Hub of All Clients
        </h2>
        <div className="border border-cyan-800/50 rounded overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-cyan-950/50 text-cyan-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 font-normal">Client</th>
                <th className="p-3 font-normal">Service</th>
                <th className="p-3 font-normal">MRR / Value</th>
                <th className="p-3 font-normal">Status</th>
                <th className="p-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/30">
              {(data?.clients || []).map((client: any, i: number) => (
                <tr key={i} className="hover:bg-cyan-900/20 transition-colors">
                  <td className="p-3 text-cyan-200">{client.client}</td>
                  <td className="p-3 text-cyan-500">{client.service}</td>
                  <td className="p-3 text-green-400 font-mono">€{client.mrr}/mo</td>
                  <td className="p-3">
                    <span className="text-[10px] px-2 py-1 rounded bg-green-900/30 text-green-400 border border-green-800/50">{client.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-cyan-600 hover:text-cyan-300 text-xs uppercase tracking-widest">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
