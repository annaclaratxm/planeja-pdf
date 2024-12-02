import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            process.env.CLOUDFLARE_R2_ENDPOINT_PUBLIC?.replace(/^https?:\/\//, '').replace('/planeja-pdf', '') || ''
        ],
    },
};

export default nextConfig;
