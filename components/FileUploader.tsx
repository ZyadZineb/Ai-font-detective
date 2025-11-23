import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';

interface FileUploaderProps {
  onFileSelected: (fileData: UploadedFile | null) => void;
  currentFile: UploadedFile | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        // Remove Data URL prefix to get pure base64
        const base64 = result.split(',')[1];
        
        onFileSelected({
            file,
            previewUrl: result,
            base64,
            mimeType: file.type
        });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  if (currentFile) {
      return (
          <div className="relative w-full h-64 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden group">
              <img src={currentFile.previewUrl} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onFileSelected(null); }}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-200 px-4 py-2 rounded-full border border-red-500/50 transition-colors"
                  >
                      Remove Image
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full h-48 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center cursor-pointer
        ${isDragging 
            ? 'border-indigo-400 bg-indigo-500/10' 
            : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
        }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center space-y-3 text-slate-400 p-4 text-center">
        <div className="p-3 bg-slate-800 rounded-full border border-slate-700">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <div>
            <span className="font-semibold text-indigo-300">Upload an image</span> 
            <span className="text-slate-500"> or drag and drop</span>
        </div>
        <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
      </div>
    </div>
  );
};
