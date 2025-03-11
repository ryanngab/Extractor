"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Tambahkan interface untuk memperluas HTMLInputElement
interface CustomInputElement extends HTMLInputElement {
  webkitdirectory: boolean;
  directory: boolean;
}

// Tambahkan interface untuk FileSystem API
interface FileSystemEntryWithFile extends FileSystemEntry {
  file(callback: (file: File) => void): void;
}

const CbzExtractor = () => {
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filesList, setFilesList] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const fileInputRef = useRef<CustomInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState<
    Array<{
      name: string;
      data: Blob;
      compressed: Blob;
    }>
  >([]);
  const [compressMode, setCompressMode] = useState(true);
  const personalFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.webkitdirectory = true;
      fileInputRef.current.directory = true;
    }
  }, []);

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

      if (fileInputRef.current) {
        fileInputRef.current.webkitdirectory = true;
        fileInputRef.current.directory = true;
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
      const extractPromises = Object.keys(contents.files).map(
        async (filename) => {
          const fileData = await contents.files[filename].async("blob");
          extractFolder.file(filename, fileData);
        }
      );

      await Promise.all(extractPromises);
      const extractedZip = await extractFolder.generateAsync({ type: "blob" });
      const extractedData = await extractFolder.generateAsync({ type: "blob" });

      setExtractedFiles((prev) => [
        ...prev,
        {
          name: file.name.replace(".cbz", ""),
          data: extractedData,
          compressed: extractedZip,
        },
      ]);

      setProgress(Math.round(((index + 1) / totalFiles) * 100));
    } catch (error) {
      console.error(`Gagal mengekstrak ${file.name}:`, error);
    }
  };

  const handleDownloadSingle = (index: number) => {
    const file = extractedFiles[index];
    if (compressMode) {
      saveAs(file.compressed, `${file.name}_extracted.zip`);
    } else {
      saveAs(file.data, `${file.name}_extracted`);
    }
  };

  const handleDownloadAll = () => {
    extractedFiles.forEach((file) => {
      if (compressMode) {
        saveAs(file.compressed, `${file.name}_extracted.zip`);
      } else {
        saveAs(file.data, `${file.name}_extracted`);
      }
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  // Tambahkan fungsi untuk membaca file dari folder secara rekursif
  const getAllFilesFromDirectory = async (
    entry: FileSystemEntry
  ): Promise<File[]> => {
    const files: File[] = [];

    if (entry.isFile) {
      const fileEntry = entry as FileSystemEntryWithFile;
      return new Promise((resolve) => {
        fileEntry.file((file: File) => {
          if (file.name.toLowerCase().endsWith(".cbz")) {
            files.push(file);
          }
          resolve(files);
        });
      });
    } else if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      const entries = await new Promise<FileSystemEntry[]>((resolve) => {
        dirReader.readEntries((entries) => resolve(entries));
      });

      const subFiles = await Promise.all(
        entries.map((entry) => getAllFilesFromDirectory(entry))
      );

      return files.concat(...subFiles);
    }

    return files;
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    try {
      const items = Array.from(event.dataTransfer.items);
      const filePromises = items.map(async (item) => {
        const entry = item.webkitGetAsEntry();
        if (!entry) return [];

        if (entry.isFile) {
          const fileEntry = entry as FileSystemEntryWithFile;
          return new Promise<File[]>((resolve) => {
            fileEntry.file((file: File) => {
              if (file.name.toLowerCase().endsWith(".cbz")) {
                resolve([file]);
              } else {
                resolve([]);
              }
            });
          });
        } else if (entry.isDirectory) {
          return getAllFilesFromDirectory(entry);
        }
        return [];
      });

      const fileArrays = await Promise.all(filePromises);
      const files = fileArrays.flat();

      if (files.length > 0) {
        processFiles(files);
      } else {
        alert("Tidak ada file CBZ yang ditemukan dalam folder.");
      }
    } catch (error) {
      console.error("Error reading dropped files:", error);
      alert("Terjadi kesalahan saat membaca file yang di-drop");
    }
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setExtracting(true);
      setFilesList([]);
      setProgress(0);
      setCompleted(false);
      setExtractedFiles([]); // Reset extracted files

      // Fungsi rekursif untuk mencari file CBZ dalam folder
      const findCbzFiles = (items: FileList | File[]): File[] => {
        const cbzFiles: File[] = [];

        Array.from(items).forEach((item: any) => {
          if (item.webkitGetAsEntry) {
            const entry = item.webkitGetAsEntry();
            if (entry?.isDirectory) {
              // Jika folder, baca kontennya secara rekursif
              entry.createReader().readEntries((entries: any[]) => {
                entries.forEach((entry) => {
                  if (
                    entry.isFile &&
                    entry.name.toLowerCase().endsWith(".cbz")
                  ) {
                    entry.file((file: File) => cbzFiles.push(file));
                  }
                });
              });
            }
          }

          // Cek file langsung
          if (
            item instanceof File &&
            item.name.toLowerCase().endsWith(".cbz")
          ) {
            cbzFiles.push(item);
          }
        });

        return cbzFiles;
      };

      const cbzFiles = findCbzFiles(files);

      if (cbzFiles.length === 0) {
        alert("Tidak ada file CBZ yang ditemukan.");
        setExtracting(false);
        return;
      }

      // Proses setiap file CBZ
      for (let i = 0; i < cbzFiles.length; i++) {
        await extractCbzFile(cbzFiles[i], i, cbzFiles.length);
      }

      setCompleted(true);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengekstrak file");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div
      ref={dropRef}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
        handleDrop(e);
      }}
    >
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
          <CardTitle className="text-xl font-bold">CBZ Extractor</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Input File untuk Folder */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pilih Folder:</label>
            <Input
              ref={fileInputRef as any}
              type="file"
              multiple
              accept=".cbz"
              onChange={handleFileUpload}
              disabled={extracting}
              className="mb-4"
            />
          </div>

          {/* Input File untuk File Personal */}
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Pilih File CBZ:</label>
            <Input
              ref={personalFileInputRef}
              type="file"
              multiple
              accept=".cbz"
              onChange={handleFileUpload}
              disabled={extracting}
              className="mb-4"
            />
          </div>

          {/* Drag & Drop Area dengan style yang lebih menarik */}
          <div
            // ref={dropRef}
            // onDragOver={(e) => {
            //   e.preventDefault();
            //   e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
            // }}
            // onDragLeave={(e) => {
            //   e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
            // }}
            // onDrop={(e) => {
            //   e.preventDefault();
            //   e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
            //   handleDrop(e);
            // }}
            className="border-dashed border-2 border-gray-400 p-6 mt-4 text-center cursor-pointer bg-gray-100 rounded-lg transition-colors duration-200 hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="space-y-2">
              <p className="text-gray-600">
                Seret & Lepaskan file CBZ atau folder di sini
              </p>
              <p className="text-sm text-gray-500">
                Mendukung file CBZ tunggal atau folder berisi file CBZ
              </p>
            </div>
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

          {/* Progress Bar */}
          {extracting && (
            <div className="mt-4">
              <Progress value={progress} />
              <p className="text-gray-500 text-sm mt-2">{progress}% selesai</p>
            </div>
          )}

          {/* Daftar File yang Sedang Diproses */}
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
                {" "}
                {/* Tambahkan container dengan scroll */}
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

          {/* Status Selesai */}
          {completed && !extracting && (
            <p className="text-green-600 font-semibold mt-4">
              Semua file berhasil diekstrak!
            </p>
          )}

          {/* Tombol Reset */}
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
