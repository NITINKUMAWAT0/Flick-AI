/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'img.clerk.com',
      'images.clerk.dev',
      'firebasestorage.googleapis.com', // ✅ Add this line
    ],
  },
};

export default nextConfig;
