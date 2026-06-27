import React from 'react';
import VaultCore from '@/components/VaultCore';

export default function DashboardLanding() {
  return (
      <div className="flex-1 grid grid-cols-12 gap-6 relative">
        {/* Left Sidebar */}
        <div className="col-span-3 flex flex-col gap-8">
          <section>
            <h2 className="text-sm font-bold border-b border-cyan-800 pb-1 mb-4 uppercase tracking-widest flex items-center gap-2">
               <span className="w-1 h-3 bg-cyan-500 inline-block"></span> System Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-xs mb-1">
                <span>MEMORY (VAULT PARSER)</span>
                <span className="text-cyan-100">76.6%</span>
              </div>
              <div className="h-1 bg-cyan-950 w-full"><div className="h-full bg-cyan-400 w-[76.6%] shadow-[0_0_8px_#22d3ee]"></div></div>
              
              <div className="flex justify-between text-xs mb-1 mt-3">
                <span>LATENCY</span>
                <span className="text-cyan-100">0.06ms</span>
              </div>
              <div className="h-1 bg-cyan-950 w-full"><div className="h-full bg-cyan-400 w-[12%] shadow-[0_0_8px_#22d3ee]"></div></div>
            </div>
          </section>

          <section className="flex-1">
            <h2 className="text-sm font-bold border-b border-cyan-800 pb-1 mb-4 uppercase tracking-widest flex items-center gap-2">
               <span className="w-1 h-3 bg-cyan-500 inline-block"></span> Telemetry Log
            </h2>
            <div className="text-[10px] space-y-1 text-cyan-600/80 font-mono h-64 overflow-y-auto">
              <p>05:03:32 95 ASSET UPDATE: KENNIS VAULT</p>
              <p>05:03:35 00 NETWORK VERIFICATION INITIATED</p>
              <p>05:03:35 15 SECURE_TUNNEL ACTIVE</p>
              <p>05:03:40 00 Parsing local markdown files...</p>
              <p className="text-cyan-300">05:03:41 22 [SUCCESS] 14 new nodes discovered.</p>
              <p>05:03:45 00 Synchronizing MRR metrics...</p>
              <p>05:03:50 00 0x074C203 Network Core Sync ... OK</p>
              <p>05:03:51 00 0x074C204 Network Core Sync ... OK</p>
            </div>
          </section>
        </div>

        {/* Center Canvas */}
        <div className="col-span-6 relative">
          
          {/* 3D Vault Core Container */}
          <div className="absolute top-0 left-4 right-4 bottom-[14rem]">
            {/* Target Reticles (Corners) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-800/80"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-800/80"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-800/80"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-800/80"></div>

            {/* 3D Vault Core */}
            <VaultCore />
          </div>

          {/* Primary Selections Widget */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 border border-cyan-500/80 bg-slate-950/90 p-4 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <h3 className="text-[10px] uppercase tracking-widest text-cyan-600 mb-2 flex items-center gap-2">
               <div className="w-1 h-1 bg-cyan-500"></div> PRIMARY SELECTIONS: MAGISDATA
            </h3>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] text-cyan-600">MRR GOAL: MERCURY</div>
                <div className="text-3xl font-bold text-green-400 tracking-wider shadow-green-400/50 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">$28,400 <span className="text-sm">EUR</span></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-cyan-600">CURRENT PIPELINE</div>
                <div className="text-2xl font-bold text-cyan-100">$19,250</div>
              </div>
            </div>
            <div className="h-1 bg-cyan-950 w-full mt-3 relative">
                <div className="h-full bg-cyan-400 w-[65%] shadow-[0_0_8px_#22d3ee] relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-white"></div>
                </div>
            </div>
            <div className="flex justify-between text-[8px] text-cyan-600 mt-1 uppercase">
                <span>TOTAL PORTFOLIO: $132,500</span>
                <span>PERFORMANCE TREND: +42.1%</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 flex flex-col gap-8">
            <section className="h-48 border border-cyan-900/40 bg-cyan-950/10 flex flex-col p-4 relative overflow-hidden">
              <h2 className="text-[10px] text-cyan-600 uppercase absolute top-2 right-2">Aurea XZD Radar</h2>
              <div className="flex-1 flex items-center justify-center">
                 <div className="w-32 h-32 rounded-full border border-cyan-500/40 relative overflow-hidden bg-cyan-950/20">
                    <div className="absolute top-1/2 left-1/2 w-[150%] h-[1px] bg-cyan-400/60 origin-left animate-[spin_3s_linear_infinite] shadow-[0_0_10px_#22d3ee]"></div>
                    <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-cyan-500 rounded-full animate-ping delay-700"></div>
                 </div>
              </div>
            </section>

            <section className="flex-1">
            <h2 className="text-sm font-bold border-b border-cyan-800 pb-1 mb-4 uppercase tracking-widest text-right flex items-center justify-end gap-2">
               Acquisition Log <span className="w-1 h-3 bg-cyan-500 inline-block"></span>
            </h2>
            <div className="text-[10px] space-y-1 text-cyan-600/80 font-mono text-right h-48 overflow-y-auto">
              <p>00:02:35 Context load req received</p>
              <p>00:02:50 AI Assistant initialized</p>
              <p>00:03:00 Initiating local lead scanner</p>
              <p>00:03:10 Target: loodgieter leiden</p>
              <p className="text-cyan-300">00:03:12 [ALERT] NO WEBSITE DETECTED.</p>
              <p>00:03:15 Generating pitch PDF...</p>
              <p>00:03:20 Fusion_merge task applied</p>
            </div>
          </section>
        </div>
      </div>
  );
}
