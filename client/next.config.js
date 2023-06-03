/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        port: '8000',
        pathname: '/avatars/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '8000',
        pathname: '/wallpapers/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '8000',
        pathname: '/ranks/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '8000',
        pathname: '/channels/**',
      },
      {
        protocol: 'https',
        hostname: 'badge.mediaplus.ma',
        // port: '8000',
        pathname: '/darkblue/**',
      },
    ],
  },
};

module.exports = nextConfig;
