const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");

module.exports = withNextIntl({
  // konfigurasi Next.js lainnya
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api.slingacademy.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "darkcssweb.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api.github.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "camo.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ui.shadcn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.codingnepalweb.com",
        port: "",
      },
    ],
  },
  reactStrictMode: false,
});
