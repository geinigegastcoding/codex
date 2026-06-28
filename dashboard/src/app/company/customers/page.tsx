import CustomerWorkspace from "./CustomerWorkspace";
import { getRealCustomers } from "./actions";

export default async function CustomersPage() {
  const realCustomers = await getRealCustomers();

  // Handle case where no real customers exist yet
  const initialCustomers = realCustomers || [];

  return (
    <div className="flex flex-col gap-8 pb-10 min-h-screen">
      <header className="border-b border-cyan-900/50 pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100 tracking-widest uppercase mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Customer Intelligence</h1>
          <p className="text-cyan-600 text-sm">Deep tracking across 5 core dimensions for your real projects.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-cyan-950/40 border border-cyan-800/50 rounded-lg px-4 py-2 flex flex-col items-center justify-center shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
            <span className="text-[10px] text-cyan-500 uppercase tracking-widest">Total Projects</span>
            <span className="text-lg font-bold text-green-400 font-mono">{initialCustomers.length}</span>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-800/50 rounded-lg px-4 py-2 flex flex-col items-center justify-center shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
            <span className="text-[10px] text-cyan-500 uppercase tracking-widest">Avg Health</span>
            <span className="text-lg font-bold text-cyan-300 font-mono">TBD</span>
          </div>
        </div>
      </header>

      {initialCustomers.length > 0 ? (
        <CustomerWorkspace initialCustomers={initialCustomers} />
      ) : (
        <div className="text-cyan-500 text-center py-20 border border-cyan-900/50 rounded-xl bg-cyan-950/10">
          <p className="text-lg font-bold mb-2">No Customer Projects Found</p>
          <p className="text-sm text-cyan-700">Add project folders to E:\MData\customers to see them here.</p>
        </div>
      )}
    </div>
  );
}

