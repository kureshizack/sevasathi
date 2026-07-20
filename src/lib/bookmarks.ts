import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ss-bookmarks';

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/** Notify other hook instances in the same tab. */
function write(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent('ss-bookmarks-changed'));
}

/**
 * Bookmarks hook (design.md §10.6): persists saved item ids in
 * localStorage["ss-bookmarks"], syncs across hook instances.
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(read);

  useEffect(() => {
    const onChange = () => setBookmarks(read());
    window.addEventListener('ss-bookmarks-changed', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('ss-bookmarks-changed', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const has = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const toggle = useCallback((id: string): boolean => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(next);
    return next.includes(id);
  }, []);

  return { bookmarks, has, toggle };
}
