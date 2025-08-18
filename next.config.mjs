/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress specific Node.js deprecation warnings
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        { module: /node_modules\/bcryptjs/ },
        { module: /node_modules\/jsonwebtoken/ },
        { module: /node_modules\/mongoose/ },
        /Critical dependency/,
        /Module not found/,
      ];
    }
    return config;
  },
};

export default nextConfig;
