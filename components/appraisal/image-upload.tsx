'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({ onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFilesSelect = useCallback(
    (newFiles: File[]) => {
      const availableSlots = maxImages - selectedFiles.length;
      const filesToAdd = newFiles.slice(0, availableSlots);

      if (filesToAdd.length === 0) return;

      const updatedFiles = [...selectedFiles, ...filesToAdd];
      setSelectedFiles(updatedFiles);
      onImagesChange(updatedFiles);

      const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    },
    [selectedFiles, maxImages, onImagesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      handleFilesSelect(files);
    },
    [handleFilesSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        handleFilesSelect(Array.from(files));
      }
    },
    [handleFilesSelect]
  );

  const removeImage = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previewUrls[index]);

      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      const updatedUrls = previewUrls.filter((_, i) => i !== index);

      setSelectedFiles(updatedFiles);
      setPreviewUrls(updatedUrls);
      onImagesChange(updatedFiles);
    },
    [selectedFiles, previewUrls, onImagesChange]
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upload Photos</h3>
            <span className="text-sm text-gray-500">
              {selectedFiles.length} / {maxImages} images
            </span>
          </div>

          {selectedFiles.length < maxImages && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <Camera className="h-12 w-12 text-gray-400" />
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your photos here
                  </p>
                  <p className="text-gray-600">or click to browse files</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload multiple angles for best results
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <Button type="button" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Photos
                      </span>
                    </Button>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInput}
                    className="hidden"
                    id="camera-input"
                  />
                  <label htmlFor="camera-input">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
