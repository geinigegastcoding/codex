import { MapPin } from "lucide-react";

export default function Werkgebied() {
  const locatie = "{locatie}";
  const omliggendePlaatsen = ["{Plaats 1}", "{Plaats 2}", "{Plaats 3}", "{Plaats 4}", "{Plaats 5}", "{Plaats 6}"];

  return (
    <div className="bg-gray-50 text-gray-800 py-20 min-h-[70vh]">
      <div className="container mx-auto px-5 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-800 text-center">Loodgieter Werkgebied</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
          Wij zijn uw lokale loodgieter in <strong>{locatie}</strong> en omstreken. Doordat wij regionaal werken, zijn we altijd snel ter plaatse bij spoedgevallen.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Main location */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Hoofdwerkgebied: {locatie}</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Vanuit onze basis in {locatie} bedienen we de volledige regio. Omdat we de lokale verkeerssituatie kennen, garanderen we snelle aanrijtijden. In heel {locatie} rekenen wij standaard voorrijkosten.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-bold text-blue-800 mb-2">Populaire wijken in {locatie}:</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <li>✓ [Wijk 1]</li>
                <li>✓ [Wijk 2]</li>
                <li>✓ [Wijk 3]</li>
                <li>✓ [Wijk 4]</li>
              </ul>
            </div>
          </div>

          {/* Surrounding locations */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Ook actief in de regio</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Valt u net buiten {locatie}? Geen probleem! Wij komen ook in de omliggende plaatsen en dorpen zonder direct torenhoge voorrijkosten te rekenen.
            </p>
            <div className="flex flex-wrap gap-3">
              {omliggendePlaatsen.map((plaats, idx) => (
                <span key={idx} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-800 transition-colors cursor-default">
                  Loodgieter {plaats}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-6 italic">Staat uw woonplaats er niet tussen? Neem gerust contact op, we kijken graag wat we voor u kunnen betekenen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
