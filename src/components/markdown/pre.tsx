"use client";
import { ComponentProps, useEffect, useState } from "react";
import Copy from "./copy";
import { detectAnyAdblocker } from "just-detect-adblock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function Pre({
  children,
  raw,
  ...rest
}: ComponentProps<"pre"> & { raw?: string }) {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Fungsi untuk mendeteksi adblock menggunakan library
    const detectAdBlock = async () => {
      try {
        const isAdBlockActive = await detectAnyAdblocker();
        setAdBlockDetected(isAdBlockActive);
        if (isAdBlockActive) {
          setShowDialog(true);
        }
      } catch (e) {
        setAdBlockDetected(true);
        setShowDialog(true);
      }
    };

    detectAdBlock();
  }, []);

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="my-5 relative">
      <div className="absolute top-3 right-2.5 z-10 sm:block hidden">
        <Copy content={raw!} />
      </div>

      {/* Dialog dari shadcn/ui */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AdBlock Terdeteksi</DialogTitle>
            <DialogDescription>
              Harap nonaktifkan AdBlock untuk menggunakan fitur scroll kode dan
              melihat konten lengkap.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="relative">
        {adBlockDetected ? (
          <pre
            {...rest}
            style={{
              maxHeight: "150px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {children}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          </pre>
        ) : (
          <div style={{ position: "relative" }}>
            <pre
              {...rest}
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                padding: "1rem",
              }}
            >
              {children}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
