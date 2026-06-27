"use client";

import { useEffect, useState } from "react";

export default function TelemetryPage() {
  const [time, setTime] = useState("");
  const [cpuUsage, setCpuUsage] = useState<number[]>(Array(20).fill(10));
  const [ramUsage, setRamUsage] = useState(42);

  useEffect(() => {
    // Clock
    const timer = setInterval(() => {
      setTime(new Date().toISOString().replace('T', ' ').substring(0, 19));
    }, 1000);

    // Mock CPU/RAM Telemetry
    const cpuTimer = setInterval(() => {
      setCpuUsage(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 40) + 20];
        return next;
      });
      setRamUsage(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(10, Math.min(95, prev + change));
      });
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(cpuTimer);
    };
  }, []);

  return (
    <div className="flex-1 p-6 animate-in fade-in duration-700 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold tracking-widest text-cyan-200 mb-8 flex items-center gap-3">
        <span className="w-2 h-6 bg-cyan-500 inline-block animate-pulse"></span>
        SYSTEM TELEMETRY
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Clock & Environment */}
        <div className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md">
          <h2 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-4">Local Environment</h2>
          <div className="text-3xl font-bold text-cyan-100 font-mono tracking-widest mb-1 shadow-cyan-500/50">
            {time || "0000-00-00 00:00:00"}
          </div>
          <div className="text-xs text-cyan-500 mb-6">TIMEZONE: GMT+2 (EUROPE/AMSTERDAM)</div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-cyan-900/40 pt-4">
            <div>
              <div className="text-[9px] text-cyan-700 uppercase mb-1">External Temp</div>
              <div className="text-xl text-cyan-300">14.2°C</div>
            </div>
            <div>
              <div className="text-[9px] text-cyan-700 uppercase mb-1">Atmosphere</div>
              <div className="text-xl text-cyan-300">1012 hPa</div>
            </div>
          </div>
        </div>

        {/* CPU Graph */}
        <div className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md">
          <h2 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-4 flex justify-between">
            <span>CPU Cluster Activity</span>
            <span className="text-cyan-400">{cpuUsage[cpuUsage.length - 1]}%</span>
          </h2>
          
          <div className="h-32 w-full flex items-end gap-1">
            {cpuUsage.map((val, i) => (
              <div key={i} className="flex-1 bg-cyan-950 flex flex-col justify-end relative group">
                <div 
                  className={`w-full transition-all duration-300 ${val > 50 ? 'bg-red-500/80 shadow-[0_0_8px_#ef4444]' : 'bg-cyan-500/80'}`} 
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* RAM Usage */}
        <div className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md flex flex-col justify-center items-center">
          <h2 className="text-[10px] text-cyan-600 uppercase tracking-widest mb-4 w-full text-left">
            Memory Allocation
          </h2>
          <div className="w-32 h-32 rounded-full border-4 border-cyan-950 flex items-center justify-center relative">
             <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-l-transparent border-b-transparent transition-transform duration-1000" style={{ transform: `rotate(${ramUsage * 3.6}deg)` }}></div>
             <div className="text-center">
               <div className="text-2xl font-bold text-cyan-200">{ramUsage.toFixed(1)}%</div>
               <div className="text-[9px] text-cyan-600">32GB TOTAL</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
