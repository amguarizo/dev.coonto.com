import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: { "/api/works/o-alienista": ["./content/Coonto_O_Alienista.html"] },
};

export default nextConfig;
