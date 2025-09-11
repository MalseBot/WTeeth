import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
	/* config options here */
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


const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);