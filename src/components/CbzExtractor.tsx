"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const CbzExtractor = () => {
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState<string>("");

  const extractCbzFile = async (file: File) => {
    try {
      setProgress(`Mengekstrak ${file.name}...`);
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
    } catch (error) {
      console.error(`Gagal mengekstrak ${file.name}:`, error);
      setProgress(`Gagal mengekstrak ${file.name}`);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      setExtracting(true);
      setProgress(`Ditemukan ${files.length} file CBZ`);

      const cbzFiles = files.filter((file) =>
        file.name.toLowerCase().endsWith(".cbz")
      );
      if (cbzFiles.length === 0) {
        setProgress("Tidak ada file CBZ yang ditemukan dalam folder.");
        setExtracting(false);
        return;
      }

      for (const file of cbzFiles) {
        await extractCbzFile(file);
      }

      setProgress("Semua file berhasil diekstrak!");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengekstrak file");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">CBZ Folder Extractor</h2>
      <input
        type="file"
        webkitdirectory="true"
        // webkitdirectory=""

        multiple
        accept=".cbz"
        onChange={handleFileUpload}
        disabled={extracting}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {extracting && <p className="text-blue-500">{progress}</p>}
    </div>
  );
};

export default CbzExtractor;

// "use client";

// import { useState } from "react";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";

// const CbzExtractor = () => {
//   const [extracting, setExtracting] = useState(false);
//   const [progress, setProgress] = useState<string>("");

//   const extractCbzFile = async (file: File) => {
//     try {
//       setProgress(`Mengekstrak ${file.name}...`);
//       const zip = new JSZip();
//       const contents = await zip.loadAsync(file);

//       const extractFolder = new JSZip();
//       const extractPromises = Object.keys(contents.files).map(
//         async (filename) => {
//           const fileData = await contents.files[filename].async("blob");
//           extractFolder.file(filename, fileData);
//         }
//       );

//       await Promise.all(extractPromises);

//       const extractedZip = await extractFolder.generateAsync({ type: "blob" });
//       saveAs(extractedZip, `${file.name.replace(".cbz", "")}_extracted.zip`);
//     } catch (error) {
//       console.error(`Gagal mengekstrak ${file.name}:`, error);
//       setProgress(`Gagal mengekstrak ${file.name}`);
//     }
//   };

//   const handleFolderUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const files = Array.from(event.target.files || []);
//     if (files.length === 0) return;

//     try {
//       setExtracting(true);

//       // Filter hanya file CBZ
//       const cbzFiles = files.filter((file) =>
//         file.name.toLowerCase().endsWith(".cbz")
//       );

//       if (cbzFiles.length === 0) {
//         alert("Tidak ada file CBZ yang ditemukan dalam folder");
//         return;
//       }

//       setProgress(`Ditemukan ${cbzFiles.length} file CBZ`);

//       // Proses setiap file CBZ
//       for (const file of cbzFiles) {
//         await extractCbzFile(file);
//       }

//       setProgress("Semua file berhasil diekstrak!");
//     } catch (error) {
//       console.error("Terjadi kesalahan:", error);
//       alert("Terjadi kesalahan saat mengekstrak file");
//     } finally {
//       setExtracting(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">CBZ Folder Extractor</h2>
//       <input
//         type="file"
//         webkitdirectory=""
//         multiple
//         accept=".cbz"
//         onChange={handleFolderUpload}
//         disabled={extracting}
//         className="block w-full text-sm text-gray-500
//           file:mr-4 file:py-2 file:px-4
//           file:rounded-full file:border-0
//           file:text-sm file:font-semibold
//           file:bg-blue-50 file:text-blue-700
//           hover:file:bg-blue-100"
//       />
//       {extracting && <p className="text-blue-500">{progress}</p>}
//     </div>
//   );
// };

// export default CbzExtractor;
