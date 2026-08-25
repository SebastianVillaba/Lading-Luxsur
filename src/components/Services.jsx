import React from 'react';
import { Wifi, Coffee, UtensilsCrossed, Car, AirVent, Bell, Clock, CheckCircle2, Sparkles, Tv, Shield } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function Services() {
  const { services, rooftop, settings } = useHotelData();

  const renderIcon = (name) => {
    switch (name) {
      case 'Wifi': return <Wifi className="w-6 h-6 text-[#5d205c]" />;
      case 'Coffee': return <Coffee className="w-6 h-6 text-[#5d205c]" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-6 h-6 text-[#5d205c]" />;
      case 'Car': return <Car className="w-6 h-6 text-[#5d205c]" />;
      case 'AirVent': return <AirVent className="w-6 h-6 text-[#5d205c]" />;
      case 'RoomService': return <Bell className="w-6 h-6 text-[#5d205c]" />;
      case 'Tv': return <Tv className="w-6 h-6 text-[#5d205c]" />;
      case 'Shield': return <Shield className="w-6 h-6 text-[#5d205c]" />;
      default: return <Sparkles className="w-6 h-6 text-[#5d205c]" />;
    }
  };

  const highlights = Array.isArray(rooftop.highlights) ? rooftop.highlights : [];

  return (
    <section id="servicios" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5d205c]/10 text-[#5d205c] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#5d205c]" />
            <span>Servicios 4 Estrellas</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Servicios Exclusivos & <span className="text-[#5d205c]">Gastronomía</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Diseñamos cada servicio para superar las expectativas del viajero más exigente. Atención personalizada las 24 horas del día.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4 group-hover:bg-[#5d205c] group-hover:scale-110 transition-all duration-300">
                <span className="group-hover:[&>svg]:text-white transition-colors">
                  {renderIcon(srv.icon)}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-[#5d205c] transition-colors">
                {srv.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                {srv.description}
              </p>
            </div>
          ))}
        </div>

        {/* DESTACADO: RESTAURANT PANORÁMICO ROOFTOP */}
        <div id="restaurant" className="bg-gradient-to-r from-[#1A0621] via-[#2A0B33] to-[#3D1347] rounded-3xl overflow-hidden shadow-2xl border border-purple-400/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* TEXT CONTENT (7 COLS) */}
            <div className="lg:col-span-7 p-8 sm:p-12 text-white">
              <div className="inline-flex items-center gap-2 bg-[#5d205c]/30 border border-purple-400/50 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-white mb-4">
                <UtensilsCrossed className="w-3.5 h-3.5 text-purple-300" />
                <span>Rooftop Bar & Dining</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                {rooftop.title}
              </h3>
              
              <p className="text-sm sm:text-base text-purple-200 font-light mb-6">
                {rooftop.subtitle}
              </p>
              
              <p className="text-sm text-slate-300 font-light leading-relaxed mb-8">
                {rooftop.description}
              </p>

              {/* HIGHLIGHTS */}
              {highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* HOURS & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-purple-800/60">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span>{rooftop.hours}</span>
                </div>

                <a
                  href={settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer border border-purple-400/40"
                >
                  Reservar Hospedaje & Mesa
                </a>
              </div>

            </div>

            {/* IMAGE (5 COLS) */}
            <div className="lg:col-span-5 h-72 lg:h-full relative min-h-[350px] bg-slate-900">
              <img
                src={rooftop.image}
                alt="Restaurant Panorámico Rooftop LuxSur Hotel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#3D1347] via-transparent to-transparent opacity-80" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
