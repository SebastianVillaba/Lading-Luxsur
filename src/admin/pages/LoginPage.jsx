import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingrese su usuario y contraseña.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await login(username.trim(), password.trim());
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Credenciales inválidas.');
      }
    } catch (err) {
      setError('Error al intentar conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E0624] via-[#2A0B33] to-[#120317] flex items-center justify-center p-4 selection:bg-[#5d205c] selection:text-white">
      <div className="w-full max-w-md">
        
        {/* BRAND LOGO CARD */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5d205c] via-[#7a2b79] to-[#3D1347] text-white shadow-2xl mb-4 font-serif text-3xl font-bold border border-purple-400/40">
            👑
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            LuxSur Hotel Boutique
          </h1>
          <p className="text-xs text-purple-200 font-semibold tracking-widest uppercase mt-1">
            Panel de Control & CMS
          </p>
        </div>

        {/* LOGIN FORM CARD */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-slate-900">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tus credenciales autorizadas para gestionar el contenido
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5d205c] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5d205c] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-[#5d205c] to-[#7a2b79] hover:from-[#7a2b79] hover:to-[#5d205c] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-purple-400/40 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span>Acceder al Módulo de Control</span>
                  <ArrowRight className="w-4 h-4 text-purple-200" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Acceso Seguro y Encriptado</span>
            </span>
            <a
              href="/"
              className="text-[#3D1347] font-semibold hover:underline"
            >
              Volver a la Web
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
