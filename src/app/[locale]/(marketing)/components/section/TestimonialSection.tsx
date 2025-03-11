'use client';

import React from "react";
import { Container, Icons, Wrapper } from "@/components";
import Marquee from "@/components/ui/marquee";
import SectionBadge from "@/components/ui/section-badge";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import { reviews } from "@/constants";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const TestimonialSection = () => {
  const t = useTranslations("testimonial");
  const locale = useParams()?.locale as string;
  const localizedHref = (path: string) => `/${locale}${path}`;



  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);
  return (
    //    {/* testimonials */}
    <Wrapper className="flex flex-col items-center justify-center py-12 relative">
      <div
        id="testimonials"
        className=" hidden md:block absolute -top-1/4 -left-1/3 w-72 h-72 bg-indigo-500 rounded-full blur-[10rem] -z-10"
      ></div>
      <Container>
        <div className="max-w-md mx-auto text-start md:text-center">
          <SectionBadge title={t('badge')} />
          <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
          {t('title')}
           
          </h2>
          <p className="text-muted-foreground mt-6">
          {t('description')}
         
          </p>
        </div>
      </Container>
      <Container>
        <div className="py-10 md:py-20 w-full">
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-10">
            <Marquee pauseOnHover className="[--duration:20s] select-none">
              {firstRow.map((review) => (
                <figure
                  key={review.titleKey}
                  className={cn(
                    "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                    "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]"
                  )}
                >
                  <div className="flex flex-row items-center gap-2">
                    <UserIcon className="w-6 h-6" />
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-medium">
                        {review.name}
                      </figcaption>
                      <p className="text-xs font-medium text-muted-foreground">
                        {review.username}
                      </p>
                    </div>
                  </div>
                  <blockquote className="mt-2 text-sm">
                    {t(
                      `testimonial_people.${review.titleKey
                        .toLowerCase()
                        .replace(/ /g, "_")}.testimonial`
                    )}
                  </blockquote>
                </figure>
              ))}
            </Marquee>
            <Marquee
              reverse
              pauseOnHover
              className="[--duration:20s] select-none"
            >
              {secondRow.map((review) => (
                <figure
                  key={review.titleKey}
                  className={cn(
                    "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                    "border-zinc-50/[.1] bg-background over:bg-zinc-50/[.15]"
                  )}
                >
                  <div className="flex flex-row items-center gap-2">
                    <UserIcon className="w-6 h-6" />
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-medium">
                        {review.name}
                      </figcaption>
                      <p className="text-xs font-medium text-muted-foreground">
                        {review.username}
                      </p>
                    </div>
                  </div>
                  <blockquote className="mt-2 text-sm">
                    {t(
                      `testimonial_people.${review.titleKey
                        .toLowerCase()
                        .replace(/ /g, "_")}.testimonial`
                    )}
                  </blockquote>
                </figure>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

export default TestimonialSection;
