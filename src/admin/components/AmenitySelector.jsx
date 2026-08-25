import React, { useState } from 'react';
import { Check, Plus, X, Sparkles } from 'lucide-react';

const COMMON_AMENITIES = [
  'Wi-Fi Gratis de alta velocidad 5G',
  'Aire Acondicionado & Calefacción',
  'TV LED Smart con Cable',
  'Desayuno Buffet Gourmet Incluido',
  'Escritorio Ejecutivo y Sillón',
  'Secador de Pelo y Kits de Baño',
  'Caja Fuerte Digital',
  'Frigobar / Minibar',
  'Balcón Privado con Vista',
  'Servicio de Habitación 24/7',
  'Ropa de Cama Premium 100% Algodón',
  'Pava Eléctrica y Set de Café/Té',
  'Baño Privado con Ducha Escocesa',
  'Batas y Pantuflas de Cortesía'
];

export default function AmenitySelector({ features = [], onChange }) {
  const [customInput, setCustomInput] = useState('');

  const toggleAmenity = (amenity) => {
    if (features.includes(amenity)) {
      onChange(features.filter(f => f !== amenity));
    } else {
      onChange([...features, amenity]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const trimmed = customInput.trim();
    if (!features.includes(trimmed)) {
      onChange([...features, trimmed]);
    }
    setCustomInput('');
  };

  const handleRemove = (featureToRemove) => {
    onChange(features.filter(f => f !== featureToRemove));
  };

  return (
    <div className="space-y-4">
      {/* AMENIDADES SELECCIONADAS (TAGS ACTIVOS) */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Amenidades Seleccionadas ({features.length})
        </label>
        {features.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl min-h-[50px]">
            {features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-[#5d205c] rounded-xl text-xs font-semibold shadow-xs"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(feat)}
                  className="w-4 h-4 rounded-full hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center transition-colors ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-400">
            No has seleccionado amenidades aún. Haz clic en las sugerencias abajo o escribe una personalizada.
          </div>
        )}
      </div>

      {/* AGREGAR AMENIDAD PERSONALIZADA */}
      <form onSubmit={handleAddCustom} className="flex gap-2">
        <input
          type="text"
          placeholder="Escribe una amenidad personalizada..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5d205c]"
        />
        <button
          type="submit"
          disabled={!customInput.trim()}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir</span>
        </button>
      </form>

      {/* SUGERENCIAS RÁPIDAS */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#5d205c]" />
          <span>Sugerencias Frecuentes del Hotel</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_AMENITIES.map((item, idx) => {
            const isSelected = features.includes(item);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleAmenity(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#5d205c] text-white border-[#5d205c] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}{item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
