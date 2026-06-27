"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { checkBrokenLinks, getCompanyData } from "../actions";

export default function SEOPage() {
  const [scanUrl, setScanUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [brokenLinks, setBrokenLinks] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getCompanyData().then(setData);
  }, []);

  const handleScan = async () => {
    if (!scanUrl) return;
    setIsScanning(true);
    const results = await checkBrokenLinks(scanUrl);
    setBrokenLinks(Array.isArray(results) ? results : []);
    setIsScanning(false);
  };

  const rankingData = data?.seo?.rankings || [];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="border-b border-cyan-900/50 pb-4">
        <h1 className="text-2xl font-bold text-cyan-100 tracking-widest uppercase">SEO & Analytics</h1>
        <p className="text-cyan-600 text-sm mt-1">Search visibility, technical audits, and AI citations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Metrics */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-5 border border-cyan-800/50 bg-cyan-950/20 rounded flex flex-col gap-1 items-center justify-center h-32"
          >
            <div className="text-cyan-600 text-[10px] tracking-widest uppercase">Average Position</div>
            <div className="text-4xl font-bold text-cyan-200">{data?.seo?.averagePosition || "0"}</div>
            <div className="text-green-400 text-xs font-mono">{data?.seo?.positionChange || "+0"} This Month</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="p-5 border border-purple-900/50 bg-purple-950/20 rounded flex flex-col gap-1 items-center justify-center h-32 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0,transparent_70%)]"></div>
            <div className="text-purple-400 text-[10px] tracking-widest uppercase z-10">AI Citation Score</div>
            <div className="text-4xl font-bold text-purple-200 z-10 flex items-end gap-1">
              {data?.seo?.aiCitationScore || "0"}<span className="text-lg text-purple-500 mb-1">/100</span>
            </div>
            <div className="text-purple-300 text-[10px] z-10 mt-1">Perplexity / Gemini / ChatGPT</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="p-5 border border-orange-900/50 bg-orange-950/20 rounded flex flex-col gap-1 items-center justify-center h-32"
          >
            <div className="text-orange-600 text-[10px] tracking-widest uppercase">Gap Analyzer</div>
            <div className="text-xl font-bold text-orange-200 text-center">{data?.seo?.missingEntities || "0"} Missing Entities</div>
            <button className="mt-2 text-[10px] uppercase tracking-widest bg-orange-950 border border-orange-800 px-3 py-1 text-orange-400 hover:text-orange-300">
              View Missing Topics
            </button>
          </motion.div>
        </div>

        {/* Tracking & Tools */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Ranking Tracker */}
          <section className="border border-cyan-800/50 rounded overflow-hidden flex flex-col h-full">
            <div className="bg-cyan-950/50 p-3 border-b border-cyan-900/50 flex justify-between items-center">
              <h2 className="text-cyan-400 text-sm tracking-widest uppercase flex items-center gap-2">
                <span className="text-cyan-200">▤</span> Ranking Tracker
              </h2>
              <div className="text-[10px] text-cyan-600">Updated: Today</div>
            </div>
            <div className="p-0 flex-1 bg-cyan-950/10">
              <table className="w-full text-left text-sm">
                <thead className="text-cyan-600 text-[10px] uppercase tracking-wider">
                  <tr className="border-b border-cyan-900/30">
                    <th className="p-3 font-normal">Keyword</th>
                    <th className="p-3 font-normal text-right">Volume</th>
                    <th className="p-3 font-normal text-right">Position</th>
                    <th className="p-3 font-normal text-right">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/20">
                  {rankingData.map((row: any) => (
                    <tr key={row.keyword} className="hover:bg-cyan-900/10 transition-colors">
                      <td className="p-3 text-cyan-200">{row.keyword}</td>
                      <td className="p-3 text-cyan-600 text-right font-mono">{row.volume}</td>
                      <td className="p-3 text-right">
                        <span className="text-cyan-100 font-bold bg-cyan-900/50 px-2 py-1 rounded border border-cyan-800">
                          {row.position}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`text-xs font-mono ${(row.change || "").startsWith('+') ? 'text-green-400' : (row.change || "").startsWith('-') ? 'text-red-400' : 'text-cyan-600'}`}>
                          {row.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Broken Link Scanner */}
          <section className="border border-red-900/30 rounded overflow-hidden">
             <div className="bg-red-950/20 p-3 border-b border-red-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-red-400 text-sm tracking-widest uppercase flex items-center gap-2 whitespace-nowrap">
                <span className="text-red-500 animate-pulse">⚡</span> Broken Link Scanner
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <input 
                  type="text" 
                  value={scanUrl}
                  onChange={e => setScanUrl(e.target.value)}
                  placeholder="URL to scan..." 
                  className="flex-1 sm:w-48 bg-red-950/50 border border-red-900 text-red-200 text-[10px] px-2 py-1 focus:outline-none focus:border-red-500 rounded"
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                />
                <button 
                  onClick={handleScan}
                  disabled={isScanning}
                  className="text-[10px] uppercase tracking-widest text-red-300 hover:text-red-100 border border-red-800 px-2 py-1 rounded bg-red-950/50 disabled:opacity-50"
                >
                  {isScanning ? "Scanning..." : "Run Scan"}
                </button>
              </div>
            </div>
            <div className="p-4 bg-red-950/5">
              {brokenLinks.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {brokenLinks.map((link, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 border border-red-900/20 bg-red-950/30 rounded">
                      <div className="flex flex-col">
                        <span className="text-red-200 font-mono truncate max-w-xs" title={link.url}>{link.url}</span>
                        <span className="text-red-500/70 text-[10px]">Found on: {link.source}</span>
                      </div>
                      <div className="px-2 py-1 bg-red-900/50 text-red-200 rounded border border-red-800">
                        {link.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-cyan-600 text-xs py-4">
                  {isScanning ? "Scanning links..." : "No broken links found."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
