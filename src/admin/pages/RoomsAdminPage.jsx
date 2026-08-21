import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHotelData } from '../../context/HotelDataContext';
import { api } from '../../services/api';
import ConfirmModal from '../components/ConfirmModal';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  BedDouble,
  Users,
  Maximize2,
  Bed,
  Check,
  AlertCircle,
  Layers,
  Tag
} from 'lucide-react';

export default function RoomsAdminPage() {
  const { rooms, refreshRooms, allCategories } = useHotelData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, roomId: null, roomName: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Categorías únicas combinando las existentes en habitaciones y las definidas en el catálogo
  const categories = [
    'all',
    ...new Set([
      ...rooms.map(r => r.category),
      ...(allCategories || []).map(c => c.name)
    ].filter(Boolean))
  ];

  // Filtros combinados
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.bed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleActive = async (room) => {
    setIsUpdating(true);
    try {
      const updated = { ...room, isActive: !room.isActive };
      await api.updateRoom(room.id, updated);
      await refreshRooms();
      setStatusMessage(`Estado de "${room.name}" actualizado.`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDuplicate = async (room) => {
    const newId = `${room.id}-copia-${Date.now().toString().slice(-4)}`;
    const newRoom = {
      ...room,
      id: newId,
      name: `${room.name} (Copia)`,
      orderIndex: rooms.length,
      isActive: false
    };

    try {
      await api.createRoom(newRoom);
      await refreshRooms();
      setStatusMessage(`Habitación duplicada exitosamente como borrador.`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert('Error al duplicar habitación: ' + err.message);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rooms.length) return;

    const newRooms = [...rooms];
    const temp = newRooms[index];
    newRooms[index] = newRooms[newIndex];
    newRooms[newIndex] = temp;

    const orders = newRooms.map((r, idx) => ({ id: r.id, orderIndex: idx }));

    try {
      await api.updateRoomsOrder(orders);
      await refreshRooms();
    } catch (err) {
      alert('Error al reordenar: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.roomId) return;
    try {
      await api.deleteRoom(deleteModal.roomId);
      await refreshRooms();
      setDeleteModal({ isOpen: false, roomId: null, roomName: '' });
      setStatusMessage('Habitación eliminada correctamente.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert('Error al eliminar habitación: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Gestión de Habitaciones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Crea nuevas habitaciones, edita fotos, camas, dimensiones, amenidades y orden en la landing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-xs transition-all flex-shrink-0 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>Gestionar Categorías ({allCategories.length})</span>
          </Link>
          <Link
            to="/admin/rooms/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#3D1347] hover:bg-[#2A0B33] text-[#D4AF37] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-950/20 transition-all border border-[#D4AF37]/30 flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Habitación</span>
          </Link>
        </div>
      </div>

      {/* MENSAJE DE ESTADO */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* BUSCADOR */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, cama o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1347]"
          />
        </div>

        {/* CATEGORÍAS TABS */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#3D1347] text-[#D4AF37]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE TARJETAS DE HABITACIONES */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <div
              key={room.id}
              className={`bg-white rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 flex flex-col justify-between ${
                room.isActive ? 'border-slate-200 hover:shadow-xl' : 'border-dashed border-slate-300 opacity-75 bg-slate-50/50'
              }`}
            >
              <div>
                {/* FOTO CON BADGES & ESTADO */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70" />

                  {/* BADGE DE PUBLICACIÓN */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => handleToggleActive(room)}
                      disabled={isUpdating}
                      title={room.isActive ? 'Habitación Publicada (Clic para ocultar)' : 'Habitación Oculta (Clic para publicar)'}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-md cursor-pointer transition-transform hover:scale-105 ${
                        room.isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {room.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{room.isActive ? 'Publicada' : 'Borrador'}</span>
                    </button>
                  </div>

                  {/* BADGE COMERCIAL */}
                  {room.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3D1347] text-amber-200 border border-[#D4AF37]/50 shadow-md">
                        {room.badge}
                      </span>
                    </div>
                  )}

                  {/* NOMBRE Y CATEGORÍA */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                      {room.category}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white truncate">
                      {room.name}
                    </h3>
                  </div>
                </div>

                {/* DETALLES Y ESPECIFICACIONES */}
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-1.5 py-2 px-2 bg-slate-50 rounded-xl border border-slate-200/60 mb-4 text-center text-slate-700 text-xs font-medium">
                    <div className="flex flex-col items-center justify-center p-1">
                      <Users className="w-3.5 h-3.5 text-[#3D1347] mb-0.5" />
                      <span className="truncate max-w-full">{room.guestsLabel}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200">
                      <Maximize2 className="w-3.5 h-3.5 text-[#3D1347] mb-0.5" />
                      <span>{room.size}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1">
                      <Bed className="w-3.5 h-3.5 text-[#3D1347] mb-0.5" />
                      <span className="truncate max-w-[70px]" title={room.bed}>{room.bed}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {room.description}
                  </p>

                  <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                    <span>Fotos: {(room.gallery?.length || 0) + 1}</span>
                    <span>Amenidades: {room.features?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* BARRA DE ACCIONES */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* BOTONES DE REORDENAR */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    title="Mover arriba"
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === rooms.length - 1}
                    title="Mover abajo"
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* BOTONES EDITAR / DUPLICAR / BORRAR */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDuplicate(room)}
                    title="Duplicar habitación"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/admin/rooms/edit/${room.id}`}
                    title="Editar habitación"
                    className="px-3 py-1.5 bg-[#3D1347] hover:bg-[#2A0B33] text-[#D4AF37] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: true, roomId: room.id, roomName: room.name })}
                    title="Eliminar habitación"
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No se encontraron habitaciones</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            No hay habitaciones que coincidan con los criterios de búsqueda o filtros seleccionados.
          </p>
          <Link
            to="/admin/rooms/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3D1347] text-[#D4AF37] text-xs font-bold rounded-xl shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Primera Habitación</span>
          </Link>
        </div>
      )}

      {/* DIÁLOGO MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="¿Eliminar habitación?"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${deleteModal.roomName}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, roomId: null, roomName: '' })}
      />
    </div>
  );
}
