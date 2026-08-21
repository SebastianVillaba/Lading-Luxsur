import React from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Building2, Palmtree, Waves } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function Location() {
  const { settings } = useHotelData();

  return (
    <section id="ubicacion" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#3D1347]/10 text-[#3D1347] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Encarnación - Paraguay</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Ubicación <span className="text-[#3D1347]">Estratégica</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            En el corazón céntrico de Encarnación, rodeado de alta gastronomía, comercios y a solo minutos del atractivo principal del Sur paraguayo.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* INFO CARD (5 COLS) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#581C68]/30 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-1 rounded-full text-xs font-semibold text-amber-200 mb-6">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Punto Turístico Clave</span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                {settings.hotelName || 'LuxSur Hotel Boutique'}
              </h3>

              <p className="text-xs text-amber-300/90 font-medium mb-4">
                {settings.address}
              </p>

              <p className="text-sm text-slate-300 font-light leading-relaxed mb-8">
                Disfruta de la conveniencia de estar cerca de la playa, la zona comercial y los mejores atardeceres sobre el río Paraná.
              </p>

              {/* DISTANCES LIST */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Waves className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      Costanera San José & Playa
                    </h4>
                    <p className="text-sm font-semibold text-white">A solo 3 minutos en vehículo</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      Centro Urbano & Plaza de Armas
                    </h4>
                    <p className="text-sm font-semibold text-white">Acceso a pie en 5 minutos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
                    <Palmtree className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      Ruinas Jesuíticas de Jesús y Trinidad
                    </h4>
                    <p className="text-sm font-semibold text-white">Excursión accesible a 30 km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON GOOGLE MAPS */}
            <a
              href={settings.mapsUrl || "https://maps.google.com/?q=Encarnacion+Paraguay+LuxSur+Hotel"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Abrir Ubicación en Google Maps</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

          </div>

          {/* MAP IFRAME (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl overflow-hidden shadow-xl border border-slate-200 min-h-[350px]">
            <iframe
              title="Ubicación LuxSur Hotel Boutique Encarnación"
              src={settings.googleMapsEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14167.337834524451!2d-55.8752216!3d-27.3371904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94579549f3c7b741%3A0x7d01869e5d429a3!2sEncarnaci%C3%B3n%2C%20Paraguay!5e0!3m2!1ses!2s!4v1700000000000!5m2!1ses!2s"}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-3xl"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
