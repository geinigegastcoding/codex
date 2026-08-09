export default function Tarieven() {
  return (
    <div className="bg-gray-50 text-gray-800 py-20">
      <div className="container mx-auto px-5 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-800 text-center">Onze Tarieven</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Eerlijke prijzen zonder verborgen kosten. We communiceren helder over de prijs voordat we beginnen.</p>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-5 font-bold text-lg">Dienst</th>
                <th className="p-5 font-bold text-lg">Starttarief (incl. voorrijkosten)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-5 text-gray-800 font-medium">Standaard Loodgieterswerk (Ma-Vr 08:00 - 18:00)</td>
                <td className="p-5 text-gray-600">Vanaf €65,- per uur</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-5 text-gray-800 font-medium">Spoedservice Avond & Nacht</td>
                <td className="p-5 text-gray-600">Toeslag van 50% - 100% afhankelijk van tijdstip</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-5 text-gray-800 font-medium">CV-ketel Onderhoudsbeurt</td>
                <td className="p-5 text-gray-600">Vanaf €85,- per beurt</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="p-5 text-gray-800 font-medium">Riool Ontstoppen</td>
                <td className="p-5 text-gray-600">Vanaf €110,- (incl. half uur arbeid)</td>
              </tr>
              <tr>
                <td className="p-5 text-gray-800 font-medium">Offerte op maat voor grote projecten</td>
                <td className="p-5 text-gray-600">Gratis en vrijblijvend</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
