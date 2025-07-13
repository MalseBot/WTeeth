import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images:{unoptimized: true},
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	async rewrites() {
		return [
			{
				source: '/media/:path*',
				destination: '/media/:path*',
			},
		];
	},
};

export default nextConfig;
