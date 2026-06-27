"use client";

import dynamic from 'next/dynamic';
import type { GraphData } from '@/lib/kennis';

const VaultGraph = dynamic(() => import('./VaultGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center border border-cyan-900/40 bg-slate-950/80">
      <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
      <div className="text-[10px] text-cyan-600 uppercase tracking-widest animate-pulse">Initializing Kennis Network Protocol...</div>
    </div>
  )
});

export default function VaultGraphWrapper({ data }: { data: GraphData }) {
  return <VaultGraph data={data} />;
}
