"use client";
import { useState, useEffect } from "react";
import { ArrowUpToLine, Menu, Heart, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showTopBtn && (
        <div 
          className="fixed bottom-4 right-4 flex flex-col items-end space-y-2"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          {showMenu && (
            <div className="flex flex-col space-y-2 transition-opacity duration-300 opacity-100">
              <Button className="shadow-md" size="icon" onClick={() => window.open('https://donasi.example.com', '_blank')}>
                <Heart className="h-4 w-4" />
              </Button>
              <Button className="shadow-md" size="icon" onClick={() => window.location.href='https://wa.me/083137991102'}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button className="shadow-md" size="icon" onClick={() => window.location.href='mailto:firdausriyan402@gmail.com'}>
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button className="shadow-md relative" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
          <Button onClick={goToTop} className="shadow-md" size="icon">
            <ArrowUpToLine className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};
