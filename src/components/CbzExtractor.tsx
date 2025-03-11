"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const CbzExtractor = () => {
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filesList, setFilesList] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("webkitdirectory"); // Default tidak menggunakan webkitdirectory
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

      saveAs(extractedZip, `${file.name.replace(".cbz", "")}_extracted.zip`);

      // Update progress
      setProgress(Math.round(((index + 1) / totalFiles) * 100));
    } catch (error) {
      console.error(`Gagal mengekstrak ${file.name}:`, error);
    }
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

      // Filter hanya file CBZ
      const cbzFiles = files.filter((file) =>
        file.name.toLowerCase().endsWith(".cbz")
      );

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
          ref={fileInputRef}
          type="file"
          multiple
          accept=".cbz"
          onChange={handleFileUpload}
          disabled={extracting}
          onClick={() =>
            fileInputRef.current?.setAttribute("webkitdirectory", "")
          } // Gunakan webkitdirectory saat diklik
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
