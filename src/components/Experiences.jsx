import React from 'react';
import { Sparkles, Heart, Gift, Compass, ArrowRight } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function Experiences() {
  const { experiences, settings } = useHotelData();

  const getIcon = (id) => {
    switch (id) {
      case 'celebraciones': return <Gift className="w-5 h-5 text-purple-300" />;
      case 'vacaciones': return <Compass className="w-5 h-5 text-purple-300" />;
      case 'luna-de-miel': return <Heart className="w-5 h-5 text-purple-300" />;
      default: return <Sparkles className="w-5 h-5 text-purple-300" />;
    }
  };

  return (
    <section id="experiencias" className="py-24 bg-[#381238] text-white relative overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#722672]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5e265e]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5e265e]/30 border border-purple-400/40 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-white mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>LuxSur Moments</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Momentos Especiales & <span className="purple-gradient-text">Experiencias</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Diseñamos recuerdos imborrables para cada etapa de tu vida. Desde escapadas románticas hasta grandes reuniones familiares en Encarnación.
          </p>
        </div>

        {/* EXPERIENCES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group relative bg-[#4d1a4d]/80 rounded-2xl overflow-hidden border border-purple-400/30 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-500 flex flex-col justify-between"
            >
              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden bg-slate-950">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#381238] via-transparent to-transparent opacity-80" />

                {/* TAG BADGE */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-purple-400/40 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5">
                  {getIcon(exp.id)}
                  <span>{exp.tag}</span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-purple-300 font-semibold mb-1 block">
                    {exp.subtitle}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                    {exp.description}
                  </p>
                </div>

                <a
                  href={settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between text-xs font-bold text-white py-2.5 px-3 rounded-xl bg-[#5e265e]/80 hover:bg-[#5e265e] border border-purple-400/40 transition-all duration-300 shadow-md"
                >
                  <span>Reservar Paquete</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
