import React, { useState } from 'react';
import { X, Check, Users, Maximize2, Bed, ExternalLink, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function RoomDetailModal({ room, onClose }) {
  const { settings } = useHotelData();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!room) return null;

  const gallery = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];
  const featuresList = Array.isArray(room.features) ? room.features : [];

  const handleNextImage = () => {
    setSelectedImageIdx((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleBookNow = () => {
    const bookingUrl = room.customBookingUrl || settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg";
    window.open(bookingUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 my-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* GALLERY COLUMN */}
          <div className="lg:col-span-6 bg-slate-950 flex flex-col justify-between relative min-h-[300px] lg:min-h-[500px]">
            <div className="relative w-full h-full min-h-[300px] lg:min-h-[420px]">
              <img
                src={gallery[selectedImageIdx]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              
              {/* CONTROLS */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 p-3 bg-slate-900/90 overflow-x-auto">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                      selectedImageIdx === idx ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS COLUMN */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* CATEGORY & STAR BADGE */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#3D1347]">
                  {room.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>LuxSur 4 Estrellas</span>
                </div>
              </div>

              {/* ROOM TITLE */}
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-4">
                {room.name}
              </h3>

              {/* TECHNICAL SPECS */}
              <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#3D1347]" />
                  <span>{room.guestsLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 border-x border-slate-200 px-2">
                  <Maximize2 className="w-4 h-4 text-[#3D1347]" />
                  <span>{room.size}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-[#3D1347]" />
                  <span className="truncate" title={room.bed}>{room.bed}</span>
                </div>
              </div>

              {/* FULL DESCRIPTION */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Descripción General
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {room.description}
                </p>
              </div>

              {/* FEATURES LIST */}
              {featuresList.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                    Amenidades & Servicios Incluidos
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {featuresList.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4">
              <button
                onClick={handleBookNow}
                className="w-full sm:w-auto bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Reservar en Cloudbeds</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
