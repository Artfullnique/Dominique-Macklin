
import React, { useRef } from 'react';
import { Icon } from './Icon';

interface ImageUploaderProps {
  imagePreviewUrl: string | null;
  setImageFile: (file: File | null) => void;
  setImagePreviewUrl: (url: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreviewUrl, setImageFile, setImagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      
      {!imagePreviewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative block w-full border-2 border-dashed border-slate-600 rounded-lg p-12 text-center hover:border-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-slate-900 cursor-pointer transition-colors"
        >
          <Icon name="upload" className="mx-auto h-12 w-12 text-slate-500" />
          <span className="mt-2 block text-sm font-medium text-slate-400">
            Click to upload an image
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            PNG, JPG, WEBP
          </span>
        </div>
      ) : (
        <div className="relative group">
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-auto object-cover rounded-lg shadow-lg" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
