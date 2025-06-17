
import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (imageData: ImageData) => void;
  onImageChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onImageChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    onImageChange(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Resize image if too large (for performance)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        
        onImageUpload(imageData);
      };
      
      img.src = e.target?.result as string;
      setUploadedImage(e.target?.result as string);
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    onImageChange(null);
  };

  return (
    <div className="w-full">
      {!uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload an Image
              </h3>
              <p className="text-muted-foreground">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
            
            <Button variant="outline" className="mt-4">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative glass-card rounded-xl overflow-hidden">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm font-medium">Image uploaded successfully</p>
            <p className="text-xs text-white/80">Colors extracted automatically</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
