import React, { useState, useRef } from 'react';
import { UploadCloud, Trash2, RefreshCw, Link as LinkIcon, AlertCircle, Check, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function SingleImageUploader({
  value,
  onChange,
  label = 'Foto / Imagen',
  helperText = 'Formatos recomendados: JPG, PNG o WebP (Hasta 10MB)',
  aspectRatio = 'aspect-video',
  required = false
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica de tipo
    if (!file.type.startsWith('image/')) {
      setErrorMessage('El archivo seleccionado debe ser una imagen válida.');
      return;
    }

    // Validación de tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('El tamaño de la imagen no puede superar 10MB.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        onChange(res.url);
        setSuccessMessage('Imagen subida correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(res.message || 'Error al subir la imagen.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error de conexión al subir la imagen.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
      setSuccessMessage('URL de imagen aplicada');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleRemove = () => {
    onChange('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="space-y-2">
      {/* HEADER & LABEL */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-slate-400 hover:text-[#4d1a4d] flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Ocultar URL' : 'O usar URL'}</span>
        </button>
      </div>

      {/* URL INLINE INPUT (OPCIONAL) */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="flex gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl animate-fadeIn">
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#5e265e] focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#5e265e] text-white rounded-lg text-xs font-bold hover:bg-[#8d398d] transition-colors cursor-pointer"
          >
            Aplicar
          </button>
        </form>
      )}

      {/* FEEDBACK STATUS */}
      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* INPUT FILE OCULTO */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
      />

      {/* CONTENEDOR PRINCIPAL / PREVIEW O DROPZONE */}
      {value ? (
        <div className={`relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 ${aspectRatio} shadow-xs`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cambiar Archivo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRemove}
              title="Quitar imagen"
              className="p-2 bg-rose-600 text-white rounded-xl text-xs shadow-lg hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
            isUploading
              ? 'border-purple-400 bg-purple-50/50 pointer-events-none'
              : 'border-slate-300 hover:border-[#5e265e] hover:bg-purple-50/20 bg-slate-50/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-[#4d1a4d] animate-spin mb-2" />
              <p className="text-xs font-bold text-[#4d1a4d]">Subiendo imagen al servidor...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#4d1a4d] mb-2 shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700 mb-0.5">
                Haz clic para seleccionar o arrastrar un archivo de imagen
              </p>
              <p className="text-[11px] text-slate-400">
                {helperText}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
