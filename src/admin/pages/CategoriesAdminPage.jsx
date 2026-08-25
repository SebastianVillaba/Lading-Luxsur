import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  BedDouble,
  Check,
  AlertCircle,
  Search,
  ArrowUp,
  ArrowDown,
  Layers,
  ShieldAlert,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

export default function CategoriesAdminPage() {
  const { allCategories, refreshCategories, rooms, refreshRooms } = useHotelData();

  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Modal Crear / Editar
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEditing: false,
    category: null
  });

  const [formState, setFormState] = useState({
    id: '',
    name: '',
    description: '',
    isActive: true
  });

  // Modal Confirmar Eliminación
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    category: null
  });

  // Modal Informativo de Bloqueo de Eliminación
  const [blockedModal, setBlockedModal] = useState({
    isOpen: false,
    category: null,
    associatedRooms: []
  });

  // Filtrar categorías
  const filteredCategories = (allCategories || []).filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    cat.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setFormState({
      id: '',
      name: '',
      description: '',
      isActive: true
    });
    setModalState({
      isOpen: true,
      isEditing: false,
      category: null
    });
  };

  const openEditModal = (cat) => {
    setFormState({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      isActive: cat.isActive !== false
    });
    setModalState({
      isOpen: true,
      isEditing: true,
      category: cat
    });
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormState(prev => ({
      ...prev,
      name: val,
      id: !modalState.isEditing
        ? val
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : prev.id
    }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      setFeedback({ type: 'error', message: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    setIsSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      if (modalState.isEditing) {
        await api.updateCategory(modalState.category.id, formState);
        setFeedback({ type: 'success', message: `Categoría "${formState.name}" actualizada correctamente.` });
      } else {
        await api.createCategory(formState);
        setFeedback({ type: 'success', message: `Categoría "${formState.name}" creada exitosamente.` });
      }

      await Promise.all([refreshCategories(), refreshRooms()]);
      setModalState({ isOpen: false, isEditing: false, category: null });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3500);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Error al guardar la categoría.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (cat) => {
    // Buscar habitaciones asociadas
    const associated = rooms.filter(
      r => r.category === cat.name || r.category === cat.id
    );

    if (associated.length > 0 || (cat.roomsCount && cat.roomsCount > 0)) {
      setBlockedModal({
        isOpen: true,
        category: cat,
        associatedRooms: associated
      });
    } else {
      setDeleteModal({
        isOpen: true,
        category: cat
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.category) return;
    try {
      await api.deleteCategory(deleteModal.category.id);
      await refreshCategories();
      setDeleteModal({ isOpen: false, category: null });
      setFeedback({ type: 'success', message: 'Categoría eliminada correctamente.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3500);
    } catch (err) {
      setDeleteModal({ isOpen: false, category: null });
      setFeedback({ type: 'error', message: err.message || 'Error al eliminar la categoría.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= allCategories.length) return;

    const newCategories = [...allCategories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[newIndex];
    newCategories[newIndex] = temp;

    const orders = newCategories.map((c, idx) => ({ id: c.id, orderIndex: idx }));

    try {
      await api.updateCategoriesOrder(orders);
      await refreshCategories();
    } catch (err) {
      alert('Error al reordenar categorías: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/rooms"
            className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Volver a Habitaciones"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Layers className="w-7 h-7 text-[#5d205c]" />
              <span>Categorías de Habitaciones</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Administra las clasificaciones de habitaciones (Estándar, Suites, Familiar, etc.) y su orden en los filtros.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/rooms"
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            Ver Habitaciones
          </Link>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/20 transition-all border border-purple-400/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
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

      {/* BARRA DE BÚSQUEDA Y ESTADÍSTICAS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar categoría por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5d205c]"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total de categorías: <span className="font-bold text-slate-800">{allCategories.length}</span>
        </div>
      </div>

      {/* LISTADO DE CATEGORÍAS */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat, index) => {
            const assignedCount = rooms.filter(r => r.category === cat.name || r.category === cat.id).length;
            const hasAssignedRooms = assignedCount > 0;

            return (
              <div
                key={cat.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between transition-all duration-300 ${
                  cat.isActive !== false
                    ? 'border-slate-200 hover:shadow-md hover:border-purple-200'
                    : 'border-dashed border-slate-300 opacity-75 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* HEADER DE TARJETA */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5d205c] flex items-center justify-center font-bold">
                        <Tag className="w-4 h-4 text-[#5d205c]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {cat.id}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.isActive !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {cat.isActive !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{cat.isActive !== false ? 'Activa' : 'Oculta'}</span>
                    </span>
                  </div>

                  {/* DESCRIPCIÓN */}
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px] mb-4">
                    {cat.description || 'Sin descripción asignada.'}
                  </p>

                  {/* BADGE DE HABITACIONES VINCULADAS */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        hasAssignedRooms
                          ? 'bg-purple-50 text-[#5d205c] border border-purple-200 font-bold'
                          : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <BedDouble className="w-4 h-4 text-[#5d205c]" />
                      <span>
                        {assignedCount} {assignedCount === 1 ? 'habitación asignada' : 'habitaciones asignadas'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* REORDENAR */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      title="Mover arriba"
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === allCategories.length - 1}
                      title="Mover abajo"
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* EDITAR / BORRAR */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(cat)}
                      title={hasAssignedRooms ? 'No se puede eliminar: tiene habitaciones asignadas' : 'Eliminar categoría'}
                      className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        hasAssignedRooms
                          ? 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                          : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No se encontraron categorías</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Crea una nueva categoría para organizar las habitaciones de tu hotel.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5d205c] hover:bg-[#7a2b79] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Categoría</span>
          </button>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-fadeIn">
            <h4 className="text-lg font-bold font-serif text-slate-900 mb-1 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#5d205c]" />
              <span>{modalState.isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</span>
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              {modalState.isEditing
                ? 'Actualiza el nombre o la descripción. Si modificas el nombre, se actualizará automáticamente en las habitaciones vinculadas.'
                : 'Ingresa el nombre descriptivo de la nueva categoría para clasificar habitaciones.'}
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Suite Presidencial"
                  value={formState.name}
                  onChange={handleNameChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#5d205c] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Identificador / Slug *
                </label>
                <input
                  type="text"
                  required
                  disabled={modalState.isEditing}
                  placeholder="suite-presidencial"
                  value={formState.id}
                  onChange={(e) => setFormState({ ...formState, id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 disabled:opacity-60 focus:ring-2 focus:ring-[#5d205c] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Breve descripción de las características de esta categoría..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5d205c] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Estado Activo</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5d205c]"></div>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalState({ isOpen: false, isEditing: false, category: null })}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5d205c] hover:bg-[#7a2b79] rounded-xl shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INFORMATIVO: BLOQUEO DE ELIMINACIÓN */}
      {blockedModal.isOpen && blockedModal.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold font-serif text-slate-900 text-center mb-2">
              No se puede eliminar esta categoría
            </h4>

            <p className="text-xs text-slate-600 text-center mb-4 leading-relaxed">
              La categoría <strong className="text-slate-900">"{blockedModal.category.name}"</strong> está siendo utilizada por{' '}
              <strong>{blockedModal.associatedRooms.length || blockedModal.category.roomsCount} habitación(es)</strong>.
            </p>

            {blockedModal.associatedRooms.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-5 max-h-36 overflow-y-auto space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Habitaciones asociadas:
                </span>
                {blockedModal.associatedRooms.map(r => (
                  <div key={r.id} className="text-xs font-medium text-slate-700 flex items-center gap-2">
                    <BedDouble className="w-3.5 h-3.5 text-[#3D1347] flex-shrink-0" />
                    <span className="truncate">{r.name}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center mb-6">
              Para eliminarla, primero debes reasignar estas habitaciones a otra categoría o eliminarlas.
            </p>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setBlockedModal({ isOpen: false, category: null, associatedRooms: [] })}
                className="w-full px-5 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="¿Eliminar categoría?"
        message={`¿Estás seguro de que deseas eliminar permanentemente la categoría "${deleteModal.category?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, category: null })}
      />
    </div>
  );
}
