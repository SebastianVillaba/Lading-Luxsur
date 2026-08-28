// Cliente de API para LuxSur Hotel Boutique

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('luxsur_admin_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('luxsur_admin_token', token);
  } else {
    localStorage.removeItem('luxsur_admin_token');
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  // Si no es FormData, agregar Content-Type JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({ success: false, message: 'Respuesta inválida del servidor' }));

    if (!response.ok) {
      if (response.status === 401) {
        setAuthToken(null);
      }
      throw new Error(data.message || `Error en la solicitud: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Error en API (${endpoint}):`, error.message);
    throw error;
  }
}

// Servicios específicos
export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  verifySession: () => apiRequest('/auth/verify'),
  changePassword: (currentPassword, newPassword) => apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Habitaciones
  getRooms: () => apiRequest('/rooms'),
  getRoomById: (id) => apiRequest(`/rooms/${id}`),
  createRoom: (room) => apiRequest('/rooms', { method: 'POST', body: JSON.stringify(room) }),
  updateRoom: (id, room) => apiRequest(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(room) }),
  deleteRoom: (id) => apiRequest(`/rooms/${id}`, { method: 'DELETE' }),
  updateRoomsOrder: (orders) => apiRequest('/rooms/reorder', { method: 'PATCH', body: JSON.stringify({ orders }) }),

  // Categorías de Habitaciones
  getCategories: () => apiRequest('/categories'),
  getCategoryById: (id) => apiRequest(`/categories/${id}`),
  createCategory: (cat) => apiRequest('/categories', { method: 'POST', body: JSON.stringify(cat) }),
  updateCategory: (id, cat) => apiRequest(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(cat) }),
  deleteCategory: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
  updateCategoriesOrder: (orders) => apiRequest('/categories/reorder', { method: 'PATCH', body: JSON.stringify({ orders }) }),

  // Configuraciones
  getSettings: () => apiRequest('/settings'),
  updateSettings: (settings) => apiRequest('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  // Experiencias & Servicios & Rooftop & Historia
  getHistory: () => apiRequest('/content/history'),
  updateHistory: (history) => apiRequest('/content/history', { method: 'PUT', body: JSON.stringify(history) }),

  getExperiences: () => apiRequest('/content/experiences'),
  saveExperience: (exp) => apiRequest('/content/experiences', { method: 'POST', body: JSON.stringify(exp) }),
  deleteExperience: (id) => apiRequest(`/content/experiences/${id}`, { method: 'DELETE' }),

  getServices: () => apiRequest('/content/services'),
  saveService: (serv) => apiRequest('/content/services', { method: 'POST', body: JSON.stringify(serv) }),
  deleteService: (id) => apiRequest(`/content/services/${id}`, { method: 'DELETE' }),

  getRooftop: () => apiRequest('/content/rooftop'),
  updateRooftop: (rooftop) => apiRequest('/content/rooftop', { method: 'PUT', body: JSON.stringify(rooftop) }),

  // Reseñas
  getReviews: () => apiRequest('/reviews'),
  createReview: (review) => apiRequest('/reviews', { method: 'POST', body: JSON.stringify(review) }),
  updateReview: (id, review) => apiRequest(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(review) }),
  deleteReview: (id) => apiRequest(`/reviews/${id}`, { method: 'DELETE' }),

  // Gestión de Usuarios
  getUsers: () => apiRequest('/users'),
  createUser: (user) => apiRequest('/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUser: (id, user) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  toggleUserStatus: (id, isActive) => apiRequest(`/users/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
  resetUserPassword: (id, newPassword) => apiRequest(`/users/${id}/password`, { method: 'POST', body: JSON.stringify({ newPassword }) }),

  // Subida de imágenes
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiRequest('/upload/single', {
      method: 'POST',
      body: formData,
    });
  },
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    return apiRequest('/upload/multiple', {
      method: 'POST',
      body: formData,
    });
  }
};
