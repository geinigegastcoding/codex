"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Customer = {
  id: string;
  identity: { name: string; email: string; phone: string; company: string; title: string; website: string };
  firmographics: { size: string; industry: string; revenue: string };
  financial: { lastPaid: string; nextPaymentDue: string; mrr: number; ltv: number; plan: string; status: string };
  engagement: { emailOpenRate: string; websiteVisits: number; recentSupportTickets: number };
  productUsage: { loginFrequency: string; timeInApp: string; lastActive: string; activeUsers: number; activeUsersTrend: number };
  feedback: { nps: number; csat: string; sentiment: string };
  timeline: { date: string; event: string }[];
};

export default function CustomerWorkspace({ initialCustomers }: { initialCustomers: Customer[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCustomerId = searchParams.get("customerId");

  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(
    initialCustomers.find(c => c.id === urlCustomerId) || initialCustomers[0]
  );
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "At Risk" | "Enterprise">("All");
  const [sortBy, setSortBy] = useState<"Name" | "MRR" | "NPS">("Name");
  
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to URL
  useEffect(() => {
    if (selectedCustomer.id !== urlCustomerId) {
      router.replace(`/company/customers?customerId=${selectedCustomer.id}`, { scroll: false });
    }
  }, [selectedCustomer.id, urlCustomerId, router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const handleAction = (action: string) => {
    showToast(`Action Triggered: ${action} for ${selectedCustomer.identity.company}`);
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    // Filter by mode
    if (filterMode === "At Risk") {
      result = result.filter(c => c.financial.status === "At Risk");
    } else if (filterMode === "Enterprise") {
      result = result.filter(c => c.financial.plan.includes("Enterprise"));
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.identity.company.toLowerCase().includes(term) ||
        c.identity.name.toLowerCase().includes(term) ||
        c.identity.email.toLowerCase().includes(term) ||
        c.firmographics.industry.toLowerCase().includes(term) ||
        c.identity.phone.includes(term)
      );
    }

    // Sort
    if (sortBy === "Name") {
      result.sort((a, b) => a.identity.company.localeCompare(b.identity.company));
    } else if (sortBy === "MRR") {
      result.sort((a, b) => b.financial.mrr - a.financial.mrr);
    } else if (sortBy === "NPS") {
      result.sort((a, b) => a.feedback.nps - b.feedback.nps); // lowest NPS first to flag issues, or highest? let's do lowest first
    }

    return result;
  }, [customers, searchTerm, filterMode, sortBy]);

  return (
    <div className="flex flex-col gap-6 w-full relative animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-cyan-900 border border-cyan-400 text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-slide-in">
          {toastMessage}
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Sidebar / List */}
        <div className={`col-span-1 lg:col-span-4 flex flex-col gap-4 border-r border-cyan-900/30 pr-0 lg:pr-6 ${!isMobileListVisible ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Search by name, email, industry..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cyan-950/30 border border-cyan-800/50 rounded px-4 py-2 text-sm text-white placeholder:text-cyan-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => setFilterMode("All")}
                className={`px-3 py-1 rounded-full border transition-colors ${filterMode === 'All' ? 'bg-cyan-800 text-white border-cyan-500' : 'bg-cyan-950/50 text-cyan-500 border-cyan-900/50 hover:bg-cyan-900'}`}
              >All</button>
              <button 
                onClick={() => setFilterMode("At Risk")}
                className={`px-3 py-1 rounded-full border transition-colors ${filterMode === 'At Risk' ? 'bg-red-900/80 text-white border-red-500' : 'bg-cyan-950/50 text-cyan-500 border-cyan-900/50 hover:bg-cyan-900'}`}
              >At Risk</button>
              <button 
                onClick={() => setFilterMode("Enterprise")}
                className={`px-3 py-1 rounded-full border transition-colors ${filterMode === 'Enterprise' ? 'bg-purple-900/80 text-white border-purple-500' : 'bg-cyan-950/50 text-cyan-500 border-cyan-900/50 hover:bg-cyan-900'}`}
              >Enterprise</button>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-cyan-600">{filteredAndSortedCustomers.length} results</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-cyan-400 border-none outline-none cursor-pointer"
              >
                <option value="Name" className="bg-cyan-950">Sort: Name</option>
                <option value="MRR" className="bg-cyan-950">Sort: MRR</option>
                <option value="NPS" className="bg-cyan-950">Sort: NPS</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent pr-2 pb-4">
            {filteredAndSortedCustomers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsMobileListVisible(false); // Hide list on mobile when selected
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden group
                  ${selectedCustomer.id === customer.id 
                    ? "bg-cyan-900/30 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                    : "bg-cyan-950/10 border-cyan-900/50 hover:border-cyan-700 hover:bg-cyan-900/20"}`}
              >
                {selectedCustomer.id === customer.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base truncate">{customer.identity.company}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border font-bold shrink-0 ml-2
                    ${customer.financial.status === 'Active' ? 'bg-green-950/50 text-green-400 border-green-800/50' 
                    : customer.financial.status === 'At Risk' ? 'bg-red-950/50 text-red-400 border-red-800/50' 
                    : 'bg-cyan-950/50 text-cyan-400 border-cyan-800/50'}`}>
                    {customer.financial.status}
                  </span>
                </div>
                <div className="text-cyan-400 text-xs mb-3 truncate">{customer.identity.name}</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-mono font-bold tracking-wide">${customer.financial.mrr}/mo</span>
                  <span className="text-cyan-600">NPS: <span className={customer.feedback.nps > 7 ? "text-green-400 font-bold" : customer.feedback.nps < 5 ? "text-red-400 font-bold" : "text-yellow-400 font-bold"}>{customer.feedback.nps}</span></span>
                </div>
              </button>
            ))}
            {filteredAndSortedCustomers.length === 0 && (
              <div className="text-center text-cyan-700 py-10 text-sm">No customers found.</div>
            )}
          </div>
        </div>

        {/* Customer Details Area */}
        <div className={`col-span-1 lg:col-span-8 flex flex-col gap-6 ${isMobileListVisible ? 'hidden lg:flex' : 'flex'}`}>
          {/* Mobile Back Button */}
          <button 
            className="lg:hidden text-cyan-400 flex items-center gap-2 text-sm mb-[-10px]"
            onClick={() => setIsMobileListVisible(true)}
          >
            <span>&larr;</span> Back to list
          </button>

          {/* Header Card */}
          <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/80 border border-cyan-800/50 p-6 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
                  {selectedCustomer.identity.company}
                  <Link href={selectedCustomer.identity.website} target="_blank" className="text-cyan-500 hover:text-cyan-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </Link>
                </h2>
                <div className="text-cyan-300 text-sm">{selectedCustomer.firmographics.industry} &bull; {selectedCustomer.firmographics.size} Employees</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">Customer LTV</div>
                <div className="text-3xl font-mono font-bold text-green-400">${selectedCustomer.financial.ltv.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identity & Contact */}
            <div className="bg-cyan-950/20 border border-cyan-900/50 p-5 rounded-xl hover:bg-cyan-950/30 transition-colors">
              <h3 className="text-xs text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-cyan-900/50 pb-2">
                Identity & Contact
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center group">
                  <span className="text-cyan-600 text-xs">Primary Contact</span>
                  <span className="text-white text-sm">{selectedCustomer.identity.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Role</span>
                  <span className="text-white text-sm">{selectedCustomer.identity.title}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-cyan-600 text-xs">Email</span>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${selectedCustomer.identity.email}`} className="text-cyan-300 hover:text-white text-sm transition-colors">{selectedCustomer.identity.email}</a>
                    <button onClick={() => copyToClipboard(selectedCustomer.identity.email, "Email")} className="text-cyan-700 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" title="Copy">⎘</button>
                  </div>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-cyan-600 text-xs">Phone</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">{selectedCustomer.identity.phone}</span>
                    <button onClick={() => copyToClipboard(selectedCustomer.identity.phone, "Phone")} className="text-cyan-700 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" title="Copy">⎘</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction & Financial */}
            <div className="bg-cyan-950/20 border border-cyan-900/50 p-5 rounded-xl hover:bg-cyan-950/30 transition-colors">
              <h3 className="text-xs text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-cyan-900/50 pb-2">
                Financials
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Plan</span>
                  <span className="text-white text-sm font-bold bg-cyan-900/40 px-2 py-0.5 rounded border border-cyan-800">{selectedCustomer.financial.plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Last Paid</span>
                  <span className="text-white text-sm font-mono">{selectedCustomer.financial.lastPaid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Next Due</span>
                  <span className="text-cyan-300 text-sm font-mono">{selectedCustomer.financial.nextPaymentDue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Monthly Value</span>
                  <span className="text-green-400 font-mono text-base font-bold">${selectedCustomer.financial.mrr}</span>
                </div>
              </div>
            </div>

            {/* Product Usage */}
            <div className="bg-cyan-950/20 border border-cyan-900/50 p-5 rounded-xl hover:bg-cyan-950/30 transition-colors">
              <h3 className="text-xs text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-cyan-900/50 pb-2">
                Product Usage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Active Users</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-bold">{selectedCustomer.productUsage.activeUsers}</span>
                    <span className={`text-[10px] ${selectedCustomer.productUsage.activeUsersTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedCustomer.productUsage.activeUsersTrend > 0 ? '↗' : '↘'} {Math.abs(selectedCustomer.productUsage.activeUsersTrend)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Login Frequency</span>
                  <span className="text-white text-sm">{selectedCustomer.productUsage.loginFrequency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Time in App</span>
                  <span className="text-white text-sm">{selectedCustomer.productUsage.timeInApp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Last Active</span>
                  <span className="text-cyan-300 text-sm">{selectedCustomer.productUsage.lastActive}</span>
                </div>
              </div>
            </div>

            {/* Engagement & Sentiment */}
            <div className="bg-cyan-950/20 border border-cyan-900/50 p-5 rounded-xl hover:bg-cyan-950/30 transition-colors">
              <h3 className="text-xs text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-cyan-900/50 pb-2">
                Engagement & Feedback
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Email Open Rate</span>
                  <div className="flex items-center gap-2 w-1/2 justify-end">
                    <div className="w-16 h-1.5 bg-cyan-950 rounded-full overflow-hidden"><div className="h-full bg-cyan-400" style={{width: selectedCustomer.engagement.emailOpenRate}}></div></div>
                    <span className="text-white text-sm text-right w-8">{selectedCustomer.engagement.emailOpenRate}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Open Tickets</span>
                  <a href="#" className={`text-sm font-bold underline decoration-dashed underline-offset-4 ${selectedCustomer.engagement.recentSupportTickets > 0 ? "text-yellow-400 hover:text-yellow-300" : "text-green-400"}`}>
                    {selectedCustomer.engagement.recentSupportTickets}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">CSAT Score</span>
                  <span className="text-white text-sm font-mono">{selectedCustomer.feedback.csat}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs">Overall Sentiment</span>
                  <span className={`text-sm font-bold ${selectedCustomer.feedback.sentiment === 'Positive' || selectedCustomer.feedback.sentiment === 'Evangelist' ? 'text-green-400' : selectedCustomer.feedback.sentiment === 'Frustrated' ? 'text-red-400' : 'text-cyan-400'}`}>{selectedCustomer.feedback.sentiment}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline & Activity Feed */}
          <div className="bg-cyan-950/20 border border-cyan-900/50 p-5 rounded-xl hover:bg-cyan-950/30 transition-colors mt-2">
            <h3 className="text-xs text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-cyan-900/50 pb-2">
              Recent Timeline
            </h3>
            <div className="flex flex-col gap-3">
              {selectedCustomer.timeline.map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="text-cyan-600 text-xs font-mono w-24 shrink-0 pt-0.5">{item.date}</div>
                  <div className="text-cyan-100 text-sm border-l border-cyan-800/50 pl-4 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-cyan-500 -left-1.5 top-1.5 group-hover:bg-cyan-300 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all"></div>
                    {item.event}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button 
              onClick={() => handleAction("Log Interaction")}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] uppercase tracking-widest text-xs"
            >
              Log Interaction
            </button>
            <button 
              onClick={() => handleAction("Generate Report")}
              className="flex-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 hover:border-cyan-500 text-cyan-100 font-bold py-3 px-4 rounded-xl transition-all uppercase tracking-widest text-xs"
            >
              Generate Report
            </button>
            <button 
              onClick={() => handleAction("Flag Risk")}
              className="flex-1 bg-red-950/30 hover:bg-red-900/50 border border-red-900/50 hover:border-red-500/50 text-red-400 hover:text-red-300 font-bold py-3 px-4 rounded-xl transition-all uppercase tracking-widest text-xs"
            >
              Flag Risk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
