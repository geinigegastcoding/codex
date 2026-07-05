import { Droplet, Ban, Flame, Bath, Wrench, Clock, Truck, CircleDollarSign, Award } from "lucide-react";

export default function Home() {
  // Configurable template variables
  const brandnaam = "{brandnaam}";
  const locatie = "{locatie}";

  return (
    <div className="bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-20">
        <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-7xl">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Vertrouwde spoed loodgieter in {locatie}
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Heeft u last van een lekkage, hardnekkige verstopping of cv-ketel storing in {locatie}? Ons lokale, gecertificeerde team staat 24/7 voor u klaar. Binnen 30 minuten ter plaatse met de juiste materialen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="#" className="bg-amber-400 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-amber-500 hover:-translate-y-0.5 shadow-sm transition-all">
                Direct Afspraak Maken
              </a>
              <a href="#" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Tarieven Bekijken
              </a>
            </div>
          </div>
          <div className="bg-white/10 border-2 border-white/30 border-dashed rounded-xl h-64 md:h-96 flex items-center justify-center text-white/70 font-medium p-4 text-center">
            [ Hero Image Placeholder - 16:9 Loodgieter in actie ]
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-10 shadow-sm mb-10">
        <div className="container mx-auto px-5 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-7xl">
          <div className="flex items-center gap-3 text-center lg:text-left">
            <div>
              <div className="text-amber-400 text-2xl tracking-widest">★★★★★</div>
              <strong className="block text-gray-800 text-lg">Uitstekend beoordeeld</strong>
              <p className="text-sm text-gray-600">4.9/5 op basis van 350+ reviews in {locatie}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 flex-1 w-full">
            <div className="bg-gray-50 p-5 rounded-lg text-sm flex-1 border border-gray-200">
              <strong className="block text-gray-800 text-base">"Snel en vakkundig!"</strong>
              <span className="text-amber-400 text-lg block mb-2">★★★★★</span>
              <p className="text-gray-600">Binnen een half uur was de lekkage in de keuken opgelost. Top service! - <em className="text-gray-800 font-medium">Jan, {locatie}</em></p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg text-sm flex-1 border border-gray-200">
              <strong className="block text-gray-800 text-base">"Eerlijke prijzen"</strong>
              <span className="text-amber-400 text-lg block mb-2">★★★★★</span>
              <p className="text-gray-600">Geen verborgen kosten en vooraf duidelijkheid over de prijs. Zeker een aanrader. - <em className="text-gray-800 font-medium">Lisa, {locatie}</em></p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="flex gap-4 justify-center flex-wrap py-6 border-t border-gray-100 mt-8">
            <div className="px-4 py-2 bg-gray-50 border border-dashed border-gray-300 rounded text-sm text-gray-600 font-medium">[ Erkend Installateur ]</div>
            <div className="px-4 py-2 bg-gray-50 border border-dashed border-gray-300 rounded text-sm text-gray-600 font-medium">[ VCA Gecertificeerd ]</div>
            <div className="px-4 py-2 bg-gray-50 border border-dashed border-gray-300 rounded text-sm text-gray-600 font-medium">[ 10 Jaar Garantie ]</div>
            <div className="px-4 py-2 bg-gray-50 border border-dashed border-gray-300 rounded text-sm text-gray-600 font-medium">[ 24/7 Bereikbaar ]</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-5 max-w-7xl">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-blue-800">Waarom kiezen voor {brandnaam}?</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Als dé lokale expert in {locatie} combineren wij jarenlange ervaring met een klantgerichte aanpak. Wij leveren kwaliteit waarop u kunt bouwen.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Clock size={32} />, title: "24/7 Spoedservice", desc: `Wateroverlast of cv-storing? Wij zijn dag en nacht bereikbaar voor noodgevallen in ${locatie} en omstreken.` },
              { icon: <Truck size={32} />, title: "Snel Ter Plaatse", desc: "Door onze lokale aanwezigheid zijn we vaak al binnen 30 tot 45 minuten bij u om de schade te beperken." },
              { icon: <CircleDollarSign size={32} />, title: "Transparante Kosten", desc: "Geen verrassingen achteraf. Wij communiceren heldere tarieven voordat we met de werkzaamheden beginnen." },
              { icon: <Award size={32} />, title: "Gecertificeerde Technici", desc: "Ons team bestaat uitsluitend uit gediplomeerde en ervaren loodgieters die werken met professioneel apparatuur." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:-translate-y-1 transition-transform text-center border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-6 flex items-center justify-center text-blue-800">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-100/50">
        <div className="container mx-auto px-5 max-w-7xl">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-blue-800">Onze Diensten in {locatie}</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Van spoedreparaties tot complete installaties, wij bieden een breed scala aan professionele loodgietersdiensten.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <Droplet size={40} className="mx-auto" />, title: "Lekkage Detectie", desc: "Snel en nauwkeurig opsporen van lekkages zonder onnodig breekwerk." },
              { icon: <Ban size={40} className="mx-auto" />, title: "Verstoppingen", desc: "Vakkundig ontstoppen van afvoeren, toiletten en rioleringen." },
              { icon: <Flame size={40} className="mx-auto" />, title: "CV-ketel Service", desc: "Onderhoud, reparatie en installatie van alle merken CV-ketels." },
              { icon: <Bath size={40} className="mx-auto" />, title: "Sanitair Installatie", desc: "Plaatsen van nieuw sanitair of complete renovatie van uw badkamer." },
              { icon: <Wrench size={40} className="mx-auto" />, title: "Leidingwerk", desc: "Aanleggen, vervangen of repareren van gas- en waterleidingen." }
            ].map((service, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:border-blue-800 hover:shadow-md transition-all group">
                <div className="mb-6 text-gray-400 group-hover:text-blue-800 transition-colors">{service.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5 max-w-7xl">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-blue-800">Resultaten die voor zich spreken</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Bekijk hieronder enkele recente projecten in {locatie} waar we klanten hebben geholpen met professioneel loodgieterswerk.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Vervanging oude CV-ketel", desc: "Volledige installatie van een nieuwe, energiezuinige ketel inclusief leidingwerk." },
              { title: "Lekkage in badkamer hersteld", desc: "Opsporen en repareren van een verborgen leidinglekkage zonder onnodig breekwerk." },
              { title: "Complete rioolontstopping", desc: "Grondige reiniging en inspectie van het hoofdriool na aanhoudende verstoppingen." }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-56 md:h-64">
                  <div className="flex-1 bg-gray-200 border-r-2 border-white flex items-center justify-center text-gray-500 text-sm font-medium relative">
                    [ Image Voor ]
                    <span className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold tracking-wider">VOOR</span>
                  </div>
                  <div className="flex-1 bg-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium relative">
                    [ Image Na ]
                    <span className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold tracking-wider">NA</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Werkgebied Snippet */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="bg-blue-800 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Loodgieter in {locatie} en omstreken</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Wij zijn lokaal geworteld en snel ter plaatse. Valt uw woning net buiten {locatie}? Grote kans dat we u alsnog snel kunnen helpen zonder torenhoge voorrijkosten. Bekijk of u in ons werkgebied valt.
              </p>
              <a href="/werkgebied" className="inline-flex items-center gap-2 bg-white text-blue-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 hover:-translate-y-0.5 shadow-sm transition-all">
                Bekijk Volledig Werkgebied
              </a>
            </div>
            <div className="relative z-10 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm w-full md:w-auto min-w-[280px]">
              <h3 className="font-bold text-xl mb-4 text-amber-400">Vaak in de buurt van:</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-center gap-2">✓ {locatie} (Hoofdkantoor)</li>
                <li className="flex items-center gap-2">✓ [Plaats 1]</li>
                <li className="flex items-center gap-2">✓ [Plaats 2]</li>
                <li className="flex items-center gap-2">✓ [Plaats 3]</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-100/50">
        <div className="container mx-auto px-5 max-w-7xl">
          <h2 className="text-center text-3xl md:text-4xl font-bold mb-4 text-blue-800">Veelgestelde Vragen</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">Vind snel antwoord op uw vragen over onze loodgietersdiensten.</p>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: "Hoe snel kunt u ter plaatse zijn?", a: `Voor spoedgevallen zoals ernstige lekkages of verstoppingen streven we ernaar binnen 30 tot 45 minuten in ${locatie} en omgeving aanwezig te zijn.` },
              { q: "Brengen jullie voorrijkosten in rekening?", a: "Ja, we hanteren standaard voorrijkosten. Deze worden vooraf altijd duidelijk gecommuniceerd zodat u weet waar u aan toe bent." },
              { q: "Krijg ik garantie op de reparatie?", a: "Zeker, op al onze werkzaamheden en geleverde materialen bieden wij standaard garantie. Vraag onze loodgieter naar de specifieke voorwaarden voor uw klus." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-blue-800 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
