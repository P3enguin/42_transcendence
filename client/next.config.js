/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [{
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
            pathname: '/rooms/**',
        }, ],
    },
}

module.exports = nextConfig