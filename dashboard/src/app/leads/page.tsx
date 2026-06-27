"use client";

import { useState } from "react";

export default function LeadsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "results">("idle");

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setStatus("scanning");
    
    // Mocking the scanning process
    setTimeout(() => {
      setStatus("results");
    }, 3500);
  };

  return (
    <div className="flex-1 p-6 animate-in fade-in duration-700 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold tracking-widest text-cyan-200 mb-2 flex items-center gap-3">
        <span className="w-2 h-6 bg-cyan-500 inline-block animate-pulse"></span>
        ZERO-DIGITAL LEAD GENERATOR
      </h1>
      <p className="text-cyan-600 text-xs uppercase tracking-widest mb-8">
        Module: Automated Local Audit & Pitch Generation
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleScan} className="bg-slate-950/80 border border-cyan-900/40 p-6 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            
            <label className="block text-xs font-bold text-cyan-600 uppercase mb-2">
              Target Query (Niche + Location)
            </label>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. loodgieter leiden"
              className="w-full bg-cyan-950/20 border border-cyan-800 text-cyan-100 p-3 mb-4 outline-none focus:border-cyan-400 font-mono text-sm transition-colors shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]"
            />
            
            <button 
              type="submit"
              disabled={status === "scanning"}
              className="w-full bg-cyan-950/40 border border-cyan-500 text-cyan-400 font-bold tracking-widest py-3 uppercase hover:bg-cyan-900/60 hover:text-cyan-100 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {status === "scanning" ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  INITIALIZING SCAN...
                </>
              ) : (
                'INITIATE PROTOCOL'
              )}
            </button>
          </form>

          {/* Radar Visual */}
          <div className="bg-slate-950/80 border border-cyan-900/40 p-6 flex flex-col items-center justify-center h-48 relative">
             <div className="absolute top-2 left-2 text-[9px] text-cyan-700 uppercase">Aurea Core</div>
             <div className="w-32 h-32 rounded-full border border-cyan-800 relative overflow-hidden flex items-center justify-center">
                {status === "scanning" && (
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-pulse"></div>
                )}
                <div className={`w-[150%] h-[1px] bg-cyan-500/80 origin-left shadow-[0_0_10px_#22d3ee] ${status === 'scanning' ? 'animate-[spin_1s_linear_infinite]' : 'animate-[spin_4s_linear_infinite]'}`}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full z-10 shadow-[0_0_8px_#22d3ee]"></div>
             </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <div className="bg-slate-950/80 border border-cyan-900/40 h-full min-h-[400px] p-6 backdrop-blur-md relative">
            <h2 className="text-sm font-bold border-b border-cyan-800 pb-2 mb-4 uppercase tracking-widest text-cyan-400">
              Acquisition Targets
            </h2>

            {status === "idle" && (
              <div className="flex flex-col items-center justify-center h-64 text-cyan-800 text-sm font-mono italic">
                Awaiting input parameters...
              </div>
            )}

            {status === "scanning" && (
              <div className="flex flex-col gap-2 h-64 font-mono text-xs text-cyan-500">
                <p className="animate-pulse">[*] Establishing connection to Google Places API...</p>
                <p className="animate-pulse delay-75">[*] Querying: "{query}"</p>
                <p className="animate-pulse delay-150">[*] Filtering entities with "website: null"...</p>
                <p className="animate-pulse delay-300">[*] Cross-referencing KVK database...</p>
                <p className="animate-pulse delay-500 text-cyan-300">[*] 3 viable targets identified. Compiling profiles...</p>
              </div>
            )}

            {status === "results" && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                {[
                  { name: "Loodgietersbedrijf De Jong", phone: "071-555-0192", rating: "4.8", address: "Haarlemmerstraat 142, Leiden" },
                  { name: "Installatietechniek Leiden", phone: "071-555-8831", rating: "4.2", address: "Lammenschansweg 55, Leiden" },
                  { name: "Van Dijk Sanitair", phone: "071-555-9920", rating: "5.0", address: "Hogewoerd 12, Leiden" },
                ].map((target, idx) => (
                  <div key={idx} className="border border-cyan-900/50 bg-cyan-950/10 p-4 hover:border-cyan-500/60 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-cyan-200 font-bold tracking-wider">{target.name}</h3>
                      <span className="text-[10px] bg-red-900/50 text-red-400 border border-red-800 px-2 py-0.5">NO WEBSITE</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-cyan-600 mb-4">
                      <div><span className="text-cyan-800">TEL:</span> {target.phone}</div>
                      <div><span className="text-cyan-800">RATING:</span> {target.rating}/5.0</div>
                      <div className="truncate"><span className="text-cyan-800">LOC:</span> {target.address}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-cyan-900/40 border border-cyan-700 py-1.5 text-[10px] uppercase text-cyan-300 hover:bg-cyan-800 transition-colors">
                        Generate PDF Pitch
                      </button>
                      <button className="flex-1 bg-cyan-950/40 border border-cyan-900 py-1.5 text-[10px] uppercase text-cyan-500 hover:border-cyan-700 transition-colors">
                        Add to CRM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
