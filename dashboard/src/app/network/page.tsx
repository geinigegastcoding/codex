import { getVaultGraph } from '@/lib/kennis';
import VaultGraphWrapper from '@/components/VaultGraphWrapper';

export default async function NetworkPage() {
  const graphData = getVaultGraph();

  return (
    <div className="flex-1 p-6 animate-in fade-in duration-700 max-w-6xl mx-auto w-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-widest text-cyan-200 mb-6 flex items-center gap-3">
        <span className="w-2 h-6 bg-cyan-500 inline-block"></span>
        NETWORK TOPOLOGY
      </h1>
      
      <div className="flex-1 min-h-[600px] w-full">
        <VaultGraphWrapper data={graphData} />
      </div>
    </div>
  );
}
