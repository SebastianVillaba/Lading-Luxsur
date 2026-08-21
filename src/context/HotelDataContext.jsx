import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import {
  HOTEL_INFO as DEFAULT_HOTEL_INFO,
  ROOMS_DATA as DEFAULT_ROOMS_DATA,
  EXPERIENCES_DATA as DEFAULT_EXPERIENCES_DATA,
  SERVICES_DATA as DEFAULT_SERVICES_DATA,
  ROOFTOP_RESTAURANT_INFO as DEFAULT_ROOFTOP_INFO,
  REVIEWS_DATA as DEFAULT_REVIEWS_DATA
} from '../data/hotelData';

const HotelDataContext = createContext();

const DEFAULT_CATEGORIES = [
  { id: 'estandar', name: 'Estándar', description: 'Habitaciones individuales y dobles esenciales', orderIndex: 0, isActive: true },
  { id: 'suites', name: 'Suites', description: 'Suites de alto confort y decoración boutique', orderIndex: 1, isActive: true },
  { id: 'familiar', name: 'Familiar', description: 'Alojamiento con camas múltiples para familias', orderIndex: 2, isActive: true },
  { id: 'ejecutiva', name: 'Ejecutiva', description: 'Confort diseñado para viajes de negocios', orderIndex: 3, isActive: true },
  { id: 'presidencial', name: 'Presidencial', description: 'Exclusividad y distinción máxima', orderIndex: 4, isActive: true }
];

export function HotelDataProvider({ children }) {
  const [rooms, setRooms] = useState(DEFAULT_ROOMS_DATA);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState(DEFAULT_HOTEL_INFO);
  const [experiences, setExperiences] = useState(DEFAULT_EXPERIENCES_DATA);
  const [services, setServices] = useState(DEFAULT_SERVICES_DATA);
  const [rooftop, setRooftop] = useState(DEFAULT_ROOFTOP_INFO);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState('static');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 0. Categorías
      const catRes = await api.getCategories().catch(() => null);
      if (catRes && catRes.success && Array.isArray(catRes.categories) && catRes.categories.length > 0) {
        setCategories(catRes.categories);
      }

      // 1. Habitaciones
      const roomsRes = await api.getRooms().catch(() => null);
      if (roomsRes && roomsRes.success && Array.isArray(roomsRes.rooms) && roomsRes.rooms.length > 0) {
        setRooms(roomsRes.rooms);
        setDataSource(roomsRes.source || 'dynamic');
      }

      // 2. Ajustes
      const settingsRes = await api.getSettings().catch(() => null);
      if (settingsRes && settingsRes.success && settingsRes.settings) {
        setSettings({
          ...DEFAULT_HOTEL_INFO,
          ...settingsRes.settings
        });
      }

      // 3. Experiencias
      const expRes = await api.getExperiences().catch(() => null);
      if (expRes && expRes.success && Array.isArray(expRes.experiences)) {
        setExperiences(expRes.experiences);
      }

      // 4. Servicios
      const servRes = await api.getServices().catch(() => null);
      if (servRes && servRes.success && Array.isArray(servRes.services)) {
        setServices(servRes.services);
      }

      // 5. Rooftop
      const roofRes = await api.getRooftop().catch(() => null);
      if (roofRes && roofRes.success && roofRes.rooftop) {
        setRooftop(roofRes.rooftop);
      }

      // 6. Reseñas
      const revRes = await api.getReviews().catch(() => null);
      if (revRes && revRes.success && Array.isArray(revRes.reviews)) {
        setReviews(revRes.reviews);
      }
    } catch (err) {
      console.warn('⚠️ Usando datos locales de respaldo para la landing page');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Funciones de conveniencia
  const refreshRooms = async () => {
    const res = await api.getRooms().catch(() => null);
    if (res && res.success && Array.isArray(res.rooms)) {
      setRooms(res.rooms);
    }
  };

  const refreshSettings = async () => {
    const res = await api.getSettings().catch(() => null);
    if (res && res.success && res.settings) {
      setSettings(prev => ({ ...prev, ...res.settings }));
    }
  };

  const refreshContent = async () => {
    const [exp, serv, roof] = await Promise.all([
      api.getExperiences().catch(() => null),
      api.getServices().catch(() => null),
      api.getRooftop().catch(() => null)
    ]);
    if (exp?.success) setExperiences(exp.experiences);
    if (serv?.success) setServices(serv.services);
    if (roof?.success) setRooftop(roof.rooftop);
  };

  const refreshCategories = async () => {
    const res = await api.getCategories().catch(() => null);
    if (res && res.success && Array.isArray(res.categories)) {
      setCategories(res.categories);
    }
  };

  const refreshReviews = async () => {
    const res = await api.getReviews().catch(() => null);
    if (res?.success) setReviews(res.reviews);
  };

  return (
    <HotelDataContext.Provider
      value={{
        rooms,
        activeRooms: rooms.filter(r => r.isActive !== false),
        categories: categories.filter(c => c.isActive !== false),
        allCategories: categories,
        settings,
        experiences: experiences.filter(e => e.isActive !== false),
        allExperiences: experiences,
        services: services.filter(s => s.isActive !== false),
        allServices: services,
        rooftop,
        reviews,
        isLoading,
        dataSource,
        refreshData: fetchData,
        refreshRooms,
        refreshCategories,
        refreshSettings,
        refreshContent,
        refreshReviews,
        setRooms,
        setCategories,
        setSettings
      }}
    >
      {children}
    </HotelDataContext.Provider>
  );
}

export function useHotelData() {
  const context = useContext(HotelDataContext);
  if (!context) {
    throw new Error('useHotelData debe ser usado dentro de un HotelDataProvider');
  }
  return context;
}
