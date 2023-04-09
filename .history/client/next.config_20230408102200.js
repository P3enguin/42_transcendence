/** @type {import('next').NextConfig} */
const nextConfig = {
        reactStrictMode: true,
        images: {
            remotePatterns: [{
                protocol: 'http',
                hostname: 'example.com',
                port: '',
                pathname: '/avatar/**',
            }, ],
        },
    },

    module.exports = nextConfig