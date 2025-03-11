'use client';

import React from "react";
import { Container, Wrapper } from "@/components";
import SectionBadge from "@/components/ui/section-badge";
import { services } from "@/constants";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const ServicesSection = () => {
  const t = useTranslations('services');
  const locale = useParams()?.locale as string;
  
  const localizedHref = (path: string) => `/${locale}${path}`;
  return (
    // {/* how it works */}
    <Wrapper className="flex flex-col items-center justify-center py-12 relative">
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
        <div className="flex flex-col items-center justify-center py-10 md:py-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full divide-x-0 md:divide-x divide-y md:divide-y-0 divide-gray-900 first:border-l-2 lg:first:border-none first:border-gray-900">
            {services.map((services) => (
              <div
                key={services.titleKey}
                className="flex flex-col items-start px-4 md:px-6 lg:px-8 lg:py-6 py-4"
              >
                <div className="flex items-center justify-center">
                  <services.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mt-4">
                {t(`services_menu.${services.titleKey.toLowerCase().replace(/ /g, '_')}.title`)}
                </h3>
                <p className="text-muted-foreground mt-2 text-start lg:text-start">
                {t(`services_menu.${services.titleKey.toLowerCase().replace(/ /g, '_')}.description`)}
                  
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

export default ServicesSection;
