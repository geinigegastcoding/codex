export default function Projecten() {
  const locatie = "{locatie}";
  return (
    <div className="bg-gray-50 text-gray-800 py-20 min-h-[70vh]">
      <div className="container mx-auto px-5 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-800 text-center">Onze Projecten</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Ontdek wat wij in {locatie} en omgeving hebben gerealiseerd voor particulieren en bedrijven.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2, 3, 4].map((item) => (
             <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
               <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-lg border-b border-gray-100">
                 [ Project Foto Placeholder ]
               </div>
               <div className="p-8">
                 <h3 className="font-bold text-gray-800 text-2xl mb-3">Renovatie badkamer project #{item}</h3>
                 <p className="text-gray-600 mb-4 leading-relaxed">Complete vervanging van leidingwerk en installatie van nieuw sanitair. Alles netjes weggewerkt en waterdicht afgewerkt met hoogwaardige materialen.</p>
                 <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 rounded-md text-sm font-bold">Sanitair</span>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
