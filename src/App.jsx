import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './admin/pages/LoginPage';
import ProtectedRoute from './admin/routes/ProtectedRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import RoomsAdminPage from './admin/pages/RoomsAdminPage';
import RoomEditorPage from './admin/pages/RoomEditorPage';
import SettingsAdminPage from './admin/pages/SettingsAdminPage';
import ContentAdminPage from './admin/pages/ContentAdminPage';
import ReviewsAdminPage from './admin/pages/ReviewsAdminPage';
import UsersAdminPage from './admin/pages/UsersAdminPage';
import CategoriesAdminPage from './admin/pages/CategoriesAdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA DE LA LANDING */}
        <Route path="/" element={<LandingPage />} />

        {/* LOGIN DE ADMINISTRACIÓN */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* PANEL DE ADMINISTRACIÓN (RUTAS PROTEGIDAS CON SESIÓN) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="rooms" element={<RoomsAdminPage />} />
            <Route path="rooms/new" element={<RoomEditorPage />} />
            <Route path="rooms/edit/:id" element={<RoomEditorPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="settings" element={<SettingsAdminPage />} />
            <Route path="content" element={<ContentAdminPage />} />
            <Route path="reviews" element={<ReviewsAdminPage />} />
            <Route path="users" element={<UsersAdminPage />} />
          </Route>
        </Route>

        {/* REDIRECCIÓN 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
