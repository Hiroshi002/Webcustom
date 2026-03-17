/** @type {import('next').NextConfig} */
const WebpackObfuscator = require("webpack-obfuscator");

const nextConfig = {
  // เพิ่มส่วนนี้เพื่อแก้ปัญหา Discord.js Build Error
  serverExternalPackages: [
    'discord.js',
    '@discordjs/ws',
    '@discordjs/rest',
    'zlib-sync',
    'bufferutil',
    'utf-8-validate'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // แนะนำให้เพิ่มความปลอดภัยสำหรับรูปภาพโปรไฟล์ Discord ด้วย
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; img-src 'self' data: https://cdn.discordapp.com;",
          },
        ],
      },
    ]
  },
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator(
          {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: "hexadecimal",
            selfDefending: false,
            simplify: true,
            stringArray: true,
            stringArrayEncoding: [],
            stringArrayThreshold: 0.75,
          },
          [
            "**/static/chunks/framework-*.js",
            "**/static/chunks/main-*.js",
            "**/static/chunks/webpack-*.js",
          ]
        )
      );
    }
    return config;
  },
};

export default nextConfig;
