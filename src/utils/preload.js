/**
 * Roll the Night — Image Preloading Cache
 * Preloads position illustration assets in the background so they display instantly.
 */

const preloadedCache = new Set();

export function preloadImage(src) {
  if (!src || typeof window === 'undefined') return Promise.resolve();
  if (preloadedCache.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      preloadedCache.add(src);
      resolve(src);
    };
    img.onerror = () => {
      resolve(src);
    };
  });
}

export function preloadBatch(sources = []) {
  if (!Array.isArray(sources) || sources.length === 0) return;
  sources.forEach((src) => {
    preloadImage(src);
  });
}

