/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/canman.github.io',
  assetPrefix: '/canman.github.io/',
};

export default nextConfig;
