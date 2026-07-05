export default function Contact() {
  const locatie = "{locatie}";
  const phone = "0800-1234567";
  const brandnaam = "{brandnaam}";

  return (
    <div className="bg-gray-50 text-gray-800 py-20 min-h-[70vh]">
      <div className="container mx-auto px-5 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-blue-800 text-center">Contact opnemen</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Heeft u een vraag of wilt u een offerte aanvragen? Wij horen graag van u.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Onze Gegevens</h2>
            <div className="space-y-6">
              <div>
                <strong className="block text-gray-800 mb-1">Telefoonnummer (24/7 Spoed)</strong>
                <a href={`tel:${phone.replace(/-/g, '')}`} className="text-blue-800 font-medium hover:underline text-lg">{phone}</a>
              </div>
              <div>
                <strong className="block text-gray-800 mb-1">E-mailadres</strong>
                <a href="mailto:info@domein.nl" className="text-blue-800 font-medium hover:underline">info@{brandnaam.toLowerCase().replace(/\s/g, '')}.nl</a>
              </div>
              <div>
                <strong className="block text-gray-800 mb-1">Werkgebied</strong>
                <p className="text-gray-600">{locatie} en 30km omstreken</p>
              </div>
              <div>
                <strong className="block text-gray-800 mb-1">KVK Nummer</strong>
                <p className="text-gray-600">12345678</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">Stuur een bericht</h2>
             <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block font-medium mb-2 text-gray-700">Naam</label>
                  <input type="text" id="name" placeholder="Uw naam" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium mb-2 text-gray-700">E-mailadres</label>
                  <input type="email" id="email" placeholder="Uw e-mailadres" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="message" className="block font-medium mb-2 text-gray-700">Bericht / Klusomschrijving</label>
                  <textarea id="message" rows={4} placeholder="Beschrijf kort de situatie of uw vraag" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none resize-y transition-all"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all shadow-md">
                  Bericht Versturen
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}
