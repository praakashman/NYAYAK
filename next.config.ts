/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    qualities: [75, 100], // Add 100 here to resolve the warning
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Often used with Clerk auth
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
