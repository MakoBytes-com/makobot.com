import type { NextConfig } from "next";

// Content Security Policy — enforced. Originally shipped Report-Only on
// 2026-05-01 (commit 873f006); flipped to enforcing on 2026-05-01 (this
// commit) after a headless-browser audit across 15 public pages found zero
// violations. To roll back if something breaks in production, change the
// header key below from "Content-Security-Policy" back to
// "Content-Security-Policy-Report-Only" — the policy value itself is stable.
const csp = [
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
  { key: "Content-Security-Policy", value: csp },
];

const immutableCache = [
  { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
