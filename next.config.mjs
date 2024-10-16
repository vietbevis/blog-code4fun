/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

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

export default withBundleAnalyzer(nextConfig)
