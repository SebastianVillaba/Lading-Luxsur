import React from 'react';
import { Link } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import {
  BedDouble,
  Sliders,
  Compass,
  MessageSquareQuote,
  Plus,
  ExternalLink,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Database,
  Users,
  UserPlus
} from 'lucide-react';

export default function DashboardPage() {
  const { rooms, settings, experiences, services, reviews, dataSource } = useHotelData();

  const activeRoomsCount = rooms.filter(r => r.isActive !== false).length;

  return (
    <div className="space-y-8">
      {/* HEADER BIENVENIDA */}
      <div className="bg-gradient-to-r from-[#2A0B33] via-[#3D1347] to-[#1E0624] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel de Administración Boutique</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {settings.hotelName || 'LuxSur Hotel Boutique'}
          </h1>
          <p className="text-sm text-slate-300 font-light mt-1 max-w-xl">
            Gestiona en tiempo real las habitaciones, imágenes, amenidades, acomodaciones, tarifas y canales de reserva del hotel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/rooms/new"
            className="px-5 py-3 bg-[#D4AF37] hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Habitación</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 border border-white/20"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Landing</span>
          </a>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* ROOMS STAT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Habitaciones
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#3D1347]">
                {rooms.length}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                ({activeRoomsCount} publicadas)
              </span>
            </div>
            <Link to="/admin/rooms" className="text-xs text-[#3D1347] font-semibold hover:underline mt-2 inline-block">
              Gestionar catálogo →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#3D1347] flex items-center justify-center">
            <BedDouble className="w-6 h-6" />
          </div>
        </div>

        {/* EXPERIENCES STAT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Experiencias
            </span>
            <span className="text-3xl font-serif font-bold text-slate-900">
              {experiences.length}
            </span>
            <Link to="/admin/content" className="text-xs text-[#3D1347] font-semibold hover:underline mt-2 inline-block">
              Ver actividades →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D4AF37] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        {/* SERVICES STAT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Servicios del Hotel
            </span>
            <span className="text-3xl font-serif font-bold text-slate-900">
              {services.length}
            </span>
            <Link to="/admin/content" className="text-xs text-[#3D1347] font-semibold hover:underline mt-2 inline-block">
              Ver servicios →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* REVIEWS STAT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Testimonios
            </span>
            <span className="text-3xl font-serif font-bold text-slate-900">
              {reviews.length}
            </span>
            <Link to="/admin/reviews" className="text-xs text-[#3D1347] font-semibold hover:underline mt-2 inline-block">
              Gestionar opiniones →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* QUICK STATUS & ROOMS PREVIEW TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TABLA RESUMEN HABITACIONES */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Habitaciones en el Catálogo
              </h3>
              <p className="text-xs text-slate-500">
                Últimas habitaciones configuradas en la landing page
              </p>
            </div>
            <Link
              to="/admin/rooms"
              className="text-xs font-bold text-[#3D1347] hover:underline"
            >
              Ver todas ({rooms.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Habitación</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Capacidad</th>
                  <th className="py-3 px-3">Tamaño</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {rooms.slice(0, 5).map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 flex items-center gap-3">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{room.name}</span>
                        <span className="text-[11px] text-slate-400">{room.bed}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#3D1347] border border-purple-100">
                        {room.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">{room.guestsLabel}</td>
                    <td className="py-3 px-3">{room.size}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/rooms/edit/${room.id}`}
                        className="text-xs font-bold text-[#3D1347] hover:text-[#D4AF37] transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA LATERAL: INFO DE CONTACTO & ACCESO A USUARIOS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* TARJETA CONTACTO RÁPIDO */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-serif font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>Canales de Contacto Directo</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">WhatsApp:</span>
                <span className="font-bold text-slate-800">+{settings.whatsappRaw}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Teléfono:</span>
                <span className="font-bold text-slate-800">{settings.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-800">{settings.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Cloudbeds:</span>
                <span className="font-bold text-emerald-600 truncate max-w-[150px]">Configurado</span>
              </div>
            </div>

            <Link
              to="/admin/settings"
              className="mt-5 w-full block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
            >
              Editar Información
            </Link>
          </div>

          {/* TARJETA ACCESO USUARIOS */}
          <div className="bg-gradient-to-br from-slate-900 to-[#2A0B33] text-white rounded-3xl p-6 shadow-md border border-[#D4AF37]/30">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Seguridad & Personal</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Gestión de Usuarios
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Crea o edita credenciales de acceso con contraseñas seguras y encriptadas.
            </p>
            <Link
              to="/admin/users"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#D4AF37] hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Administrar Usuarios</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
