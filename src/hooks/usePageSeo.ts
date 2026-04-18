import { useEffect } from "react";
import { SITE_CONFIG } from "@/lib/site-config";

interface SeoInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

export function usePageSeo({ title, description, path, image, noindex }: SeoInput) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set/create meta tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrVal] = selector.replace("meta[", "").replace("]", "").split('="');
        el.setAttribute(attrName, attrVal?.replace('"', "") ?? attr);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    const url = `${SITE_CONFIG.url}${path}`;
    const imgUrl = image
      ? image.startsWith("http") ? image : `${SITE_CONFIG.url}${image}`
      : `${SITE_CONFIG.url}/og-default.jpg`;

    setMeta('meta[name="description"]', "name", description);
    setMeta('meta[name="robots"]', "name", noindex ? "noindex, follow" : "index, follow");

    // OG
    setMeta('meta[property="og:title"]', "property", title);
    setMeta('meta[property="og:description"]', "property", description);
    setMeta('meta[property="og:url"]', "property", url);
    setMeta('meta[property="og:image"]', "property", imgUrl);

    // Twitter
    setMeta('meta[name="twitter:title"]', "name", title);
    setMeta('meta[name="twitter:description"]', "name", description);
    setMeta('meta[name="twitter:image"]', "name", imgUrl);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, image, noindex]);
}
