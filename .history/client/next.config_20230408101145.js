/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}
module.exports = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: process.env.NE,
            port: '',
            pathname: '/account123/**',
        }, ],
    },
}
module.exports = nextConfig