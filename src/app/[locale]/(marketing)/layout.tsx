import { Footer, Navbar } from "@/components";
import { ScrollToTop } from "@/components/ScrollToTop";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center w-full">
      <Navbar />
      {children}
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MarketingLayout;
