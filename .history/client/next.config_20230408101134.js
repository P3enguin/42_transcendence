/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}
module.exports = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: process,
            port: '',
            pathname: '/account123/**',
        }, ],
    },
}
module.exports = nextConfig