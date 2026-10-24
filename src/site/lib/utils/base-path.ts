/** Standalone URLs start at the domain root. Shared deployments can explicitly set a folder. */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/** Historical frontend paths may still arrive from WordPress or old bookmarks. */
export const legacyBasePath = "/katyayani";
const legacyFolders = [legacyBasePath, "/kathyayani"];

/** Remove only a complete leading folder, preserving the route, query and fragment. */
function stripFolder(path: string) {
  const folders = [basePath, process.env.CMS_PATH_PREFIX, ...legacyFolders]
    .filter((folder): folder is string => Boolean(folder))
    .map((folder) => folder.trim().replace(/\/+$/, ""))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  for (const folder of folders) {
    if (path === folder) return "/";
    if (!path.startsWith(folder)) continue;
    const rest = path.slice(folder.length);
    if (rest.startsWith("/")) return rest;
    if (rest.startsWith("#") || rest.startsWith("?")) return `/${rest}`;
  }
  return null;
}

/** Normalize local links and assets; add a deployment folder only when explicitly configured. */
export function withBasePath(url: string) {
  if (!url.startsWith("/") || url.startsWith("//")) return url;
  const path = stripFolder(url) ?? url;
  if (!basePath) return path;
  if (path === "/" || path.startsWith("/#") || path.startsWith("/?")) return `${basePath}${path.slice(1)}`;
  return `${basePath}${path}`;
}

/** Convert a current or historical frontend path to its domain-root route. */
export function withoutBasePath(path: string) {
  return stripFolder(path) ?? path;
}
