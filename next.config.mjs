/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera um site estático em out/, publicado no GitHub Pages
  output: 'export',
  // No Pages o site fica em /Crypto_Bubbles_BR; o workflow de deploy define BASE_PATH
  basePath: process.env.BASE_PATH || '',
  reactStrictMode: true,
}

export default nextConfig
