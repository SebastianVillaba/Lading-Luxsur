import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function Reviews() {
  const { reviews } = useHotelData();

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-300 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Opiniones de Nuestros Huéspedes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-3">
            Experiencias Memorables en <span className="gold-gradient-text">LuxSur</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light">
            La satisfacción de nuestros huéspedes respalda nuestro estándar boutique 4 estrellas.
          </p>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#1A0621]/90 rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-[#D4AF37]/30 absolute top-4 right-4" />
              
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 font-light leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-purple-900/50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <span className="text-xs text-amber-300/80">{rev.origin}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{rev.stayDate || rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
