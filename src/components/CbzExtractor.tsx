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
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [extractedFiles, setExtractedFiles] = useState<
    { name: string; data: Blob; compressed: Blob }[]
  >([]);
  const [compressMode, setCompressMode] = useState(true);

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
        {
          name: file.name.replace(".cbz", ""),
          data: extractedZip,
          compressed: extractedZip,
        },
      ]);
      setProgress(Math.round(((index + 1) / totalFiles) * 100));
    } catch (error) {
      console.error(`Gagal mengekstrak ${file.name}:`, error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.name.toLowerCase().endsWith(".cbz")
    );
    processFiles(files);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.name.toLowerCase().endsWith(".cbz")
    );
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
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

  return (
    <Card className="w-full max-w-lg mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">CBZ Extractor</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tombol Upload File */}
        <Button
          className="w-full mb-2"
          onClick={() => filePickerRef.current?.click()}
        >
          Upload File
        </Button>
        <input
          ref={filePickerRef}
          type="file"
          multiple
          accept=".cbz"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Drag & Drop Area */}
        <div
          ref={dropRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-dashed border-2 border-gray-400 p-4 mt-4 text-center cursor-pointer bg-gray-100 rounded-lg"
        >
          <p className="text-gray-600">Seret & Lepaskan file CBZ di sini</p>
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
            <ul className="list-disc pl-4 text-sm text-gray-600">
              {extractedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <span className="break-all pr-2">{file.name}</span>
                  <Button
                    size="sm"
                    onClick={() =>
                      saveAs(file.compressed, `${file.name}_extracted.zip`)
                    }
                    className="ml-2 shrink-0"
                  >
                    Download
                  </Button>
                </li>
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
      </CardContent>
    </Card>
  );
};

export default CbzExtractor;
