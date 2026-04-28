import { withSentryConfig } from "@sentry/nextjs";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/:country([a-z]{2})',
        destination: '/country/:country',
        permanent: true,
      },
      {
        source: '/:country([a-z]{2})/:path*',
        destination: '/country/:country/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "pub-30fe322d5c6d410ca680bca1d0764bd5.r2.dev",
      },
      {
        protocol: "https",
        hostname: "s.isanook.com",
      },
      {
        protocol: "http",
        hostname: "s.isanook.com",
      },
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  turbopack: {
    // Silence warning about multiple lockfiles and incorrect workspace root inference
    root: typeof __dirname !== "undefined" ? __dirname : process.cwd(),
  },
};

// Apply Serwist only in production, as it breaks Turbopack in development
const exportConfig = process.env.NODE_ENV === "development" ? nextConfig : withSerwist(nextConfig);

export default withSentryConfig(exportConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "krseisenh",

  project: "lotto-x-client",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",
});
