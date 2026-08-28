import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import { api } from '../../services/api';
import ImageUploader from '../components/ImageUploader';
import AmenitySelector from '../components/AmenitySelector';
import RoomLivePreview from '../components/RoomLivePreview';
import {
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  BedDouble,
  Sparkles,
  Layers,
  DollarSign,
  FileText
} from 'lucide-react';

const CATEGORIES_PRESET = ['Estándar', 'Suites', 'Familiar', 'Ejecutiva', 'Presidencial'];
const BED_PRESETS = [
  'Cama Single (96.5 cm x 190.5 cm)',
  'Cama Full/Double (134.5 cm x 190.5 cm)',
  'Cama Queen (152.5 cm x 203.5 cm)',
  'Cama King (193 cm x 203.5 cm)',
  '2 Camas Matrimoniales / Queen',
  '1 Cama King + 1 Cama Single',
  '2 Camas Single (Twin)'
];
const SIZE_PRESETS = ['20 m²', '25 m²', '32 m²', '40 m²', '45 m²', '55 m²', '65 m²'];
const BADGE_PRESETS = [
  { label: 'Ninguno', value: '', type: 'popular' },
  { label: 'Más Popular', value: 'Más Popular', type: 'popular' },
  { label: 'Sólo queda 1', value: 'Sólo queda 1', type: 'urgent' },
  { label: 'Ideal para Familias', value: 'Ideal para Familias', type: 'family' },
  { label: 'Exclusivo', value: 'Exclusivo VIP', type: 'custom' },
  { label: 'Oferta Especial', value: 'Tarifa Promo', type: 'urgent' }
];

export default function RoomEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, refreshRooms, allCategories } = useHotelData();
  const isEditing = Boolean(id);

  const categoriesList = allCategories && allCategories.length > 0
    ? allCategories.map(c => c.name)
    : CATEGORIES_PRESET;

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'specs' | 'images' | 'amenities' | 'pricing'
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Estándar',
    guests: 2,
    guestsLabel: '2 Personas',
    size: '32 m²',
    bed: 'Cama Full/Double (134.5 cm x 190.5 cm)',
    pricePYG: '350.000 Gs.',
    priceNumeric: 350000,
    showPrice: true,
    badge: '',
    badgeType: 'popular',
    description: '',
    image: '',
    gallery: [],
    features: [
      'Wi-Fi Gratis de alta velocidad 5G',
      'Aire Acondicionado & Calefacción',
      'TV LED Smart con Cable',
      'Desayuno Buffet Gourmet Incluido'
    ],
    customBookingUrl: '',
    orderIndex: 0,
    isActive: true
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing && id) {
      const room = rooms.find(r => r.id === id);
      if (room) {
        setFormData({
          id: room.id || '',
          name: room.name || '',
          category: room.category || 'Estándar',
          guests: room.guests || 1,
          guestsLabel: room.guestsLabel || `${room.guests || 1} Persona`,
          size: room.size || '30 m²',
          bed: room.bed || '',
          pricePYG: room.pricePYG || '',
          priceNumeric: room.priceNumeric || 0,
          showPrice: room.showPrice !== false,
          badge: room.badge || '',
          badgeType: room.badgeType || 'popular',
          description: room.description || '',
          image: room.image || '',
          gallery: Array.isArray(room.gallery) ? room.gallery : [],
          features: Array.isArray(room.features) ? room.features : [],
          customBookingUrl: room.customBookingUrl || '',
          orderIndex: room.orderIndex || 0,
          isActive: room.isActive !== false
        });
      }
    }
  }, [id, isEditing, rooms]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: val,
      // Autogenerar slug si es creación nueva y no se ha editado el ID a mano
      id: !isEditing ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.id
    }));
  };

  const handleGuestsChange = (e) => {
    const val = Number(e.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      guests: val,
      guestsLabel: `${val} ${val === 1 ? 'Persona' : 'Personas'}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'El nombre de la habitación es obligatorio.' });
      return;
    }
    if (!formData.id.trim()) {
      setFeedback({ type: 'error', message: 'El identificador (slug) es obligatorio.' });
      return;
    }
    if (!formData.image) {
      setFeedback({ type: 'error', message: 'Debes seleccionar o subir una foto de portada.' });
      return;
    }

    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      if (isEditing) {
        await api.updateRoom(id, formData);
        setFeedback({ type: 'success', message: 'Habitación actualizada exitosamente.' });
      } else {
        await api.createRoom(formData);
        setFeedback({ type: 'success', message: 'Habitación creada exitosamente.' });
      }

      await refreshRooms();

      setTimeout(() => {
        navigate('/admin/rooms');
      }, 1200);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error al guardar: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/rooms"
            className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isEditing ? 'Editar Habitación' : 'Nueva Habitación'}
            </span>
            <h1 className="text-2xl font-serif font-bold text-slate-900">
              {formData.name || 'Nueva Habitación'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/rooms"
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            Cancelar
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-[#5e265e] to-[#8d398d] hover:from-[#8d398d] hover:to-[#5e265e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/20 transition-all flex items-center gap-2 cursor-pointer border border-purple-400/40 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      {/* MENSAJE DE FEEDBACK */}
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

      {/* TABS DE NAVEGACIÓN DEL FORMULARIO */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'general', label: '1. Información Básica', icon: FileText },
          { id: 'specs', label: '2. Espacio & Acomodación', icon: Layers },
          { id: 'images', label: '3. Fotos & Galería', icon: Sparkles },
          { id: 'amenities', label: '4. Amenidades', icon: Check },
          { id: 'pricing', label: '5. Tarifas & Cloudbeds', icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#5e265e] text-white shadow-md shadow-purple-950/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FORMULARIO & PREVIEW EN 2 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA FORMULARIO (7 COLS) */}
        <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          
          {/* TAB 1: INFORMACIÓN BÁSICA */}
          {activeTab === 'general' && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2">
                Datos Principales de la Habitación
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Nombre Comercial de la Habitación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Suite Deluxe con Balcón"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Categoría *
                    </label>
                    <Link
                      to="/admin/categories"
                      target="_blank"
                      className="text-[11px] font-semibold text-[#5e265e] hover:underline"
                    >
                      + Gestionar
                    </Link>
                  </div>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e] bg-white"
                  >
                    {categoriesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Identificador Único (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    placeholder="suite-deluxe"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e] font-mono text-xs bg-slate-50 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* BADGE COMERCIAL */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Etiqueta Comercial / Badge Destacado (Opcional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {BADGE_PRESETS.map((b, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, badge: b.value, badgeType: b.type })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                        formData.badge === b.value
                          ? 'bg-[#5e265e] text-white border-[#5e265e]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="O escribe una personalizada (ej: Vista Panorámica)"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5e265e]"
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Descripción Detallada *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe la atmósfera, iluminación, mobiliario boutique y vistas..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e]"
                />
              </div>

              {/* ESTADO PUBLICACIÓN */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Publicar en la Landing Page
                  </span>
                  <span className="text-xs text-slate-500">
                    Si desactivas esta opción, la habitación se guardará como borrador oculto.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5e265e]"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: ESPACIO & ACOMODACIÓN */}
          {activeTab === 'specs' && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2">
                Capacidad, Dimensiones y Camas
              </h3>

              {/* HUÉSPEDES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Cantidad Máxima de Huéspedes *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={handleGuestsChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Etiqueta de Capacidad (Texto) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 4 Personas o 2 Adultos + 1 Niño"
                    value={formData.guestsLabel}
                    onChange={(e) => setFormData({ ...formData, guestsLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e]"
                  />
                </div>
              </div>

              {/* TAMAÑO / METROS CUADRADOS */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Tamaño / Superficie *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SIZE_PRESETS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, size: s })}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        formData.size === s
                          ? 'bg-[#5e265e] text-white border-[#5e265e]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Ej: 45 m² o 500 sq ft"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e]"
                />
              </div>

              {/* CAMAS / ACOMODACIÓN */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Configuración de Camas / Acomodación *
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {BED_PRESETS.map((b, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, bed: b })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                        formData.bed === b
                          ? 'bg-[#5e265e] text-white border-[#5e265e]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Ej: 1 Cama King (200x200) + 1 Sofá Cama"
                  value={formData.bed}
                  onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1a4d]"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FOTOS & GALERÍA */}
          {activeTab === 'images' && (
            <div className="animate-fadeIn">
              <ImageUploader
                mainImage={formData.image}
                gallery={formData.gallery}
                onMainImageChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                onGalleryChange={(newGallery) => setFormData(prev => ({ ...prev, gallery: newGallery }))}
              />
            </div>
          )}

          {/* TAB 4: AMENIDADES */}
          {activeTab === 'amenities' && (
            <div className="animate-fadeIn">
              <AmenitySelector
                features={formData.features}
                onChange={(newFeatures) => setFormData(prev => ({ ...prev, features: newFeatures }))}
              />
            </div>
          )}

          {/* TAB 5: TARIFAS & CLOUDBEDS */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-base font-serif font-bold text-slate-900 border-b border-slate-100 pb-2">
                Tarifas y Enlace de Reserva Cloudbeds
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Tarifa en Guaraníes (Texto para mostrar)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 616.000 Gs."
                    value={formData.pricePYG}
                    onChange={(e) => setFormData({ ...formData, pricePYG: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1a4d]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Monto Numérico (Para ordenamiento)
                  </label>
                  <input
                    type="number"
                    placeholder="616000"
                    value={formData.priceNumeric}
                    onChange={(e) => setFormData({ ...formData, priceNumeric: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4d1a4d]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Enlace de Reserva Específico en Cloudbeds (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://hotels.cloudbeds.com/es/reservation/ayuGKi/?..."
                  value={formData.customBookingUrl}
                  onChange={(e) => setFormData({ ...formData, customBookingUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4d1a4d]"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Si se deja vacío, se utilizará el enlace de Cloudbeds global configurado en el hotel.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* COLUMNA LATERAL: PREVIEW EN TIEMPO REAL (5 COLS) */}
        <div className="lg:col-span-5">
          <RoomLivePreview room={formData} />
        </div>

      </div>
    </div>
  );
}
