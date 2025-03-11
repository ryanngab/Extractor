import { Container, Footer, Navbar, Wrapper } from "@/components";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PropsWithChildren } from "react";

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start justify-center pt-8 pb-10 w-full mx-auto">
        <Wrapper>
          <Container>{children}</Container>
        </Wrapper>
      </div>
      <ScrollToTop />
      <Footer />
    </>
  );
}
