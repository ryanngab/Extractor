"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ExtractedFile {
  name: string;
  compressed: Blob;
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & {
    files: FileList;
  };
}

interface WebkitDirectoryHTMLInputElement extends HTMLInputElement {
  webkitdirectory: boolean;
  directory: boolean;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: string;
  directory?: string;
}

const CbzExtractor = () => {
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filesList, setFilesList] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [compressMode, setCompressMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Tambahkan ref untuk input file
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const personalFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      if (!event.dataTransfer) return;

      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        processFiles(files);
      } else {
        alert("Tidak ada file yang dapat diproses.");
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const processFiles = async (files: File[]) => {
    setExtracting(true);
    setFilesList([]);
    setProgress(0);
    setCompleted(false);
    setExtractedFiles([]);

    for (let i = 0; i < files.length; i++) {
      await extractCbzFile(files[i], i, files.length);
    }

    setCompleted(true);
    setExtracting(false);
  };

  const extractCbzFile = async (
    file: File,
    index: number,
    totalFiles: number
  ) => {
    try {
      setFilesList((prev) => [...prev, file.name]);
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);

      const extractFolder = new JSZip();
      await Promise.all(
        Object.keys(contents.files).map(async (filename) => {
          const fileData = await contents.files[filename].async("blob");
          extractFolder.file(filename, fileData);
        })
      );

      const extractedZip = await extractFolder.generateAsync({ type: "blob" });
      setExtractedFiles((prev) => [
        ...prev,
        { name: file.name.replace(".cbz", ""), compressed: extractedZip },
      ]);
      setProgress(Math.round(((index + 1) / totalFiles) * 100));
    } catch (error) {
      console.error(`Gagal mengekstrak ${file.name}:`, error);
    }
  };

  // Tambahkan fungsi download
  const handleDownloadSingle = (index: number) => {
    const file = extractedFiles[index];
    if (compressMode) {
      saveAs(file.compressed, `${file.name}_extracted.zip`);
    } else {
      saveAs(file.compressed, `${file.name}_extracted`);
    }
  };

  const handleDownloadAll = () => {
    extractedFiles.forEach((file) => {
      if (compressMode) {
        saveAs(file.compressed, `${file.name}_extracted.zip`);
      } else {
        saveAs(file.compressed, `${file.name}_extracted`);
      }
    });
  };

  return (
    <div>
      {isDragging && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <svg
              className="mx-auto h-12 w-12 text-blue-500 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8"
              />
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-900">
              Lepaskan file untuk mengupload
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Seret dan lepaskan file atau folder di sini
            </p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-lg mx-auto p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">File Extractor</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Input File untuk Folder */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih Folder:</label>
            <input
              {...({
                ref: fileInputRef,
                type: "file",
                webkitdirectory: true,
                directory: true,
                multiple: true,
                onChange: (e) => {
                  const files = Array.from(e.target.files || []);
                  processFiles(files);
                },
                disabled: extracting,
                className:
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              } as React.InputHTMLAttributes<WebkitDirectoryHTMLInputElement>)}
            />
          </div>

          {/* Input File untuk File Personal */}
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Pilih File:</label>
            <Input
              ref={personalFileInputRef}
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                processFiles(files);
              }}
              disabled={extracting}
              className="mb-4"
            />
          </div>

          {/* Area Drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (!e.dataTransfer) return;
              const files = Array.from(e.dataTransfer.files);
              processFiles(files);
            }}
            className="border-dashed border-2 p-6 mt-4 text-center cursor-pointer rounded-lg transition-all duration-200 border-gray-400 bg-gray-100 hover:border-blue-500 hover:bg-blue-50"
          >
            <p className="text-gray-600">
              Seret & Lepaskan file atau folder di sini
            </p>
          </div>

          {/* Opsi Kompresi */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="compressMode"
              checked={compressMode}
              onChange={(e) => setCompressMode(e.target.checked)}
            />
            <label htmlFor="compressMode">Download sebagai file ZIP</label>
          </div>

          {/* Progress dan Status */}
          {extracting && (
            <div className="mt-4">
              <Progress value={progress} />
              <p className="text-gray-500 text-sm mt-2">{progress}% selesai</p>
            </div>
          )}

          {/* Daftar File yang Diproses */}
          {filesList.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">File yang sedang diproses:</p>
              <ul className="list-disc pl-4 text-sm text-gray-600">
                {filesList.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Daftar File yang Sudah Diekstrak */}
          {extractedFiles.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">File yang sudah diekstrak:</p>
              <div className="max-h-60 overflow-y-auto">
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  {extractedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="break-all pr-2">{file.name}</span>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadSingle(index)}
                        className="ml-2 shrink-0"
                      >
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              {extractedFiles.length > 1 && (
                <Button className="mt-4 w-full" onClick={handleDownloadAll}>
                  Download Semua
                </Button>
              )}
            </div>
          )}

          {completed && !extracting && (
            <p className="text-green-600 font-semibold mt-4">
              Semua file berhasil diekstrak!
            </p>
          )}

          <Button
            className="mt-4 w-full"
            onClick={() => window.location.reload()}
            disabled={extracting}
          >
            Reset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CbzExtractor;
