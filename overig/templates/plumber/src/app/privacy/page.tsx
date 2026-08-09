export default function Privacy() {
  const brandnaam = "{brandnaam}";
  return (
    <div className="bg-gray-50 text-gray-800 py-20 min-h-[70vh]">
      <div className="container mx-auto px-5 max-w-3xl bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-blue-800">Privacyverklaring</h1>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>Laatst bijgewerkt: [Datum]</p>
          <p>
            Bij {brandnaam} vinden we uw privacy erg belangrijk. In deze privacyverklaring leggen we uit welke persoonsgegevens we verzamelen, waarom we deze verzamelen en hoe we hiermee omgaan.
          </p>
          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">1. Verzamelde gegevens</h2>
          <p>Wij verzamelen gegevens die u aan ons verstrekt via contactformulieren, telefoongesprekken of e-mails, zoals uw naam, adres, telefoonnummer en e-mailadres.</p>
          
          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">2. Doeleinden</h2>
          <p>Deze gegevens worden uitsluitend gebruikt voor:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Het inplannen en uitvoeren van onze loodgietersdiensten.</li>
            <li>Contact opnemen met u over uw aanvraag of klus.</li>
            <li>Administratieve doeleinden zoals facturatie.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">3. Gegevensdeling met derden</h2>
          <p>Wij delen uw persoonsgegevens nooit met derde partijen, tenzij dit strikt noodzakelijk is voor de uitvoering van onze diensten of wettelijk verplicht is.</p>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">4. Uw rechten</h2>
          <p>U heeft het recht om in te zien welke gegevens wij van u hebben, deze aan te passen of te laten verwijderen. Neem hiervoor contact met ons op via de contactgegevens op onze contactpagina.</p>
        </div>
      </div>
    </div>
  );
}
