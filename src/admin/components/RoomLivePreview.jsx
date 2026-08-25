import React from 'react';
import { Users, Maximize2, Bed, Check, ExternalLink, Eye, AlertCircle, Sparkles } from 'lucide-react';

export default function RoomLivePreview({ room }) {
  const previewRoom = {
    name: room.name || 'Nombre de la Habitación',
    category: room.category || 'Categoría',
    guestsLabel: room.guestsLabel || `${room.guests || 1} Personas`,
    size: room.size || '30 m²',
    bed: room.bed || 'Cama Doble',
    pricePYG: room.pricePYG || '235.000 Gs.',
    showPrice: room.showPrice !== false,
    badge: room.badge || '',
    badgeType: room.badgeType || 'popular',
    description: room.description || 'Descripción preliminar de la habitación con acabados de primera calidad...',
    image: room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    features: room.features && room.features.length > 0 ? room.features : ['Wi-Fi 5G Gratis', 'Aire Acondicionado', 'Smart TV LED', 'Desayuno Buffet']
  };

  return (
    <div className="bg-slate-100 p-4 rounded-3xl border border-slate-200 sticky top-24">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#5d205c]" />
          <span>Vista Previa en Tiempo Real</span>
        </span>
        <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
          Diseño Landing
        </span>
      </div>

      {/* TARJETA ROOM CARD EXACTA */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg flex flex-col justify-between max-w-sm mx-auto">
        <div>
          {/* FOTO & BADGE */}
          <div className="relative h-52 overflow-hidden bg-slate-900">
            <img
              src={previewRoom.image}
              alt={previewRoom.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />

            {previewRoom.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md ${
                  previewRoom.badgeType === 'urgent'
                    ? 'bg-rose-600 text-white'
                    : previewRoom.badgeType === 'popular'
                    ? 'bg-gradient-to-r from-[#5d205c] to-[#7a2b79] text-white border border-purple-300/40'
                    : 'bg-[#3D1347] text-white border border-purple-400/40'
                }`}>
                  <AlertCircle className="w-3 h-3" />
                  {previewRoom.badge}
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
              <span className="text-[11px] uppercase tracking-widest text-purple-200 font-semibold mb-0.5 block">
                {previewRoom.category}
              </span>
              <h3 className="text-xl font-serif font-bold text-white tracking-tight">
                {previewRoom.name}
              </h3>
            </div>
          </div>

          {/* ESPECIFICACIONES TÉCNICAS */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-1.5 py-2.5 px-2 bg-slate-50 rounded-xl border border-slate-200/60 mb-4 text-center text-slate-700 text-[11px] font-medium">
              <div className="flex flex-col items-center justify-center p-1">
                <Users className="w-3.5 h-3.5 text-[#5d205c] mb-0.5" />
                <span className="truncate max-w-full">{previewRoom.guestsLabel}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200">
                <Maximize2 className="w-3.5 h-3.5 text-[#5d205c] mb-0.5" />
                <span>{previewRoom.size}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1">
                <Bed className="w-3.5 h-3.5 text-[#5d205c] mb-0.5" />
                <span className="truncate max-w-[75px]" title={previewRoom.bed}>{previewRoom.bed}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4 line-clamp-2">
              {previewRoom.description}
            </p>

            <div className="space-y-1.5 mb-4">
              {previewRoom.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                  <div className="w-3.5 h-3.5 rounded-full bg-purple-50 text-[#5d205c] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTONES ACCIÓN */}
        <div className="p-4 pt-0 border-t border-slate-100 mt-auto">
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-slate-100 text-slate-700 text-xs font-semibold py-2 px-2 rounded-xl text-center flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Detalles</span>
            </div>
            <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-2 rounded-xl text-center flex items-center justify-center gap-1 shadow-xs">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Reservar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
