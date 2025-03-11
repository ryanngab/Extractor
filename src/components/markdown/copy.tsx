// "use client";

// import { CheckIcon, CopyIcon } from "lucide-react";
// import { Button } from "../ui/button";
// import { useState, useEffect } from "react";
// import { detectAnyAdblocker } from "just-detect-adblock";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";

// export default function Copy({ content }: { content: string }) {
//   const [isCopied, setIsCopied] = useState(false);
//   const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);

//   useEffect(() => {
//     checkAdBlocker();
//   }, []);

//   async function checkAdBlocker() {
//     const adblockDetected = await detectAnyAdblocker();
//     setIsAdBlockDetected(adblockDetected);
//   }

//   async function handleCopy() {
//     // Periksa kembali status adblock sebelum menyalin
//     await checkAdBlocker();

//     if (isAdBlockDetected) {
//       setShowDialog(true);
//       return;
//     }

//     await navigator.clipboard.writeText(content);
//     setIsCopied(true);

//     setTimeout(() => {
//       setIsCopied(false);
//     }, 2000);
//   }

//   return (
//     <>
//       <Button
//         variant="secondary"
//         className="border"
//         size="xs"
//         onClick={handleCopy}
//       >
//         {isCopied ? (
//           <CheckIcon className="w-3 h-3" />
//         ) : (
//           <CopyIcon className="w-3 h-3" />
//         )}
//       </Button>

//       <Dialog open={showDialog} onOpenChange={setShowDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>AdBlock Terdeteksi</DialogTitle>
//             <DialogDescription>
//               Kami mendeteksi bahwa Anda menggunakan AdBlock. Fitur salin tidak
//               dapat digunakan dengan AdBlock yang aktif. Mohon nonaktifkan
//               AdBlock Anda dan coba lagi.
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import * as detectAdBlock from "just-detect-adblock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function Copy({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    checkAdBlocker();
  }, []);

  async function checkAdBlocker() {
    const adblockDetected = await detectAdBlock.detectAnyAdblocker();
    setIsAdBlockDetected(adblockDetected);
  }

  async function handleCopy() {
    await checkAdBlocker();

    if (isAdBlockDetected) {
      setShowDialog(true);
      return;
    }

    await navigator.clipboard.writeText(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <>
      <Button
        variant="secondary"
        className="border"
        size="xs"
        onClick={handleCopy}
      >
        {isCopied ? (
          <CheckIcon className="w-3 h-3" />
        ) : (
          <CopyIcon className="w-3 h-3" />
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AdBlock Terdeteksi</DialogTitle>
            <DialogDescription>
              Kami mendeteksi bahwa Anda menggunakan AdBlock. Fitur salin tidak
              dapat digunakan dengan AdBlock yang aktif. Mohon nonaktifkan
              AdBlock Anda dan coba lagi.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
