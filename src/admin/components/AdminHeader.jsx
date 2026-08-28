import React, { useState } from 'react';
import { Menu, LogOut, User, Globe, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

export default function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* MOBILE TOGGLE & TITLE */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <span className="text-xs text-slate-400 font-medium">Hotel Boutique 4 Estrellas</span>
            <h2 className="text-sm font-bold text-slate-800 font-serif">LuxSur Encarnación</h2>
          </div>
        </div>

        {/* USER PROFILE & LOGOUT */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#4d1a4d]" />
            <span>Ver Landing</span>
          </a>

          {/* USER PROFILE BADGE */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-xs text-slate-700">
            <div className="w-6 h-6 rounded-full bg-[#5e265e] text-white flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-[#5e265e] leading-tight">
                {user?.name || user?.username || 'Admin'}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">
                {user?.role || 'admin'}
              </span>
            </div>
          </div>

          {/* CAMBIAR CONTRASEÑA BOTÓN */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            title="Cambiar Mi Contraseña"
            className="p-2 rounded-xl text-slate-500 hover:text-[#5e265e] hover:bg-purple-50 transition-colors cursor-pointer border border-transparent hover:border-purple-200 flex items-center gap-1 text-xs font-semibold"
          >
            <Key className="w-4 h-4 text-[#5e265e]" />
            <span className="hidden md:inline">Clave</span>
          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MODAL DE CAMBIO DE CONTRASEÑA PERSONAL */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        username={user?.username}
      />
    </>
  );
}
