import React from 'react';
import { Sparkles, Award, MapPin, HeartHandshake, Building, Compass } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function History() {
  const { history } = useHotelData();

  if (!history || history.isActive === false) {
    return null;
  }

  const p1 = history.paragraph1 || "En Hotel Luxsur nacimos con la convicción de que la excelencia se encuentra en los detalles. Ubicados en el corazón de Encarnación y a minutos de la Playa San José, combinamos arquitectura moderna, confort de primer nivel y una cálida hospitalidad para que cada estadía sea inolvidable.";
  const p2 = history.paragraph2 || "Desde nuestras habitaciones temáticas hasta nuestra icónica terraza con vista 360° a la ciudad y a Posadas, cada espacio está diseñado para ofrecer una experiencia única, ya sea para descansar o celebrar tus eventos más importantes.";
  const imageSrc = history.image || "/images/luxsur-afuera.jpg";
  const tagText = history.tag || "Nuestra Historia & Esencia";
  const titleText = history.title || "Pasión por los Detalles y Hospitalidad Boutique";
  const subtitleText = history.subtitle || "Nuestra Historia";
  const quoteText = history.quote || "La excelencia se encuentra en los detalles";

  return (
    <section id="historia" className="py-24 bg-white relative overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5d205c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: IMAGE COLLAGE & BADGES (5 COLS) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* BACKDROP GLOW CONTAINER */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-purple-100 bg-slate-900 group">
                <img
                  src={imageSrc}
                  alt="Fachada e Historia de LuxSur Hotel Boutique"
                  className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70" />
                
                {/* FLOATING OVERLAY INSIDE IMAGE */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#2A0B33]/90 backdrop-blur-md border border-purple-400/30 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-300 flex-shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                      LuxSur Boutique
                    </span>
                  </div>
                  <p className="font-allegro text-xl sm:text-2xl text-white">
                    "{quoteText}"
                  </p>
                </div>
              </div>

              {/* FLOATING BADGE CORNER */}
              <div className="absolute -top-5 -left-5 bg-gradient-to-br from-[#5d205c] to-[#7a2b79] text-white p-4 rounded-2xl shadow-xl border border-purple-300/40 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-200 block">
                    Distinción
                  </span>
                  <span className="text-sm font-bold text-white">
                    4 Estrellas Boutique
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: TEXT CONTENT & STATS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* SECTION BADGE */}
            <div className="inline-flex items-center gap-2 bg-[#5d205c]/10 text-[#5d205c] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 w-fit border border-[#5d205c]/20">
              <Compass className="w-3.5 h-3.5 text-[#5d205c]" />
              <span>{tagText}</span>
            </div>

            {/* SUBTITLE IN ALLEGRO & SECTION TITLE */}
            <div className="mb-6">
              <span className="font-serif text-3xl sm:text-4xl text-[#5d205c] block mb-1">
                {subtitleText}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                {titleText}
              </h2>
            </div>

            {/* STORY PARAGRAPHS */}
            <div className="space-y-4 text-slate-600 text-base sm:text-lg font-normal leading-relaxed mb-8">
              <p className="border-l-4 border-[#5d205c] pl-4 italic text-slate-700 bg-purple-50/50 py-2 rounded-r-xl">
                {p1}
              </p>
              <p className="pl-4 text-slate-600">
                {p2}
              </p>
            </div>

            {/* KEY HIGHLIGHTS PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <Building className="w-5 h-5 text-[#5d205c] mx-auto mb-1.5" />
                <span className="text-sm font-bold text-slate-900 block">Arquitectura</span>
                <span className="text-[11px] text-slate-500 font-medium">Moderna & Confort</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <Compass className="w-5 h-5 text-[#5d205c] mx-auto mb-1.5" />
                <span className="text-sm font-bold text-slate-900 block">Vista 360°</span>
                <span className="text-[11px] text-slate-500 font-medium">Terraza Rooftop</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <MapPin className="w-5 h-5 text-[#5d205c] mx-auto mb-1.5" />
                <span className="text-sm font-bold text-slate-900 block">Playa San José</span>
                <span className="text-[11px] text-slate-500 font-medium">A solo minutos</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <HeartHandshake className="w-5 h-5 text-[#5d205c] mx-auto mb-1.5" />
                <span className="text-sm font-bold text-slate-900 block">Hospitalidad</span>
                <span className="text-[11px] text-slate-500 font-medium">Cálida y Exclusiva</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
