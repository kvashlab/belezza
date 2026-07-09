/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qcdjwlykamqtfuefgdkr.supabase.co',
      },
    ],
  },
};

export default nextConfig;
