/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,

  async redirects() {
    return [
      {
        source: "/services",
        destination: "/platform",
        permanent: true,
      },
      {
        source: "/approach",
        destination: "/consulting",
        permanent: true,
      },
      {
        source: "/fintech",
        destination: "/consulting/industries",
        permanent: true,
      },
      {
        source: "/healthcare",
        destination: "/consulting/industries",
        permanent: true,
      },
      {
        source: "/audit-kit",
        destination: "/consulting",
        permanent: true,
      },
      {
        source: "/golden-flows",
        destination: "/consulting/explore",
        permanent: true,
      },
      {
        source: "/golden-flows/:path*",
        destination: "/consulting/explore",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/playground",
        destination: "/",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/consulting/case-studies",
        permanent: true,
      },
      {
        source: "/sample-report",
        destination: "/consulting/sample-report",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://calendly.com https://*.vercel-analytics.com https://*.vercel-insights.com",
              "frame-src https://calendly.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
