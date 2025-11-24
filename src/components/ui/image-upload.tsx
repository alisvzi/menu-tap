"use client";

import { useState, useRef } from "react";
import { uploadFiles, deleteFiles } from "@/utility/uploads";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Plus,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/utility/utils";

export interface UploadedImage {
  url: string;
  name: string;
  size: number;
  type: string;
}

interface ImageUploadProps {
  value?: UploadedImage[];
  onChange?: (images: UploadedImage[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  folder?: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  variant?: "grid" | "single" | "gallery";
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5,
  folder = "general",
  accept = "image/*",
  className,
  disabled = false,
  showPreview = true,
  variant = "grid",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    // Validate file count
    if (value.length + selectedFiles.length > maxFiles) {
      alert(`حداکثر ${maxFiles} تصویر مجاز است`);
      return;
    }

    // Validate file size and type
    for (const file of selectedFiles) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`حجم فایل ${file.name} بیش از ${maxSize}MB است`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert(`فایل ${file.name} یک تصویر نیست`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const uploaded = await uploadFiles(selectedFiles, folder);
      setUploadProgress(100);

      const newImages: UploadedImage[] = uploaded.map((file) => ({
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      onChange?.([...value, ...newImages]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("خطا در آپلود تصاویر");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = async (index: number) => {
    const img = value[index];
    if (img?.url) {
      try {
        await deleteFiles([img.url]);
      } catch (e) {
        console.error("Blob delete failed", e);
      }
    }
    const newImages = value.filter((_, i) => i !== index);
    onChange?.(newImages);
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (variant === "single") {
    return (
      <div className={cn("space-y-4", className)}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {value.length > 0 ? (
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={value[0].url}
                    alt={value[0].name}
                    fill
                    className="object-cover"
                  />
                  {!disabled && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(0)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                برای آپلود تصویر کلیک کنید یا فایل را اینجا بکشید
              </p>
              <p className="text-xs text-muted-foreground">
                حداکثر {maxSize}MB - فرمت‌های مجاز: JPG, PNG, WebP
              </p>
            </CardContent>
          </Card>
        )}

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-muted-foreground text-center">
              در حال آپلود...
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      {value.length < maxFiles && (
        <Card
          className={cn(
            "border-2 border-dashed cursor-pointer transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            )}
            <p className="text-sm text-muted-foreground mb-1">
              {isUploading ? "در حال آپلود..." : "برای آپلود تصاویر کلیک کنید"}
            </p>
            <p className="text-xs text-muted-foreground">
              حداکثر {maxFiles} تصویر، هر کدام تا {maxSize}MB
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      {isUploading && <Progress value={uploadProgress} className="w-full" />}

      {/* Image Grid */}
      {showPreview && value.length > 0 && (
        <div
          className={cn(
            "grid gap-4",
            variant === "gallery"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {value.map((image, index) => (
            <Card key={index} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {!disabled && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {image.name}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {formatFileSize(image.size)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Count */}
      {value.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {value.length} از {maxFiles} تصویر
          </span>
          {value.length >= maxFiles && (
            <Badge variant="outline">حداکثر تعداد</Badge>
          )}
        </div>
      )}
    </div>
  );
}
