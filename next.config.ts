import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old demo URLs — both demos were pulled (adversarial review + user call).
      // 301 them to /digital so external links / caches / shares don't 404.
      { source: "/digital/demos/3d-product", destination: "/digital", permanent: true },
      { source: "/digital/demos/depth-3d", destination: "/digital", permanent: true },
      { source: "/consulting/workflow-demo", destination: "/solutions/ca-firm", permanent: true },
      // /managed page deleted — Managed mode positioning lives on /solutions/ca-firm
      // alongside Firm mode (both shown on the "Pick your mode" section). Redirect
      // any inbound links so external / cached / shared URLs don't 404.
      { source: "/managed", destination: "/solutions/ca-firm", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Multi-zone proxy — CA Firm Toolkit deploys independently at
      // ca-firm-toolkit.vercel.app, but customer sees it at polycloud.in/ca-firm/app/*.
      // The toolkit's basePath is set to /ca-firm/app via NEXT_PUBLIC_BASE_PATH env var,
      // so proxied paths land on real routes there.
      // Repo: polycloudin/ca-firm-toolkit · separate Vercel project, separate iteration.
      {
        source: "/ca-firm/app/:path*",
        destination: "https://ca-firm-toolkit.vercel.app/ca-firm/app/:path*",
      },
    ];
  },
};

export default nextConfig;
