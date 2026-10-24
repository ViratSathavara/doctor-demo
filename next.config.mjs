// Allow next/image to load media from the CMS host when CMS_API_BASE is set (local /content needs nothing).
function cmsImagePatterns() {
  return [process.env.CMS_API_BASE]
    .filter((value) => value?.trim())
    .flatMap((api) => {
      try {
        const { protocol, hostname } = new URL(api.trim());
        return [{ protocol: protocol.replace(":", ""), hostname }];
      } catch {
        return [];
      }
    });
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Served at the domain root. Set NEXT_PUBLIC_BASE_PATH only when deploying under a folder.
  env: { NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "" },
  images: {
    // Local illustrations (doctor avatars, facility art, logo) are SVG.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      ...cmsImagePatterns(),
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "secure.gravatar.com", pathname: "/avatar/**" },
      // Google review avatars (lh3.googleusercontent.com).
      { protocol: "https", hostname: "*.googleusercontent.com", pathname: "/**" },
    ],
  },
  async redirects() {
    return [["blog", "blogs"], ["contact", "contact-us"], ["gallery", "success-stories"]].map(([from, to]) => ({
      source: `/${from}`, destination: `/${to}`, permanent: true,
    }));
  },
};

export default nextConfig;
