import React, { useState } from 'react';
import { useHotelData } from '../../context/HotelDataContext';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import {
  MessageSquareQuote,
  Star,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  MapPin,
  Calendar
} from 'lucide-react';

export default function ReviewsAdminPage() {
  const { reviews, refreshReviews } = useHotelData();
  const [modal, setModal] = useState({ isOpen: false, data: null });
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    rating: 5,
    stayDate: '',
    comment: '',
    isFeatured: true
  });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleOpenModal = (review = null) => {
    if (review) {
      setFormData({
        name: review.name,
        origin: review.origin,
        rating: review.rating || 5,
        stayDate: review.stayDate || '',
        comment: review.comment || '',
        isFeatured: review.isFeatured !== false
      });
      setModal({ isOpen: true, data: review });
    } else {
      setFormData({
        name: '',
        origin: '',
        rating: 5,
        stayDate: 'Agosto 2026',
        comment: '',
        isFeatured: true
      });
      setModal({ isOpen: true, data: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.data) {
        await api.updateReview(modal.data.id, formData);
        setFeedback({ type: 'success', message: 'Reseña actualizada exitosamente.' });
      } else {
        await api.createReview(formData);
        setFeedback({ type: 'success', message: 'Nueva reseña publicada.' });
      }
      await refreshReviews();
      setModal({ isOpen: false, data: null });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteReview(deleteModal.id);
      await refreshReviews();
      setDeleteModal({ isOpen: false, id: null, name: '' });
      setFeedback({ type: 'success', message: 'Reseña eliminada.' });
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
            Reseñas & Testimonios de Huéspedes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Administra los comentarios destacados que se exhiben en la landing page del hotel.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/20 transition-all border border-purple-400/40 flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Reseña</span>
        </button>
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

      {/* GRID DE RESEÑAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* ESTRELLAS */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#5d205c] text-[#5d205c]" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {rev.stayDate}
                </span>
              </div>

              {/* COMENTARIO */}
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                "{rev.comment}"
              </p>
            </div>

            {/* AUTOR & ACCIONES */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{rev.name}</h4>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#5d205c]" />
                  {rev.origin}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenModal(rev)}
                  className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, id: rev.id, name: rev.name })}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CREAR / EDITAR */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h4 className="text-lg font-serif font-bold text-slate-900 mb-4">
              {modal.data ? 'Editar Testimonio' : 'Nuevo Testimonio de Huésped'}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Nombre del Huésped *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Valeria G."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5d205c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Origen / Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Buenos Aires, Argentina"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5d205c]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Fecha de Estadía
                  </label>
                  <input
                    type="text"
                    placeholder="Agosto 2026"
                    value={formData.stayDate}
                    onChange={(e) => setFormData({ ...formData, stayDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5d205c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Calificación
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-[#5d205c]"
                >
                  <option value={5}>★★★★★ (5 Estrellas - Excelente)</option>
                  <option value={4}>★★★★☆ (4 Estrellas - Muy Bueno)</option>
                  <option value={3}>★★★☆☆ (3 Estrellas - Bueno)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Comentario / Opinión *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe la experiencia del huésped en LuxSur..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5d205c]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModal({ isOpen: false, data: null })}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5d205c] hover:bg-[#7a2b79] rounded-xl shadow cursor-pointer"
                >
                  Guardar Reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="¿Eliminar reseña?"
        message={`¿Estás seguro de eliminar el testimonio de "${deleteModal.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
      />
    </div>
  );
}
