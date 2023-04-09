/** @type {import('next').NextConfig} */
const nextConfig = {
        reactStrictMode: true,
        images: {
            remotePatterns: [{
                protocol: 'http',
                hostname: 'example.com',
                port: '',
                pathname: '/aatar/**',
            }, ],
        },
    },

    module.exports = nextConfig