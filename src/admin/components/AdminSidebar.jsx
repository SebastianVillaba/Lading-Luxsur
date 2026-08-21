import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BedDouble,
  Sliders,
  Compass,
  Users,
  ExternalLink,
  MessageSquareQuote,
  Sparkles,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/rooms', label: 'Habitaciones', icon: BedDouble },
  { path: '/admin/categories', label: 'Categorías', icon: Layers },
  { path: '/admin/settings', label: 'Configuración General', icon: Sliders },
  { path: '/admin/content', label: 'Experiencias & Servicios', icon: Compass },
  { path: '/admin/reviews', label: 'Reseñas & Testimonios', icon: MessageSquareQuote },
  { path: '/admin/users', label: 'Gestión de Usuarios', icon: Users }
];

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* BACKDROP MOBILE */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#2A0B33] text-white flex flex-col justify-between border-r border-[#3D1347]/50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* LOGO & BRAND */}
          <div className="p-6 border-b border-purple-900/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#C5A059] to-[#997A23] p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-[#3D1347] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="/images/LOGO PNG LUXSUR BLANCO.png"
                    alt="Logo LuxSur"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-white leading-none">
                  LuxSur
                </h1>
                <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase block mt-1">
                  Panel de Control
                </span>
              </div>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#3D1347] text-[#D4AF37] shadow-lg shadow-purple-950/40 border border-[#D4AF37]/30'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM QUICK ACTIONS */}
        <div className="p-4 border-t border-purple-900/40 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-white/10"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ver Sitio Web en Vivo</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </aside>
    </>
  );
}
