/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  // Make sure the logo file is bundled into the email API routes so it can be
  // read at runtime and embedded inline (CID) in the messages we send.
  outputFileTracingIncludes: {
    "/api/book": ["./public/logo.png"],
    "/api/contact": ["./public/logo.png"],
  },
};

export default nextConfig;
