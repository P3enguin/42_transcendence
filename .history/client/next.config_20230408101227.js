/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}
module.exports = {
    images: {
        remotePatterns: [{
            protocol: 'http',
            hostname: process.env.NEXT_PUBLIC_BACKEND_HOST,
            port: '',
            pathname: '/avatars/**',
        }, ],
    },
}
module.exports = nextConfig