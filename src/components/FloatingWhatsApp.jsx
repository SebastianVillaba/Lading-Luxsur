import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function FloatingWhatsApp() {
  const { settings } = useHotelData();
  const [showTooltip, setShowTooltip] = useState(true);

  const rawNumber = settings.whatsappRaw || '595986495500';
  const rawMsg = settings.whatsappMessage || "Hola LuxSur Hotel Boutique ****, me gustaría realizar una consulta sobre sus habitaciones y servicios.";
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(rawMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
      
      {/* TOOLTIP BALOON */}
      {showTooltip && (
        <div className="mb-3 bg-slate-900 text-white text-xs font-medium py-2.5 px-4 rounded-2xl shadow-2xl border border-[#25d366]/40 flex items-center gap-2 max-w-xs animate-bounce">
          <div className="w-2 h-2 rounded-full bg-[#25d366] animate-ping" />
          <span>Atención al Cliente 24/7 en WhatsApp</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#20ba5a] text-white shadow-2xl transition-all duration-300 hover:scale-110 shadow-[#25d366]/40 group-hover:shadow-[#25d366]/60"
      >
        {/* PULSE RINGS */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-30 pointer-events-none" />
        
        <MessageCircle className="w-7 h-7 text-white fill-white relative z-10" />
      </a>
    </div>
  );
}
