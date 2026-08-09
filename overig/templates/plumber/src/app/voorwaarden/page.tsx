export default function Voorwaarden() {
  const brandnaam = "{brandnaam}";
  return (
    <div className="bg-gray-50 text-gray-800 py-20 min-h-[70vh]">
      <div className="container mx-auto px-5 max-w-3xl bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-blue-800">Algemene Voorwaarden</h1>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>Laatst bijgewerkt: [Datum]</p>
          
          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">1. Toepasselijkheid</h2>
          <p>Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes, werkzaamheden en overeenkomsten tussen {brandnaam} en de klant.</p>
          
          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">2. Offertes en Prijzen</h2>
          <p>Alle door ons gemaakte offertes zijn vrijblijvend en geldig voor 30 dagen. De genoemde prijzen zijn exclusief materiaalkosten tenzij anders aangegeven. Voorrijkosten worden altijd apart gespecificeerd.</p>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">3. Uitvoering van werkzaamheden</h2>
          <p>Wij zullen de overeenkomst naar beste inzicht en vermogen uitvoeren overeenkomstig de eisen van goed vakmanschap. Indien onvoorziene omstandigheden leiden tot extra werk of kosten, overleggen we altijd eerst met u.</p>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">4. Garantie en Aansprakelijkheid</h2>
          <p>Op opgeleverd loodgieterswerk verstrekken wij de wettelijke garantie, evenals fabrieksgarantie op geïnstalleerde materialen. Wij zijn niet aansprakelijk voor indirecte schade.</p>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">5. Betaling</h2>
          <p>Betaling dient te geschieden direct na afronding van de werkzaamheden of, na afspraak, via factuur binnen 14 dagen na factuurdatum.</p>
        </div>
      </div>
    </div>
  );
}
