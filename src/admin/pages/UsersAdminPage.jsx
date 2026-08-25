import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  UserCheck,
  UserX,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

export default function UsersAdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminResetModalOpen, setIsAdminResetModalOpen] = useState(false);
  const [isSelfPasswordModalOpen, setIsSelfPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'admin',
    password: '',
    confirmPassword: '',
    isActive: true
  });
  const [adminResetFormData, setAdminResetFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const isAdmin = (currentUser?.role || '').toLowerCase() === 'admin';

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getUsers();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (error) {
      showToast('Error cargando lista de usuarios: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    if (!isAdmin) return;
    setSelectedUser(null);
    setFormData({
      username: '',
      name: '',
      role: 'admin',
      password: '',
      confirmPassword: '',
      isActive: true
    });
    setFormError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    if (!isAdmin) return;
    setSelectedUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      role: user.role || 'admin',
      password: '',
      confirmPassword: '',
      isActive: user.isActive
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenAdminResetModal = (user) => {
    if (!isAdmin) return;
    setSelectedUser(user);
    setAdminResetFormData({
      newPassword: '',
      confirmNewPassword: ''
    });
    setFormError('');
    setShowPassword(false);
    setIsAdminResetModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Por favor ingrese el nombre completo.');
      return;
    }

    if (!selectedUser) {
      if (!formData.username.trim()) {
        setFormError('El nombre de usuario es obligatorio.');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setFormError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setFormError('Las contraseñas no coinciden.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      if (selectedUser) {
        // Actualizar datos de usuario
        const res = await api.updateUser(selectedUser.id, {
          name: formData.name,
          role: formData.role,
          isActive: formData.isActive
        });
        if (res.success) {
          showToast(`Usuario "${selectedUser.username}" actualizado.`);
          setIsModalOpen(false);
          fetchUsers();
        }
      } else {
        // Crear nuevo usuario
        const res = await api.createUser(formData);
        if (res.success) {
          showToast(`Usuario "${formData.username}" creado exitosamente.`);
          setIsModalOpen(false);
          fetchUsers();
        }
      }
    } catch (error) {
      setFormError(error.message || 'Error guardando usuario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAdminReset = async (e) => {
    e.preventDefault();
    if (!isAdmin || !selectedUser) return;
    setFormError('');

    if (!adminResetFormData.newPassword || adminResetFormData.newPassword.length < 6) {
      setFormError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (adminResetFormData.newPassword !== adminResetFormData.confirmNewPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.resetUserPassword(selectedUser.id, adminResetFormData.newPassword);
      if (res.success) {
        showToast(`Contraseña de "${selectedUser.username}" restablecida exitosamente.`);
        setIsAdminResetModalOpen(false);
      }
    } catch (error) {
      setFormError(error.message || 'Error actualizando contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (!isAdmin) return;
    try {
      const newStatus = !user.isActive;
      const res = await api.toggleUserStatus(user.id, newStatus);
      if (res.success) {
        setUsers(users.map(u => u.id === user.id ? { ...u, isActive: newStatus } : u));
        showToast(`Estado de "${user.username}" actualizado.`);
      }
    } catch (error) {
      showToast('Error cambiando estado: ' + error.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!isAdmin || !userToDelete) return;
    try {
      const res = await api.deleteUser(userToDelete.id);
      if (res.success) {
        showToast(`Usuario "${userToDelete.username}" eliminado.`);
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (error) {
      showToast(error.message || 'Error eliminando usuario.', 'error');
      setUserToDelete(null);
    }
  };

  // Filtrado
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 bg-[#5d205c]/10 text-[#5d205c] border border-purple-300/40 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <Shield className="w-3 h-3 text-[#5d205c]" />
            Administrador
          </span>
        );
      case 'recepcion':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Recepción
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Editor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold shadow-lg animate-fadeIn ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-950/20'
              : 'bg-rose-600 text-white shadow-rose-950/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-[#5d205c] text-white rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Gestión de Usuarios
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Cuentas autorizadas con acceso al Panel de Control. Todas las contraseñas se almacenan con encriptación segura.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* BOTON CAMBIAR MI CONTRASEÑA */}
          <button
            onClick={() => setIsSelfPasswordModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <Key className="w-4 h-4 text-[#5d205c]" />
            <span>Cambiar Mi Contraseña</span>
          </button>

          {/* BOTON CREAR USUARIO (SOLO ADMIN) */}
          {isAdmin && (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-950/20 border border-purple-400/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>Crear Nuevo Usuario</span>
            </button>
          )}
        </div>
      </div>

      {/* AVISO DE PERMISOS SI NO ES ADMIN */}
      {!isAdmin && (
        <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-center gap-3 text-xs text-[#5d205c]">
          <Info className="w-4 h-4 text-[#5d205c] flex-shrink-0" />
          <span>
            <strong>Modo Consulta:</strong> Tu rol actual ({currentUser?.role || 'operador'}) te permite visualizar la lista. Solo los <strong>Administradores</strong> pueden registrar, editar o eliminar usuarios. Puedes cambiar tu propia clave con el botón superior.
          </span>
        </div>
      )}

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por usuario o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3D1347]/20 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Filtrar Rol:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3D1347]/20 shadow-xs"
          >
            <option value="all">Todos los Roles ({users.length})</option>
            <option value="admin">Administradores</option>
            <option value="recepcion">Recepción</option>
            <option value="editor">Editores</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-3 border-[#3D1347] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>Cargando usuarios del sistema...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700">No se encontraron usuarios</h4>
            <p className="text-xs text-slate-400 mt-1">
              {isAdmin ? 'Crea un nuevo usuario usando el botón superior.' : 'No hay usuarios que coincidan con la búsqueda.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Usuario & Nombre</th>
                  <th className="py-3.5 px-4">Rol</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Fecha Alta</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredUsers.map((u) => {
                  const isCurrent = (currentUser?.username || '').toLowerCase() === (u.username || '').toLowerCase();
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5d205c] to-[#7a2b79] text-white flex items-center justify-center font-bold text-sm shadow-sm border border-purple-300/40">
                            {(u.name || u.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{u.username}</span>
                              {isCurrent && (
                                <span className="bg-[#5d205c]/20 text-[#5d205c] border border-purple-300/50 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                  TÚ
                                </span>
                              )}
                            </div>
                            <span className="text-slate-500 text-xs">{u.name}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {getRoleBadge(u.role)}
                      </td>

                      <td className="py-4 px-4">
                        {isAdmin ? (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={isCurrent}
                            title={isCurrent ? "No puedes desactivar tu propia cuenta activa" : "Cambiar estado"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              isCurrent ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-105'
                            } ${
                              u.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.isActive ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Activo</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 text-rose-600" />
                                <span>Inactivo</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              u.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {u.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-PY') : 'Reciente'}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* BOTON RESTABLECER CONTRASEÑA */}
                          {isAdmin ? (
                            <button
                              onClick={() => handleOpenAdminResetModal(u)}
                              title={`Restablecer contraseña de ${u.username}`}
                              className="p-2 text-slate-500 hover:text-[#5d205c] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Key className="w-4 h-4 text-[#5d205c]" />
                            </button>
                          ) : isCurrent ? (
                            <button
                              onClick={() => setIsSelfPasswordModalOpen(true)}
                              title="Cambiar mi contraseña"
                              className="p-2 text-slate-500 hover:text-[#5d205c] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Key className="w-4 h-4 text-[#5d205c]" />
                            </button>
                          ) : null}

                          {/* BOTON EDITAR (SOLO ADMIN) */}
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              title="Editar usuario"
                              className="p-2 text-slate-500 hover:text-[#5d205c] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* BOTON ELIMINAR (SOLO ADMIN) */}
                          {isAdmin && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              disabled={isCurrent}
                              title={isCurrent ? "No puedes eliminar tu propia cuenta en sesión" : "Eliminar usuario"}
                              className={`p-2 rounded-xl transition-colors ${
                                isCurrent
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {!isAdmin && !isCurrent && (
                            <span className="text-slate-400 text-[11px] italic">Solo lectura</span>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: CREAR / EDITAR USUARIO */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleUp">
            
            <div className="p-6 bg-gradient-to-r from-[#3D1347] to-[#2A0B33] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5d205c]/40 border border-purple-400/40 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    {selectedUser ? `Editar Usuario: ${selectedUser.username}` : 'Crear Nuevo Usuario'}
                  </h3>
                  <span className="text-xs text-purple-200/80">
                    {selectedUser ? 'Modifica los permisos o datos' : 'Completa los datos de acceso'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              
              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* USERNAME */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre de Usuario (Login) *
                </label>
                <input
                  type="text"
                  disabled={Boolean(selectedUser)}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/\s+/g, '') })}
                  placeholder="ej: recepcion_luxsur"
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5d205c]/20 ${
                    selectedUser ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300'
                  }`}
                />
                {!selectedUser && (
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Solo letras, números y guiones bajos (sin espacios).
                  </span>
                )}
              </div>

              {/* NOMBRE COMPLETO */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo / Cargo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: María González (Recepción Turno Mañana)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5d205c]/20 bg-white"
                />
              </div>

              {/* PASSWORD (SI ES CREACIÓN) */}
              {!selectedUser && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contraseña Inicial *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5d205c]/20 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* ROL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rol de Permisos *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5d205c]/20 bg-white"
                >
                  <option value="admin">Administrador (Acceso total)</option>
                  <option value="recepcion">Recepción (Acceso a reservas e info)</option>
                  <option value="editor">Editor (Modificar contenidos y catálogo)</option>
                </select>
              </div>

              {/* ESTADO */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Cuenta Habilitada</span>
                  <span className="text-[11px] text-slate-400">Si está inactiva, el usuario no podrá iniciar sesión.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5d205c]"></div>
                </label>
              </div>

              {/* BOTONES */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : selectedUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESTABLECER CONTRASEÑA POR ADMINISTRADOR */}
      {isAdminResetModalOpen && selectedUser && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleUp">
            
            <div className="p-6 bg-gradient-to-r from-[#3D1347] to-[#2A0B33] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5d205c]/40 border border-purple-400/40 flex items-center justify-center">
                  <Key className="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base">
                    Restablecer Contraseña
                  </h3>
                  <span className="text-xs text-purple-200/80">
                    Usuario: <strong className="text-white">{selectedUser.username}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAdminResetModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdminReset} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nueva Contraseña para el Usuario *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminResetFormData.newPassword}
                    onChange={(e) => setAdminResetFormData({ ...adminResetFormData, newPassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5d205c]/20 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirmar Nueva Contraseña *
                </label>
                <input
                  type="password"
                  value={adminResetFormData.confirmNewPassword}
                  onChange={(e) => setAdminResetFormData({ ...adminResetFormData, confirmNewPassword: e.target.value })}
                  placeholder="Repite la nueva contraseña"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5d205c]/20 bg-white"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-[#5d205c] flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#5d205c] shrink-0 mt-0.5" />
                <span>
                  Como administrador, puedes asignar una nueva contraseña directa. Será encriptada de forma segura antes de persistir.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdminResetModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Asignar Contraseña'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: CAMBIAR MI PROPIA CONTRASEÑA */}
      <ChangePasswordModal
        isOpen={isSelfPasswordModalOpen}
        onClose={() => setIsSelfPasswordModalOpen(false)}
        username={currentUser?.username}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title={`¿Eliminar usuario "${userToDelete?.username}"?`}
        message={`Esta acción eliminará permanentemente la cuenta de ${userToDelete?.name}. Ya no podrá iniciar sesión en el panel.`}
        confirmText="Sí, Eliminar Usuario"
        cancelText="Cancelar"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setUserToDelete(null)}
      />

    </div>
  );
}
