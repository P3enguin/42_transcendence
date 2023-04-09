/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}
module.exports = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: process.en,
            port: '',
            pathname: '/account123/**',
        }, ],
    },
}
module.exports = nextConfig