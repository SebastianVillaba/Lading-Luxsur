import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Plus, Trash2, Star, Link as LinkIcon, AlertCircle, Check } from 'lucide-react';
import { api } from '../../services/api';

export default function ImageUploader({
  mainImage,
  gallery = [],
  onMainImageChange,
  onGalleryChange
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlTarget, setUrlTarget] = useState('main'); // 'main' | 'gallery'
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const singleInputRef = useRef(null);
  const multiInputRef = useRef(null);

  const handleSingleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        onMainImageChange(res.url);
        setUploadSuccess('Foto de portada actualizada');
        setTimeout(() => setUploadSuccess(''), 3000);
      } else {
        setUploadError(res.message || 'Error al subir la imagen');
      }
    } catch (err) {
      setUploadError(err.message || 'Error de conexión al subir la imagen');
    } finally {
      setIsUploading(false);
      if (singleInputRef.current) singleInputRef.current.value = '';
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const res = await api.uploadMultipleImages(files);
      if (res.success && Array.isArray(res.urls)) {
        onGalleryChange([...gallery, ...res.urls]);
        setUploadSuccess(`${res.urls.length} fotos añadidas a la galería`);
        setTimeout(() => setUploadSuccess(''), 3000);
      } else {
        setUploadError(res.message || 'Error al subir las imágenes');
      }
    } catch (err) {
      setUploadError(err.message || 'Error de conexión al subir las imágenes');
    } finally {
      setIsUploading(false);
      if (multiInputRef.current) multiInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (urlTarget === 'main') {
      onMainImageChange(urlInput.trim());
    } else {
      onGalleryChange([...gallery, urlInput.trim()]);
    }
    setUrlInput('');
    setShowUrlModal(false);
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    const newGallery = gallery.filter((_, idx) => idx !== indexToRemove);
    onGalleryChange(newGallery);
  };

  const handleSetAsMain = (imageUrl, index) => {
    // Si la imagen seleccionada pasa a ser la portada, colocamos la portada anterior en la galería
    const oldMain = mainImage;
    const newGallery = gallery.filter((_, idx) => idx !== index);
    if (oldMain && !newGallery.includes(oldMain)) {
      newGallery.push(oldMain);
    }
    onMainImageChange(imageUrl);
    onGalleryChange(newGallery);
  };

  return (
    <div className="space-y-6">
      {/* MENSAJES DE ESTADO */}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* SECCIÓN 1: FOTO DE PORTADA / PRINCIPAL */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#5e265e] fill-[#5e265e]" />
            <span>Foto Principal / Portada</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUrlTarget('main');
                setShowUrlModal(true);
              }}
              className="text-xs text-slate-500 hover:text-[#5e265e] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Usar URL</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* PREVIEW PORTADA */}
          <div className="md:col-span-5 relative group rounded-2xl overflow-hidden border-2 border-slate-200 aspect-video bg-slate-100 flex items-center justify-center">
            {mainImage ? (
              <>
                <img
                  src={mainImage}
                  alt="Portada Habitación"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => singleInputRef.current?.click()}
                    className="p-2 bg-white text-slate-900 rounded-xl font-medium text-xs shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Cambiar
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-4 text-slate-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Sin foto de portada</p>
              </div>
            )}
          </div>

          {/* DROPZONE BOTÓN */}
          <div className="md:col-span-7">
            <input
              type="file"
              ref={singleInputRef}
              onChange={handleSingleUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => singleInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center h-full min-h-[140px] ${
                isUploading
                  ? 'border-purple-400 bg-purple-50/50 pointer-events-none'
                  : 'border-slate-300 hover:border-[#5e265e] hover:bg-slate-50'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {isUploading ? 'Subiendo imagen...' : 'Haz clic para subir foto de portada'}
              </p>
              <p className="text-xs text-slate-400">
                Formatos recomendados: JPG, PNG o WebP (Hasta 10MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: GALERÍA DE FOTOS ADICIONALES */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Galería de Fotos Adicionales ({gallery.length})
            </label>
            <span className="text-xs text-slate-400">
              Estas imágenes se mostrarán en el carrusel modal de detalles.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUrlTarget('gallery');
                setShowUrlModal(true);
              }}
              className="text-xs text-slate-500 hover:text-[#5e265e] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Pegar URL</span>
            </button>
            <button
              type="button"
              onClick={() => multiInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5e265e] hover:bg-[#8d398d] text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Subir Fotos</span>
            </button>
          </div>
        </div>

        <input
          type="file"
          ref={multiInputRef}
          onChange={handleGalleryUpload}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* LISTADO DE MINIATURAS */}
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-sm"
              >
                <img
                  src={imgUrl}
                  alt={`Galería ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* OVERLAY DE ACCIONES */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => handleSetAsMain(imgUrl, idx)}
                    title="Definir como foto de portada"
                    className="p-1.5 bg-[#5e265e] text-white rounded-lg hover:bg-[#8d398d] transition-colors cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    title="Eliminar de la galería"
                    className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs">
            Aún no has agregado fotos adicionales para esta habitación.
          </div>
        )}
      </div>

      {/* MODAL INGRESO DE URL DIRECTA */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Ingresar URL de Imagen ({urlTarget === 'main' ? 'Portada' : 'Galería'})
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Pega un enlace directo a una imagen pública en internet (JPG, PNG, WebP o Unsplash).
            </p>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e265e] mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2 text-xs font-bold text-white bg-[#5e265e] hover:bg-[#8d398d] rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Agregar Imagen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
