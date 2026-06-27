import CompanySidebar from "@/components/CompanySidebar";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full gap-6">
      <CompanySidebar />
      <main className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {children}
      </main>
    </div>
  );
}
