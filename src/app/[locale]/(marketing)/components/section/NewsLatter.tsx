'use client';

import React from "react";
import { Container, Icons, Wrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LampContainer } from "@/components/ui/lamp";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const NewsLatter = () => {
  const t = useTranslations();
  const locale = useParams()?.locale as string;
  
  const localizedHref = (path: string) => `/${locale}${path}`;

  return (
    // {/* newsletter */}
    <Wrapper className="flex flex-col items-center justify-center py-12 relative">
      <Container>
        <LampContainer>
          <div className="flex flex-col items-center justify-center relative w-full text-center">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl lg:!leading-snug font-semibold mt-8">
              {t("newsletter.title")}
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md mx-auto">
              {t("newsletter.description")}
            </p>
            <Button variant="default" className="mt-6" asChild>
              <Link href="/sign-in">
                {t("newsletter.get_started")}

                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </LampContainer>
      </Container>
      <Container className="relative z-[999999]">
        <div className="flex items-center justify-center w-full -mt-40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between w-full px-4 md:px-8 rounded-lg lg:rounded-2xl border border-border/80 py-4 md:py-8">
            <div className="flex flex-col items-start gap-4 w-full">
              <h4 className="text-xl md:text-2xl font-semibold">
                {t("newsletter.join_title")}
              </h4>
              <p className="text-base text-muted-foreground">
                {t("newsletter.join_description")}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:min-w-80 mt-5 md:mt-0 w-full md:w-max">
              <form
                action="#"
                className="flex flex-col md:flex-row items-center gap-2 w-full md:max-w-xs"
              >
                <Input
                  required
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-primary duration-300 w-full"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="secondary"
                  className="w-full md:w-max"
                >
                  {t(".newsletter.subscribe")}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                {t(".newsletter.by")}

                <Link href="#">
                  Privacy Policy
                  {t(".newsletter.policy")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

export default NewsLatter;
