import React, { useState } from 'react';
import { Calendar, Users, BedDouble, Search, Star, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';
import luxsurFlorcita from "/images/luxsurFlorcita.JPG";

export default function Hero() {
  const { settings, activeRooms } = useHotelData();

  // Set default dates: tomorrow and +2 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const formatDateForInput = (d) => d.toISOString().split('T')[0];

  const [checkin, setCheckin] = useState(formatDateForInput(tomorrow));
  const [checkout, setCheckout] = useState(formatDateForInput(dayAfter));
  const [guests, setGuests] = useState('2');
  const [selectedRoom, setSelectedRoom] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const baseUrl = settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg";
    const separator = baseUrl.includes('?') ? '&' : '?';
    let url = `${baseUrl}${separator}checkin=${checkin}&checkout=${checkout}`;
    window.open(url, '_blank');
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* BACKGROUND IMAGE WITH LUXURY DARK PURPLE OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src={luxsurFlorcita}
          alt="LuxSur Hotel Boutique Fachada y Rooftop Nocturno"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0621]/40 via-[#2A0B33]/85 to-[#1A0621]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-30" />
      </div>

      {/* FLOATING DECORATIVE ELEMENTS */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#5d205c]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#581C68]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* CATEGORY BADGE */}
        <div className="inline-flex items-center gap-2 bg-[#3D1347]/90 border border-purple-400/40 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg mb-6 animate-fadeIn">
          <div className="flex text-purple-300">
            {[...Array(settings.stars || 4)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-purple-300" />
            ))}
          </div>
          <span className="text-xs uppercase tracking-widest text-white font-semibold">
            Hotel Boutique {settings.stars || 4} Estrellas
          </span>
        </div>

        {/* HERO TITLE */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight max-w-5xl leading-tight mb-4 drop-shadow-lg">
          {settings.hotelName || 'LuxSur Hotel Boutique'} 
        </h1>

        {/* SUBTITLE */}
        <p className="text-lg sm:text-2xl text-slate-200 max-w-3xl font-light tracking-wide mb-8 leading-relaxed drop-shadow">
          {settings.tagline || 'El lujo del Sur en el corazón de Encarnación, Paraguay.'}
        </p>

        {/* HIGHLIGHT PILLS */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Desayuno Buffet Incluido</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <MapPin className="w-4 h-4 text-purple-300" />
            <span>A 3 min de la Costanera</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Reserva Directa Garantizada</span>
          </div>
        </div>

        {/* WIDGET FLOTANTE DE BÚSQUEDA / RESERVA RÁPIDA */}
        <div className="w-full max-w-5xl bg-[#2A0B33]/90 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl purple-border-glow">
          <div className="text-left mb-4 flex items-center justify-between border-b border-purple-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-300" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Consultar Disponibilidad y Tarifas
              </h2>
            </div>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              Garantía Mejor Tarifa (PYG)
            </span>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            
            {/* CHECK-IN */}
            <div className="flex flex-col text-left">
              <label className="text-xs font-medium text-white/90 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-300" /> Fecha Entrada
              </label>
              <input
                type="date"
                value={checkin}
                min={formatDateForInput(today)}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full bg-white text-slate-900 text-sm font-medium px-3 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#5d205c]"
                required
              />
            </div>

            {/* CHECK-OUT */}
            <div className="flex flex-col text-left">
              <label className="text-xs font-medium text-white/90 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-300" /> Fecha Salida
              </label>
              <input
                type="date"
                value={checkout}
                min={checkin}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full bg-white text-slate-900 text-sm font-medium px-3 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#5d205c]"
                required
              />
            </div>

            {/* GUESTS */}
            <div className="flex flex-col text-left">
              <label className="text-xs font-medium text-white/90 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-300" /> Huéspedes
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-white text-slate-900 text-sm font-medium px-3 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#5d205c]"
              >
                <option value="1">1 Persona</option>
                <option value="2">2 Personas (Pareja)</option>
                <option value="3">3 Personas</option>
                <option value="4">4 Personas (Familia / Grupo)</option>
              </select>
            </div>

            {/* ROOM TYPE */}
            <div className="flex flex-col text-left">
              <label className="text-xs font-medium text-white/90 mb-1 flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-purple-300" /> Habitación
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-white text-slate-900 text-sm font-medium px-3 py-2.5 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#5d205c]"
              >
                <option value="">Todas las Categorías</option>
                {activeRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} {room.pricePYG ? `(${room.pricePYG})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#10B981] via-[#26A69A] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2 group border border-emerald-400/40 cursor-pointer"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Consultar Disponibilidad</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
