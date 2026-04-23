import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old demo URLs — both demos were pulled (adversarial review + user call).
      // 301 them to /digital so external links / caches / shares don't 404.
      { source: "/digital/demos/3d-product", destination: "/digital", permanent: true },
      { source: "/digital/demos/depth-3d", destination: "/digital", permanent: true },
      { source: "/consulting/workflow-demo", destination: "/solutions/ca-firm", permanent: true },
    ];
  },
};

export default nextConfig;
