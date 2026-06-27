"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { scanLeadUrl, getCompanyData } from "../actions";

export default function LeadsPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getCompanyData().then(setData);
  }, []);

  const handleAudit = async () => {
    if (!targetUrl) return;
    setIsAuditing(true);
    const result = await scanLeadUrl(targetUrl);
    setAuditResult(result);
    setIsAuditing(false);
  };

  const sitesToReview = data?.leads?.toReview || [];
  const sitesToSend = data?.leads?.toSend || [];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="border-b border-cyan-900/50 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-cyan-100 tracking-widest uppercase">Lead Generation</h1>
          <p className="text-cyan-600 text-sm mt-1">Automated prospecting and pitch generation.</p>
        </div>
        <button 
          onClick={() => setIsScanning(!isScanning)}
          className={`px-4 py-2 border tracking-widest text-xs uppercase transition-all ${
            isScanning 
              ? "bg-red-900/50 border-red-500 text-red-200 animate-pulse" 
              : "bg-cyan-950/50 border-cyan-500 text-cyan-300 hover:bg-cyan-900/80 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          }`}
        >
          {isScanning ? "Stop Scanner" : "INITIATE SCAN"}
        </button>
      </header>

      {/* Free Lead Generator */}
      <section className="p-6 border border-cyan-800/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 to-transparent rounded relative overflow-hidden">
        {isScanning && (
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(34,211,238,0.1),transparent)] bg-[length:100%_200%] animate-[scan_2s_ease-in-out_infinite] pointer-events-none z-0"></div>
        )}
        <div className="relative z-10">
          <h2 className="text-cyan-400 text-sm tracking-widest uppercase mb-2 flex items-center gap-2">
            <span className="animate-pulse text-cyan-200">●</span> Instant Lead Auditor (Free)
          </h2>
          <p className="text-xs text-cyan-600 mb-4 max-w-2xl">
            Scrapes target local business URLs, runs an automated technical audit, and scores them for Magisdata services.
          </p>
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              placeholder="Enter Target URL (e.g. 'loodgieter.nl')" 
              className="flex-1 bg-cyan-950/50 border border-cyan-800 text-cyan-200 text-sm px-4 py-2 focus:outline-none focus:border-cyan-400 placeholder:text-cyan-800"
              onKeyDown={e => e.key === 'Enter' && handleAudit()}
            />
            <button 
              onClick={handleAudit}
              disabled={isAuditing}
              className="px-6 bg-cyan-900/50 border border-cyan-600 text-cyan-200 text-xs uppercase tracking-widest hover:bg-cyan-800 transition-colors disabled:opacity-50"
            >
              {isAuditing ? "Auditing..." : "Audit"}
            </button>
          </div>
          
          {auditResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 border border-cyan-800/50 bg-cyan-950/40 rounded mt-4">
              {auditResult.error ? (
                <div className="text-red-400 text-xs">{auditResult.error}</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center border-b border-cyan-900/50 pb-2">
                    <span className="text-cyan-200 font-bold">{auditResult.title}</span>
                    <span className={`text-lg font-mono font-bold ${auditResult.score < 60 ? 'text-red-400' : 'text-green-400'}`}>Score: {auditResult.score}</span>
                  </div>
                  <div className="text-xs text-cyan-500 mb-1">Found Issues:</div>
                  <ul className="list-disc pl-4 text-xs text-cyan-300 space-y-1">
                    {auditResult.issues.map((issue: string, i: number) => <li key={i}>{issue}</li>)}
                  </ul>
                  {auditResult.score < 80 && (
                    <div className="mt-2 text-[10px] text-green-400 uppercase tracking-widest px-2 py-1 bg-green-900/20 border border-green-800/50 rounded self-start">
                      Magisdata Groei Package Recommended
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sites to Review */}
        <section className="flex flex-col gap-4">
          <h2 className="text-cyan-500 text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="text-orange-400">⚠</span> Sites to Review
          </h2>
          <div className="flex flex-col gap-3">
            {sitesToReview.map((site, idx) => (
              <motion.div 
                key={site.url}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 border border-orange-900/50 bg-orange-950/10 rounded flex justify-between items-center group hover:border-orange-500/50 transition-colors"
              >
                <div>
                  <div className="text-cyan-200 text-sm">{site.url}</div>
                  <div className="text-orange-400 text-xs mt-1">{site.issue}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-[10px] text-cyan-600">SCORE</div>
                    <div className="text-red-400 font-bold font-mono">{site.score}</div>
                  </div>
                  <button className="text-[10px] uppercase tracking-widest bg-cyan-950 border border-cyan-800 px-2 py-1 text-cyan-500 group-hover:text-cyan-300 transition-colors">
                    Generate Pitch
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sites to Send */}
        <section className="flex flex-col gap-4">
          <h2 className="text-cyan-500 text-sm tracking-widest uppercase flex items-center gap-2">
            <span className="text-green-400">➤</span> Ready to Send
          </h2>
          <div className="flex flex-col gap-3">
            {sitesToSend.map((site, idx) => (
              <motion.div 
                key={site.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="p-3 border border-green-900/50 bg-green-950/10 rounded flex justify-between items-center group hover:border-green-500/50 transition-colors"
              >
                <div>
                  <div className="text-cyan-200 text-sm">{site.name}</div>
                  <div className="text-cyan-600 text-xs mt-1">{site.email}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[10px] text-cyan-500 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-800/50">
                    {site.pitch}
                  </div>
                  <button className="text-[10px] uppercase tracking-widest bg-green-950 border border-green-800 px-3 py-1 text-green-500 hover:bg-green-900 hover:text-green-300 transition-colors shadow-[0_0_10px_rgba(74,222,128,0.1)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                    Send
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
