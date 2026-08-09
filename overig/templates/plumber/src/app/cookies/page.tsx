export default function Cookies() {
  const brandnaam = "{brandnaam}";
  return (
    <div className="bg-gray-50 text-gray-800 py-20 min-h-[70vh]">
      <div className="container mx-auto px-5 max-w-3xl bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-blue-800">Cookieverklaring</h1>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>Bij {brandnaam} maken we gebruik van cookies en vergelijkbare technieken op onze website.</p>
          
          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">1. Wat zijn cookies?</h2>
          <p>Cookies zijn kleine tekstbestandjes die op uw computer, tablet of mobiele telefoon worden geplaatst als u onze website bezoekt.</p>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">2. Welke cookies gebruiken wij?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Functionele cookies:</strong> Nodig om de website goed te laten werken. Hiervoor is uw toestemming niet vereist.</li>
            <li><strong>Analytische cookies:</strong> We gebruiken (bijv. Google Analytics) om statistieken te verzamelen over het gebruik van onze website. We hebben deze diensten zo privacyvriendelijk mogelijk ingesteld.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">3. Cookies uitschakelen</h2>
          <p>U kunt zich afmelden voor cookies door uw internetbrowser zo in te stellen dat deze geen cookies meer opslaat. Daarnaast kunt u ook alle informatie die eerder is opgeslagen via de instellingen van uw browser verwijderen.</p>
        </div>
      </div>
    </div>
  );
}
