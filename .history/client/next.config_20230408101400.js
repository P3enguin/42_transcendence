/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}
module.exports = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: 'localhost',
            port: '',
            pathname: '/avatars/**',
        }, ],
    },
}
module.exports = nextConfig