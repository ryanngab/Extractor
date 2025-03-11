import { authMiddleware } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'id', 'ja', 'hi'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

// Definisikan publicRoutes
const publicRoutes = ["/", "/resources/blog(.*)", "/:locale", "/:locale/resources/blog(.*)"];

// Buat middleware yang menggabungkan intl dan auth
export default authMiddleware({
  publicRoutes,
  ignoredRoutes: ["/api/webhook"],
  beforeAuth: (req: NextRequest) => {
    return intlMiddleware(req);
  }
});

// Pastikan matcher mencakup locale paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|_vercel|.*\\..*).*)', '/'],
};


// import { authMiddleware } from "@clerk/nextjs/server";
// import createMiddleware from "next-intl/middleware";
// import { NextResponse } from "next/server";

// // Buat middleware i18n terlebih dahulu
// const intlMiddleware = createMiddleware({
//   locales: ['en', 'id'],
//   defaultLocale: 'id',
//   localePrefix: 'always'
// });

// // Daftar rute yang tidak perlu autentikasi
// const publicRoutes = [
//   "/",
//   "/resource/blog(.*)",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/:locale/sign-in(.*)",
//   "/:locale/sign-up(.*)",
//   "/:locale/resource/blog(.*)",
//   "/:locale"
// ];

// export default authMiddleware({
//   beforeAuth: (req) => {
//     // Handle i18n routing sebelum autentikasi
//     const response = intlMiddleware(req);
//     return response;
//   },
//   afterAuth(auth, req) {
//     const { userId } = auth;
//     const locale = req.nextUrl.pathname.split('/')[1];
//     const isValidLocale = ['en', 'id'].includes(locale);
//     const path = isValidLocale ? req.nextUrl.pathname.substring(3) : req.nextUrl.pathname;
    
//     // Redirect user yang sudah login dari homepage ke dashboard
//     if (userId && path === "") {
//       const redirectUrl = new URL(`/${locale}`, req.url);
//       return NextResponse.redirect(redirectUrl);
//     }

//     return NextResponse.next();
//   },
//   publicRoutes,
// });

// // Update matcher untuk mencakup semua rute termasuk locale
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
