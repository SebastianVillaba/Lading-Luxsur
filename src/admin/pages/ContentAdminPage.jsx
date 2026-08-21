import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import SingleImageUploader from '../components/SingleImageUploader';
import {
  Compass,
  CheckCircle2,
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  Save,
  Check,
  AlertCircle,
  Wifi,
  Coffee,
  Car,
  AirVent,
  Tv,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

const LUCIDE_ICONS_LIST = [
  { name: 'Wifi', icon: Wifi, label: 'Wi-Fi' },
  { name: 'Coffee', icon: Coffee, label: 'Desayuno / Café' },
  { name: 'UtensilsCrossed', icon: UtensilsCrossed, label: 'Restaurant / Bar' },
  { name: 'Car', icon: Car, label: 'Estacionamiento' },
  { name: 'AirVent', icon: AirVent, label: 'Climatización' },
  { name: 'Tv', icon: Tv, label: 'Televisión Smart' },
  { name: 'Shield', icon: Shield, label: 'Seguridad 24h' },
  { name: 'Clock', icon: Clock, label: 'Recepción 24/7' },
  { name: 'Sparkles', icon: Sparkles, label: 'Servicio Boutique' }
];

export default function ContentAdminPage() {
  const { allExperiences, allServices, rooftop, refreshContent } = useHotelData();
  const [activeSection, setActiveSection] = useState('experiences'); // 'experiences' | 'services' | 'rooftop'
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal Experiencias
  const [expModal, setExpModal] = useState({ isOpen: false, data: null });
  const [expForm, setExpForm] = useState({ id: '', title: '', subtitle: '', description: '', image: '', tag: '', isActive: true });

  // Modal Servicios
  const [servModal, setServModal] = useState({ isOpen: false, data: null });
  const [servForm, setServForm] = useState({ id: '', icon: 'Wifi', title: '', description: '', image: '', isActive: true });

  // Rooftop Form
  const [rooftopForm, setRooftopForm] = useState(rooftop || {
    title: '',
    subtitle: '',
    description: '',
    hours: '',
    image: '',
    highlights: []
  });

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: '', name: '' });

  // Guardar Experiencia
  const handleSaveExp = async (e) => {
    e.preventDefault();
    try {
      await api.saveExperience(expForm);
      await refreshContent();
      setExpModal({ isOpen: false, data: null });
      setFeedback({ type: 'success', message: 'Experiencia guardada exitosamente.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Guardar Servicio
  const handleSaveServ = async (e) => {
    e.preventDefault();
    try {
      await api.saveService(servForm);
      await refreshContent();
      setServModal({ isOpen: false, data: null });
      setFeedback({ type: 'success', message: 'Servicio guardado exitosamente.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Guardar Rooftop
  const handleSaveRooftop = async (e) => {
    e.preventDefault();
    try {
      await api.updateRooftop(rooftopForm);
      await refreshContent();
      setFeedback({ type: 'success', message: 'Restaurant & Rooftop actualizado.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Confirmar eliminación
  const handleDeleteConfirm = async () => {
    try {
      if (deleteModal.type === 'experience') {
        await api.deleteExperience(deleteModal.id);
      } else if (deleteModal.type === 'service') {
        await api.deleteService(deleteModal.id);
      }
      await refreshContent();
      setDeleteModal({ isOpen: false, type: '', id: '', name: '' });
      setFeedback({ type: 'success', message: 'Elemento eliminado correctamente.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Experiencias, Servicios & Restaurante
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestiona las secciones de actividades turísticas de Encarnación, comodidades del hotel y el Restaurante Rooftop.
          </p>
        </div>
      </div>

      {/* FEEDBACK */}
      {feedback.message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-medium ${
          feedback.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 text-rose-800'
        }`}>
          <Check className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION TABS */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSection('experiences')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'experiences'
              ? 'bg-[#3D1347] text-[#D4AF37] shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Experiencias ({allExperiences.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('services')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'services'
              ? 'bg-[#3D1347] text-[#D4AF37] shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Servicios del Hotel ({allServices.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('rooftop')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSection === 'rooftop'
              ? 'bg-[#3D1347] text-[#D4AF37] shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Restaurant Panorámico</span>
        </button>
      </div>

      {/* 1. SECCIÓN EXPERIENCIAS */}
      {activeSection === 'experiences' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Actividades y Paquetes de Experiencias
            </h3>
            <button
              onClick={() => {
                setExpForm({ id: `exp-${Date.now()}`, title: '', subtitle: '', description: '', image: '', tag: 'Turismo', isActive: true });
                setExpModal({ isOpen: true, data: null });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3D1347] hover:bg-[#2A0B33] text-[#D4AF37] rounded-xl text-xs font-bold shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Experiencia</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allExperiences.map((exp) => (
              <div key={exp.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-36 bg-slate-900">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3D1347] text-amber-200 border border-[#D4AF37]/40">
                      {exp.tag}
                    </span>
                    <span className="absolute bottom-2 left-2 text-white font-serif font-bold text-sm">
                      {exp.title}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] font-semibold text-[#D4AF37] uppercase block mb-1">{exp.subtitle}</span>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{exp.description}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setExpForm(exp);
                      setExpModal({ isOpen: true, data: exp });
                    }}
                    className="p-1.5 text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, type: 'experience', id: exp.id, name: exp.title })}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SECCIÓN SERVICIOS */}
      {activeSection === 'services' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Servicios Destacados del Hotel
            </h3>
            <button
              onClick={() => {
                setServForm({ id: `serv-${Date.now()}`, icon: 'Wifi', title: '', description: '', isActive: true });
                setServModal({ isOpen: true, data: null });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3D1347] hover:bg-[#2A0B33] text-[#D4AF37] rounded-xl text-xs font-bold shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Servicio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allServices.map((serv) => (
              <div key={serv.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#3D1347] flex items-center justify-center font-bold text-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">Ícono: {serv.icon}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{serv.title}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{serv.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setServForm(serv);
                      setServModal({ isOpen: true, data: serv });
                    }}
                    className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, type: 'service', id: serv.id, name: serv.title })}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SECCIÓN RESTAURANT ROOFTOP */}
      {activeSection === 'rooftop' && (
        <form onSubmit={handleSaveRooftop} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-fadeIn max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#D4AF37]" />
              <span>Restaurant Panorámico & Rooftop Bar</span>
            </h3>
            <button
              type="submit"
              className="px-5 py-2 bg-[#3D1347] hover:bg-[#2A0B33] text-[#D4AF37] font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Guardar Restaurante
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Título Principal
            </label>
            <input
              type="text"
              value={rooftopForm.title}
              onChange={(e) => setRooftopForm({ ...rooftopForm, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Subtítulo
            </label>
            <input
              type="text"
              value={rooftopForm.subtitle}
              onChange={(e) => setRooftopForm({ ...rooftopForm, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Horario de Atención
            </label>
            <input
              type="text"
              value={rooftopForm.hours}
              onChange={(e) => setRooftopForm({ ...rooftopForm, hours: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>

          <div>
            <SingleImageUploader
              value={rooftopForm.image}
              onChange={(url) => setRooftopForm({ ...rooftopForm, image: url })}
              label="Foto de Portada del Restaurant Rooftop"
              helperText="Sube una foto representativa del rooftop (JPG, PNG, WebP)"
              aspectRatio="aspect-video"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Descripción de la Propuesta Gastronómica
            </label>
            <textarea
              rows={4}
              value={rooftopForm.description}
              onChange={(e) => setRooftopForm({ ...rooftopForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
            />
          </div>
        </form>
      )}

      {/* MODAL EDITAR / CREAR EXPERIENCIA */}
      {expModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <h4 className="text-lg font-bold font-serif text-slate-900 mb-4">
              {expModal.data ? 'Editar Experiencia' : 'Nueva Experiencia'}
            </h4>
            <form onSubmit={handleSaveExp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#3D1347]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={expForm.subtitle}
                    onChange={(e) => setExpForm({ ...expForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#3D1347]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Etiqueta</label>
                  <input
                    type="text"
                    value={expForm.tag}
                    onChange={(e) => setExpForm({ ...expForm, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#3D1347]"
                  />
                </div>
              </div>
              <div>
                <SingleImageUploader
                  value={expForm.image}
                  onChange={(url) => setExpForm({ ...expForm, image: url })}
                  label="Foto de la Experiencia"
                  helperText="Selecciona un archivo JPG, PNG o WebP desde tu computadora"
                  aspectRatio="aspect-video"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#3D1347]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setExpModal({ isOpen: false, data: null })}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#D4AF37] hover:bg-amber-400 rounded-xl shadow"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR / CREAR SERVICIO */}
      {servModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h4 className="text-lg font-bold font-serif text-slate-900 mb-4">
              {servModal.data ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h4>
            <form onSubmit={handleSaveServ} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Ícono</label>
                <select
                  value={servForm.icon}
                  onChange={(e) => setServForm({ ...servForm, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  {LUCIDE_ICONS_LIST.map(ic => (
                    <option key={ic.name} value={ic.name}>{ic.label} ({ic.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <SingleImageUploader
                  value={servForm.image || ''}
                  onChange={(url) => setServForm({ ...servForm, image: url })}
                  label="Foto o Imagen del Servicio (Opcional)"
                  helperText="Sube una foto del servicio desde tu computadora (JPG, PNG, WebP)"
                  aspectRatio="aspect-video"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={servForm.title}
                  onChange={(e) => setServForm({ ...servForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#3D1347]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={servForm.description}
                  onChange={(e) => setServForm({ ...servForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#3D1347]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setServModal({ isOpen: false, data: null })}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-[#D4AF37] hover:bg-amber-400 rounded-xl shadow"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="¿Eliminar elemento?"
        message={`¿Estás seguro de eliminar "${deleteModal.name}"? Esta acción se reflejará en la web.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, type: '', id: '', name: '' })}
      />
    </div>
  );
}
