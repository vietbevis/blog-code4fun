/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'code4fun.xyz',
        pathname: '**'
      }
    ]
  }
}

export default nextConfig
