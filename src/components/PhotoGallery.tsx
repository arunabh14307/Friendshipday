import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Maximize2, X, Plus, Heart } from 'lucide-react';
import type { PhotoItem } from '../types';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  onAddPhoto: (photo: PhotoItem) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onAddPhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const newPhoto: PhotoItem = {
          id: Date.now().toString(),
          caption: "New Friendship Snapshot 📸",
          photoUrl: result,
          date: "Aug 2026",
          rotateDeg: (Math.random() - 0.5) * 6
        };
        onAddPhoto(newPhoto);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="gallery" className="py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-1.5 rounded-full border-white/20 text-xs font-bold text-[#FF6FB5]">
            <Image className="w-4 h-4" />
            <span>Polaroid Scrapbook</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
            Photo <span className="text-gradient-primary">Gallery</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Captured moments, unfiltered laughs, and spontaneous snapshot memories.
          </p>
        </div>

        {/* Polaroid Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
              style={{ rotate: `${photo.rotateDeg}deg` }}
              className="bg-white/90 text-slate-800 p-4 rounded-xl shadow-2xl transition-all duration-300 cursor-pointer relative group border-4 border-white/80"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Tape Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-200/60 backdrop-blur-sm rounded-sm rotate-2 shadow-sm border border-amber-300/40 pointer-events-none" />

              {/* Photo Image Frame */}
              <div className="relative overflow-hidden rounded-lg aspect-square bg-slate-100">
                <img
                  src={photo.photoUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Hover overlay icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Polaroid Caption & Date */}
              <div className="pt-4 text-center space-y-1">
                <p className="font-quote text-base sm:text-lg text-slate-800 font-bold leading-tight">
                  {photo.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1 border-t border-slate-200">
                  <span>{photo.date}</span>
                  <Heart className="w-3 h-3 text-[#FF6FB5] fill-current" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="text-center pt-4">
          <label className="btn-secondary px-6 py-3 rounded-full text-xs font-bold inline-flex items-center space-x-2 cursor-pointer shadow-lg">
            <Plus className="w-4 h-4 text-[#FFD166]" />
            <span>Upload New Polaroid Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Lightbox Modal Preview */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-2xl max-w-2xl w-full text-slate-900 shadow-2xl relative space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="rounded-xl overflow-hidden max-h-[70vh]">
                <img
                  src={selectedPhoto.photoUrl}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center space-y-1">
                <p className="font-quote text-2xl text-slate-800 font-bold">
                  {selectedPhoto.caption}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Memory Date: {selectedPhoto.date}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
