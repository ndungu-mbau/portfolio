/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { UploadDropzone } from "~/lib/uploadthing";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { Upload, X, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  key: string;
}

export function ImageUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const copyToClipboard = (url: string) => {
    void navigator.clipboard.writeText(url);
    toast.success("Copied!", {
      description: "Image URL copied to clipboard",
    });
  };

  const removeFile = (key: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.key !== key));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + "" + sizes[i]
    );
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-neutral-700 bg-neutral-800/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                const newFiles = res.map((file) => ({
                  url: file.ufsUrl,
                  name: file.name,
                  size: file.size,
                  key: file.key,
                }));
                setUploadedFiles((prev) => [...prev, ...newFiles]);
                setIsUploading(false);
                setUploadProgress(0);
                toast.success("Upload Complete!", {
                  description: `${res.length} file(s) uploaded successfully`,
                });
              }
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              setUploadProgress(0);
              toast.error("Upload Failed", {
                description: error.message,
              });
            }}
            onUploadBegin={() => {
              setIsUploading(true);
              setUploadProgress(0);
            }}
            onUploadProgress={(progress) => {
              setUploadProgress(progress);
            }}
            appearance={{
              container: "border-none bg-transparent",
              uploadIcon: "text-neutral-500",
              label: "text-neutral-800 text-lg font-medium",
              allowedContent: "text-neutral-500 text-sm",
              button:
                "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors ut-ready:bg-neutral-100 ut-uploading:cursor-not-allowed ut-uploading:bg-neutral-600",
            }}
            content={{
              uploadIcon: () => (
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-neutral-600 to-neutral-500 opacity-20 blur-lg"></div>
                    <div className="relative rounded-full bg-neutral-700 p-4">
                      <Upload className="h-8 w-8 text-neutral-800" />
                    </div>
                  </div>
                </div>
              ),
              label: () => (
                <div className="text-center">
                  <p className="mb-2 text-lg font-semibold text-neutral-200">
                    Drop your images here, or click to browse
                  </p>
                  <p className="text-sm text-neutral-500">
                    Supports: JPG, PNG, GIF, WebP (Max 4MB)
                  </p>
                </div>
              ),
            }}
          />

          {isUploading && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-100">
              Uploaded Images ({uploadedFiles.length})
            </h3>
            <Badge
              variant="secondary"
              className="border-neutral-600 bg-neutral-700 text-neutral-200"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Ready to use
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {uploadedFiles.map((file) => (
              <Card
                key={file.key}
                className="group overflow-hidden border-neutral-700 bg-neutral-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/20"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt={file.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-red-700"
                    onClick={() => removeFile(file.key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="space-y-3 p-4">
                  <div className="space-y-1">
                    <h4 className="truncate font-medium text-neutral-100">
                      {file.name}
                    </h4>
                    <p className="text-sm text-neutral-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-neutral-600 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-neutral-100"
                      onClick={() => copyToClipboard(file.url)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy URL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-600 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-neutral-100"
                      asChild
                    >
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>

                  <div className="rounded border border-neutral-700 bg-neutral-900 p-2 font-mono text-xs break-all text-neutral-400 dark:border-neutral-800">
                    {file.url}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
