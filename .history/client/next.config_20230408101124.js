/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}
module.exports = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: 'example.come2',
            port: '',
            pathname: '/account123/**',
        }, ],
    },
}
module.exports = nextConfig