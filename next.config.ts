import type { NextConfig } from "next";

// Content Security Policy — shipped in Report-Only mode first so violations are
// observed in browser DevTools without breaking the site. Once the console is
// clean across sign-in, exchange, admin, and remote-image flows, flip the key
// to "Content-Security-Policy" to enforce. Keep the policy on a single line —
// browsers accept whitespace, but inline newlines complicate header values.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://va.vercel-scripts.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://raw.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://accounts.google.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://vercel.live",
  "media-src 'self'",
  "frame-src 'self' https://accounts.google.com",
  "form-action 'self' https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const immutableCache = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/videos/:path*", headers: immutableCache },
      { source: "/images/:path*", headers: immutableCache },
    ];
  },
};

export default nextConfig;
