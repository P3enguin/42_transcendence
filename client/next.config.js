/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: 'localhost',
            port: '8000',
            pathname: '/avatars/**',
        }, ],
    },
}

module.exports = nextConfig