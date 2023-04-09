/** @type {import('next').NextConfig} */
const nextConfig = {
        reactStrictMode: true,
        images: {
            remotePatterns: [{
                protocol: 'http',
                hostname: 'locahost',
                port: '',
                pathname: '/avatars/**',
            }, ],
        },
    },

    module.exports = nextConfig