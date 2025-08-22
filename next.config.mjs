/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true, // Disables Next.js image optimization
    },
    output: 'export',
    reactStrictMode: false
};

export default nextConfig;
