"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const languages = [
  { code: "id", name: "Indonesia" },
  { code: "en", name: "English" },
  { code: "hi", name: "India" },
  { code: "ja", name: "Javan" },
];

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const toggleLanguage = (langCode: string) => {
    if (currentLocale === langCode) return;

    // Dapatkan path tanpa locale
    const segments = pathname.split('/');
    segments.splice(1, 1); // Hapus segment locale
    const newPathname = segments.join('/') || '/';
    
    // Buat path baru dengan locale yang dipilih
    const newPath = `/${langCode}${newPathname}`;
    
    router.push(newPath);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-4 w-4" />
          <span className="absolute bottom-1 right-1 text-[10px] font-bold">
            {currentLocale.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => toggleLanguage(lang.code)}
            className={currentLocale === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 