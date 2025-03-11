"use client";

import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function BackButton() {
  return (
    <div className="position-sticky top-0">
      <button
        className={buttonVariants({
          variant: "link",
          className: "!mx-0 !px-0 mb-7 !-ml-1",
        })}
        onClick={() => window.history.back()}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1.5" /> Back
      </button>
    </div>
  );
}
