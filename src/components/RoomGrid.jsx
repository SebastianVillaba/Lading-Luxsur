import React, { useState } from 'react';
import { useHotelData } from '../context/HotelDataContext';
import RoomCard from './RoomCard';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function RoomGrid({ onSelectRoom }) {
  const { activeRooms, settings } = useHotelData();
  const [filter, setFilter] = useState('all');

  // Obtener categorías únicas presentes en las habitaciones activas
  const uniqueCategories = ['all', ...new Set(activeRooms.map(r => r.category).filter(Boolean))];

  const filteredRooms = activeRooms.filter((room) => {
    if (filter === 'all') return true;
    return room.category?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <section id="habitaciones" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#5e265e]/10 text-[#5e265e] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#5e265e]" />
            <span>LuxSur Accommodations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Habitaciones & Suites <span className="text-[#5e265e]">Boutique</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Cada habitación ha sido proyectada para brindar una atmósfera de tranquilidad y distinción en Encarnación. Tarifas en Guaraníes (PYG).
          </p>
        </div>

        {/* CATEGORY FILTERS */}
        {uniqueCategories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  filter === cat
                    ? 'bg-[#5e265e] text-white shadow-lg shadow-purple-950/20 border border-purple-400/40'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todas las Habitaciones' : cat}
              </button>
            ))}
          </div>
        )}

        {/* ROOMS GRID */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onSelectRoom={onSelectRoom} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No hay habitaciones disponibles en esta categoría.
          </div>
        )}

        {/* BOTTOM GUARANTEE CALLOUT */}
        <div className="mt-16 bg-gradient-to-r from-[#381238] via-[#4d1a4d] to-[#381238] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-purple-400/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-purple-300 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-white">
                ¿Necesitas asistencia personalizada para grupos o eventos?
              </h4>
              <p className="text-sm text-slate-300 font-light">
                Nuestro equipo de Recepción boutique atenderá tus requerimientos especiales en minutos.
              </p>
            </div>
          </div>
          <a
            href={settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5e265e] to-[#8d398d] hover:from-[#8d398d] hover:to-[#5e265e] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 flex-shrink-0 border border-purple-400/40"
          >
            <span>Ver Tarifas Oficiales en Cloudbeds</span>
          </a>
        </div>

      </div>
    </section>
  );
}
