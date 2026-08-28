import React from 'react';
import { Users, Maximize2, Bed, Check, ExternalLink, Eye, AlertCircle } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function RoomCard({ room, onSelectRoom }) {
  const { settings } = useHotelData();

  const handleBooking = () => {
    // Abrir enlace personalizado de la habitación o el general de Cloudbeds
    const bookingUrl = room.customBookingUrl || settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg";
    window.open(bookingUrl, '_blank');
  };

  const featuresList = Array.isArray(room.features) ? room.features : [];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
      <div>
        {/* IMAGE CONTAINER WITH BADGE */}
        <div className="relative h-64 overflow-hidden bg-slate-900">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* BADGE */}
          {room.badge && (
            <div className="absolute top-4 left-4 z-10">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                room.badgeType === 'urgent'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : room.badgeType === 'popular'
                  ? 'bg-gradient-to-r from-[#5e265e] to-[#8d398d] text-white border border-purple-300/40'
                  : 'bg-[#4d1a4d] text-white border border-purple-400/40'
              }`}>
                <AlertCircle className="w-3.5 h-3.5" />
                {room.badge}
              </span>
            </div>
          )}

          {/* ROOM TITLE OVERLAY */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
            <span className="text-xs uppercase tracking-widest text-purple-200 font-semibold mb-1 block">
              {room.category}
            </span>
            <h3 className="text-2xl font-serif font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
              {room.name}
            </h3>
          </div>
        </div>

        {/* CONTENT & TECHNICAL SPECS */}
        <div className="p-6">
          
          {/* TECHNICAL SPECIFICATIONS GRID */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-xl border border-slate-200/60 mb-5 text-center text-slate-700 text-xs font-medium">
            <div className="flex flex-col items-center justify-center p-1">
              <Users className="w-4 h-4 text-[#5e265e] mb-1" />
              <span>{room.guestsLabel}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200">
              <Maximize2 className="w-4 h-4 text-[#5e265e] mb-1" />
              <span>{room.size}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
              <Bed className="w-4 h-4 text-[#5e265e] mb-1" />
              <span className="truncate max-w-[90px]" title={room.bed}>{room.bed}</span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-slate-600 font-normal leading-relaxed mb-5 line-clamp-3">
            {room.description}
          </p>

          {/* KEY FEATURES LIST */}
          <div className="space-y-2 mb-6">
            {featuresList.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <div className="w-4 h-4 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#5e265e]" />
                </div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* FOOTER & ACTION BUTTONS */}
      <div className="p-6 pt-0 border-t border-slate-100 mt-auto">
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => onSelectRoom(room)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Ver Detalles</span>
          </button>

          <button
            onClick={handleBooking}
            className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500/30"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Reservar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
