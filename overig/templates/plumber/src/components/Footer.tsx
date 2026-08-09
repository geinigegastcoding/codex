import Link from "next/link";
import { PhoneCall } from "lucide-react";

export default function Footer() {
  const locatie = "{locatie}";
  const phone = "0800-1234567";
  const brandnaam = "{brandnaam}";

  return (
    <>
      <section className="bg-blue-800 text-white py-20">
        <div className="container mx-auto px-5 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-6 leading-tight">Heeft u direct spoed?</h2>
              <p className="text-xl opacity-90 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">Voor spoedgevallen zijn we 24/7 bereikbaar. Bel ons direct voor snelle hulp in {locatie}.</p>
              <a href={`tel:${phone.replace(/-/g, '')}`} className="flex items-center justify-center lg:justify-start gap-3 bg-amber-400 text-gray-900 px-8 py-5 rounded-xl font-bold text-2xl w-fit mx-auto lg:mx-0 hover:bg-amber-500 hover:-translate-y-1 transition-all shadow-lg">
                <PhoneCall size={28} />
                <span>{phone} - Nu Bellen</span>
              </a>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-2xl text-gray-800 shadow-xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">Niet dringend? Neem contact op</h3>
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block font-medium mb-2 text-gray-700">Naam</label>
                  <input type="text" id="name" placeholder="Uw naam" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium mb-2 text-gray-700">E-mailadres</label>
                  <input type="email" id="email" placeholder="Uw e-mailadres" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="message" className="block font-medium mb-2 text-gray-700">Bericht / Klusomschrijving</label>
                  <textarea id="message" rows={4} placeholder="Beschrijf kort de situatie of uw vraag" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-blue-800 outline-none transition-all resize-y"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 hover:shadow-lg transition-all mt-2">
                  Verstuur Aanvraag
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-blue-950 text-white/50 py-10 text-sm">
        <div className="container mx-auto px-5 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} {brandnaam}. Alle rechten voorbehouden.</p>
            <p className="mt-1 opacity-75">
              Website door <a href="https://magisdata.nl" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">MagisData</a>
            </p>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacyverklaring</Link>
            <Link href="/voorwaarden" className="hover:text-white transition-colors">Algemene Voorwaarden</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookiebeleid</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
