import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Star, ShieldCheck, MessageCircle } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';

export default function Navbar({ onOpenBookingModal }) {
  const { settings } = useHotelData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Historia', href: '#historia' },
    { name: 'Habitaciones', href: '#habitaciones' },
    { name: 'Experiencias', href: '#experiencias' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Restaurant', href: '#restaurant' },
    { name: 'Ubicación', href: '#ubicacion' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#381238]/95 backdrop-blur-md shadow-xl py-3 border-b border-[#5e265e]/40' 
        : 'bg-gradient-to-b from-[#381238]/90 via-[#381238]/60 to-transparent py-5'
    }`}>
      {/* BANNER PROMOCIONAL SI ESTÁ ACTIVO */}
      {settings.isBannerActive && settings.announcementBanner && (
        <div className="bg-[#5e265e] text-white text-xs font-bold py-1.5 px-4 text-center tracking-wide -mt-5 mb-3 shadow-md border-b border-purple-400/40">
          {settings.announcementBanner}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO E INSIGNIA CON MONOGRAMA LS Y CORONA */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#5e265e] via-[#8d398d] to-[#4d1a4d] p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#4d1a4d] rounded-full flex flex-col items-center justify-center relative overflow-hidden">
                <img 
                  src="/images/LOGO PNG LUXSUR BLANCO.png" 
                  alt="Logo Luxsur" 
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  {settings.hotelName?.split(' ')[0] || 'LuxSur'}
                </span>
                <span className="text-xs uppercase tracking-widest text-white font-semibold border border-purple-400/50 bg-[#5e265e]/30 px-1.5 py-0.5 rounded">
                  Boutique
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-200 text-[10px] tracking-wider uppercase font-medium">
                <div className="flex text-purple-300">
                  {[...Array(settings.stars || 4)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-purple-300" />
                  ))}
                </div>
                <span>{settings.stars || 4} Estrellas </span>
              </div>
            </div>
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-200 hover:text-white px-3 py-2 text-sm font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5e265e] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </nav>

          {/* CTA BUTTON & PHONE */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${(settings.phone || '').replace(/\s+/g, '')}`}
              className="hidden xl:flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-purple-300" />
              <span>{settings.phone}</span>
            </a>

            <a
              href={settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-emerald-900/30 hover:shadow-emerald-600/40 hover:scale-105 transition-all duration-300 border border-emerald-400/30"
            >
              <Calendar className="w-4 h-4 text-emerald-100" />
              <span>Reservar</span>
            </a>

            <Link
              to="/admin"
              title="Panel de Control & CMS"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-purple-400/30 transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href={settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden inline-flex items-center gap-1 bg-[#10B981] text-white text-xs px-3 py-1.5 rounded-full font-semibold"
            >
              Reservar
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-200 hover:text-white p-2 rounded-lg focus:outline-none"
              aria-label="Menú principal"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#381238] border-b border-[#5e265e]/40 px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-100 hover:text-purple-200 py-2 text-base font-medium border-b border-purple-900/40"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-gradient-to-r from-[#10B981] to-[#059669] text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar en Motor Oficial</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsappRaw || '595986495500'}?text=${encodeURIComponent(settings.whatsappMessage || 'Hola')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#25d366] border border-[#25d366]/40 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25d366]" />
              <span>Atención por WhatsApp ({settings.phone})</span>
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-white/5 hover:bg-white/10 text-purple-200 border border-purple-400/30 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Acceso al Panel de Control (CMS)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
