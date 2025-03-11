"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn, NAV_LINKS } from "@/utils";
import { useClerk, UserButton } from "@clerk/nextjs";
import { LucideIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import MobileNavbar from "./mobile-navbar";
import AnimationContainer from "@/components/global/animation-container";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import Icons from "@/components/global/icons";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslations } from "next-intl";
// import { ModeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  const { user } = useClerk();
  const t = useTranslations('nav');
  const locale = useParams()?.locale as string;

  const [scroll, setScroll] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 8) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const localizedHref = (path: string) => `/${locale}${path}`;

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 h-14 w-full border-b border-transparent z-[99999] select-none",
        scroll && "border-background/80 bg-background/40 backdrop-blur-md"
      )}
    >
      <AnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href={localizedHref('/')} className="flex items-center gap-2">
              <Icons.logo className="w-8 h-8" />
              <span className="text-lg font-medium">CVCoders</span>
            </Link>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {NAV_LINKS.map((link) => (
                  <NavigationMenuItem key={link.title}>
                    {link.menu ? (
                      <>
                        <NavigationMenuTrigger>
                          {t(link.title.toLowerCase())}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul
                            className={cn(
                              "grid gap-1 p-4 md:w-[400px] lg:w-[500px] rounded-xl",
                              link.title === "Features"
                                ? "lg:grid-cols-[.75fr_1fr]"
                                : "lg:grid-cols-2"
                            )}
                          >
                            {link.title === "Features" && (
                              <li className="row-span-4 pr-2 relative rounded-lg overflow-hidden">
                                <div className="absolute inset-0 !z-10 h-full w-[calc(100%-10px)] bg-[linear-gradient(to_right,rgb(38,38,38,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgb(38,38,38,0.5)_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
                                <NavigationMenuLink asChild className="z-20 relative">
                                  <Link
                                    href={localizedHref('/')}
                                    className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                                  >
                                    <h6 className="mb-2 mt-4 text-lg font-medium">
                                      {t('features_menu.all_features')}
                                    </h6>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                      {t('features_menu.all_features_desc')}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            )}
                            {link.menu.map((menuItem) => (
                              <ListItem
                                key={menuItem.title}
                                title={t(`${link.title.toLowerCase()}_menu.${menuItem.title.toLowerCase().replace(/ /g, '_')}`)}
                                href={localizedHref(menuItem.href)}
                                icon={menuItem.icon}
                              >
                                {t(`${link.title.toLowerCase()}_menu.${menuItem.title.toLowerCase().replace(/ /g, '_')}_desc`)}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={localizedHref(link.href)} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {t(link.title.toLowerCase())}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <LanguageToggle />
                <UserButton />
              </>
            ) : (
              <>
                <LanguageToggle />
                <Link
                  href={localizedHref('/sign-in')}
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  {t('login')}
                </Link>
                <Link
                  href={localizedHref('/sign-up')}
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden md:flex",
                  })}
                >
                  {t('start_trial')}
                </Link>
              </>
            )}
            {/* <ModeToggle /> */}
          </div>

          <MobileNavbar />
        </MaxWidthWrapper>
      </AnimationContainer>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon: LucideIcon }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-100 ease-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2 text-neutral-300">
            <Icon className="h-4 w-4" />
            <h6 className="text-sm font-medium !leading-none">{title}</h6>
          </div>
          <p
            title={children! as string}
            className="line-clamp-1 text-sm leading-snug text-muted-foreground"
          >
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
