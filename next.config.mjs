/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['img.youtube.com', 'localhost','api.magadhuniversityinfo.com',]
        
        
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
