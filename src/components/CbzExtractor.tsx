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

const CbzExtractor = () => {
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filesList, setFilesList] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const fileInputRef = useRef<CustomInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [extractedFiles, setExtractedFiles] = useState<
    Array<{
      name: string;
      data: Blob;
      compressed: Blob;
    }>
  >([]);
  const [compressMode, setCompressMode] = useState(true);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.webkitdirectory = true;
      fileInputRef.current.directory = true;
    }
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

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
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
    <Card className="w-full max-w-lg mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">CBZ Extractor</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Input File */}
        <Input
          ref={fileInputRef as any}
          type="file"
          multiple
          accept=".cbz"
          onChange={handleFileUpload}
          disabled={extracting}
        />

        {/* Drag & Drop Area */}
        <div
          ref={dropRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-dashed border-2 border-gray-400 p-4 mt-4 text-center cursor-pointer bg-gray-100 rounded-lg"
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

        {/* Progress Bar */}
        {extracting && (
          <div className="mt-4">
            <Progress value={progress} />
            <p className="text-gray-500 text-sm mt-2">{progress}% selesai</p>
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
  );
};

export default CbzExtractor;
