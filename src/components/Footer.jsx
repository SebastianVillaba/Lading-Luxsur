import React from 'react';
import { Star, MapPin, Phone, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { useHotelData } from '../context/HotelDataContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { settings } = useHotelData();

  return (
    <footer className="bg-[#1A0621] text-white pt-16 pb-8 border-t border-purple-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* BRAND COLUMN */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5d205c] via-[#7a2b79] to-[#3D1347] p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#3D1347] rounded-full flex flex-col items-center justify-center relative overflow-hidden">
                  <img 
                    src="/images/LOGO PNG LUXSUR BLANCO.png" 
                    alt="Logo Luxsur" 
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                  {settings.hotelName?.split(' ')[0] || 'LuxSur'} <span className="text-purple-300">Boutique</span>
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                  <span>Hotel {settings.stars || 4} Estrellas ****</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
              {settings.tagline || 'El lujo del Sur en el corazón de Encarnación, Paraguay.'} Confort moderno, gastronomía panorámica y servicio boutique de excelencia.
            </p>

            <div className="flex items-center gap-1 text-purple-300">
              {[...Array(settings.stars || 4)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-purple-300" />
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Navegación Rápida
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href="#inicio" className="hover:text-purple-200 transition-colors">Inicio & Búsqueda</a>
              </li>
              <li>
                <a href="#habitaciones" className="hover:text-purple-200 transition-colors">Habitaciones & Suites</a>
              </li>
              <li>
                <a href="#experiencias" className="hover:text-purple-200 transition-colors">Momentos Especiales</a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-purple-200 transition-colors">Servicios 4 Estrellas</a>
              </li>
              <li>
                <a href="#restaurant" className="hover:text-purple-200 transition-colors">Restaurant Panorámico Rooftop</a>
              </li>
              <li>
                <a href="#ubicacion" className="hover:text-purple-200 transition-colors">Ubicación en Encarnación</a>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Contacto & Recepción
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-300 flex-shrink-0" />
                <a href={`tel:${(settings.phone || '').replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-300 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* DIRECT RESERVATION ENGINE */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-white mb-4">
              Reserva Oficial
            </h4>
            <p className="text-xs text-slate-300 font-light mb-4 leading-relaxed">
              Garantizamos la mejor tarifa online a través del motor oficial de Cloudbeds con precios en Guaraníes (PYG).
            </p>
            <a
              href={settings.cloudbedsUrl || "https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all border border-emerald-400/30 cursor-pointer"
            >
              <span>Motor de Reserva Cloudbeds</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & ADMIN LINK */}
        <div className="pt-8 border-t border-purple-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.hotelName || 'LuxSur Hotel Boutique'} ****. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Panel de Control (CMS)</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
