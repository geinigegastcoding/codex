import { Droplet, Ban, Flame, Bath, Wrench, Home } from "lucide-react";

export default function Diensten() {
  const locatie = "{locatie}";
  return (
    <div className="bg-gray-50 text-gray-800 py-20">
      <div className="container mx-auto px-5 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-800 text-center">Onze Diensten in {locatie}</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Wij bieden een compleet pakket aan loodgieterswerkzaamheden, van spoedreparaties tot renovaties.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Droplet size={48} className="mx-auto" />, title: "Lekkage Detectie", desc: "Snel en nauwkeurig opsporen van lekkages zonder onnodig breekwerk." },
            { icon: <Ban size={48} className="mx-auto" />, title: "Verstoppingen", desc: "Vakkundig ontstoppen van afvoeren, toiletten en rioleringen." },
            { icon: <Flame size={48} className="mx-auto" />, title: "CV-ketel Service", desc: "Onderhoud, reparatie en installatie van alle merken CV-ketels." },
            { icon: <Bath size={48} className="mx-auto" />, title: "Sanitair Installatie", desc: "Plaatsen van nieuw sanitair of complete renovatie van uw badkamer." },
            { icon: <Wrench size={48} className="mx-auto" />, title: "Leidingwerk", desc: "Aanleggen, vervangen of repareren van gas- en waterleidingen." },
            { icon: <Home size={48} className="mx-auto" />, title: "Dakbedekking", desc: "Reparatie en onderhoud van dakbedekking en dakgoten ter voorkoming van lekkages." }
          ].map((service, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:border-blue-800 hover:shadow-md transition-all group">
              <div className="mb-6 text-gray-400 group-hover:text-blue-800 transition-colors">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
