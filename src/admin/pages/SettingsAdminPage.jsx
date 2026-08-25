import React, { useState, useEffect } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { api } from '../../services/api';
import {
  Save,
  Check,
  AlertCircle,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  ExternalLink,
  Sliders,
  Megaphone
} from 'lucide-react';

export default function SettingsAdminPage() {
  const { settings, refreshSettings } = useHotelData();
  const [formData, setFormData] = useState({
    hotelName: '',
    stars: 4,
    tagline: '',
    address: '',
    phone: '',
    whatsappRaw: '',
    whatsappMessage: '',
    email: '',
    cloudbedsUrl: '',
    mapsUrl: '',
    googleMapsEmbed: '',
    announcementBanner: '',
    isBannerActive: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (settings) {
      setFormData({
        hotelName: settings.hotelName || 'LuxSur Hotel Boutique',
        stars: settings.stars || 4,
        tagline: settings.tagline || '',
        address: settings.address || '',
        phone: settings.phone || '',
        whatsappRaw: settings.whatsappRaw || '',
        whatsappMessage: settings.whatsappMessage || '',
        email: settings.email || '',
        cloudbedsUrl: settings.cloudbedsUrl || '',
        mapsUrl: settings.mapsUrl || '',
        googleMapsEmbed: settings.googleMapsEmbed || '',
        announcementBanner: settings.announcementBanner || '',
        isBannerActive: Boolean(settings.isBannerActive)
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      await api.updateSettings(formData);
      await refreshSettings();
      setFeedback({ type: 'success', message: 'Configuraciones generales guardadas exitosamente.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error al guardar configuraciones: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Configuración General del Hotel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administra los canales oficiales de contacto, número de WhatsApp, motor Cloudbeds y mapa de ubicación.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/20 transition-all flex items-center gap-2 cursor-pointer border border-purple-400/40 disabled:opacity-50 flex-shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Guardando...' : 'Guardar Ajustes'}</span>
        </button>
      </div>

      {/* FEEDBACK */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 animate-fadeIn text-xs sm:text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCIÓN 1: IDENTIDAD INSTITUCIONAL */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#5d205c]" />
            <span>Identidad & Textos Institucionales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Nombre del Hotel
              </label>
              <input
                type="text"
                value={formData.hotelName}
                onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Estrellas
              </label>
              <select
                value={formData.stars}
                onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347] bg-white"
              >
                <option value={3}>3 Estrellas</option>
                <option value={4}>4 Estrellas</option>
                <option value={5}>5 Estrellas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Lema / Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>
        </div>

        {/* SECCIÓN 2: CANALES DE CONTACTO & WHATSAPP */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Canales de Contacto Directo & WhatsApp</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                WhatsApp Numérico (Sin espacios ni signos)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <input
                  type="text"
                  placeholder="595986495500"
                  value={formData.whatsappRaw}
                  onChange={(e) => setFormData({ ...formData, whatsappRaw: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347] font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Utilizado para el botón flotante y enlaces de chat directo.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Teléfono de Recepción (Formato con espacios)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4 text-[#3D1347]" />
                </div>
                <input
                  type="text"
                  placeholder="+595 986 495 500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Mensaje Predefinido de WhatsApp
            </label>
            <input
              type="text"
              placeholder="Hola LuxSur Hotel Boutique, deseo consultar disponibilidad..."
              value={formData.whatsappMessage}
              onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Correo Electrónico de Reservas
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="email"
                placeholder="reservas@luxsurhotel.com.py"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: MOTOR DE RESERVA CLOUDBEDS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-emerald-600" />
            <span>Motor de Reservas Oficial (Cloudbeds)</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              URL Global de Reserva en Cloudbeds
            </label>
            <input
              type="url"
              placeholder="https://hotels.cloudbeds.com/es/reservation/ayuGKi/?currency=pyg"
              value={formData.cloudbedsUrl}
              onChange={(e) => setFormData({ ...formData, cloudbedsUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Todos los botones de reserva generales de la landing page abrirán esta dirección.
            </span>
          </div>
        </div>

        {/* SECCIÓN 4: UBICACIÓN Y MAPAS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Dirección y Mapa Interactivo</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Dirección Física
            </label>
            <input
              type="text"
              placeholder="Encarnación, Itapúa - Paraguay"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Enlace de Navegación Google Maps
            </label>
            <input
              type="url"
              value={formData.mapsUrl}
              onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              URL Embed de Google Maps (Iframe)
            </label>
            <textarea
              rows={2}
              value={formData.googleMapsEmbed}
              onChange={(e) => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#3D1347] font-mono"
            />
          </div>
        </div>

        {/* SECCIÓN 5: BANNER DE AVISO SUPERIOR */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#5d205c]" />
              <span>Banner de Anuncio Promocional (Opcional)</span>
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBannerActive}
                onChange={(e) => setFormData({ ...formData, isBannerActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5d205c]"></div>
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Texto del Anuncio
            </label>
            <input
              type="text"
              placeholder="¡Temporada de Verano en Encarnación! Consulta tarifas directas con desayuno incluido."
              value={formData.announcementBanner}
              onChange={(e) => setFormData({ ...formData, announcementBanner: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>
        </div>

      </form>
    </div>
  );
}
