/* ------------------------------------------------------------------ */
/* Google Sheet live data layer — fetches daily updates from the      */
/* owner's published Google Sheet (gviz JSON endpoint, no API key).   */
/* Fails silently to built-in content when offline / not configured.  */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { GOOGLE_SHEET_ID, SHEET_TABS, type SheetTab } from './sheetConfig';
import type { Job, LiveUpdate, LiveUpdateCategory, Scheme, TickerItem, Tint } from './data';

export type SheetRow = Record<string, string>;

interface GvizCell {
  v?: unknown;
  f?: string;
}
interface GvizRow {
  c?: (GvizCell | null)[];
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/** Read a cell: prefer formatted text; unpack gviz Date(y,m,d) values. */
function cellText(cell: GvizCell | null | undefined): string {
  if (!cell) return '';
  if (cell.f != null) return String(cell.f).trim();
  if (cell.v == null) return '';
  const s = String(cell.v).trim();
  const dm = s.match(/^Date\((\d+),(\d+),(\d+)/);
  if (dm) {
    // → dd-mm-yyyy (parsed later by toISODate)
    return `${dm[3].padStart(2, '0')}-${String(Number(dm[2]) + 1).padStart(2, '0')}-${dm[1]}`;
  }
  return s;
}

/** Accept dd-mm-yyyy / dd/mm/yyyy / dd.mm.yyyy / yyyy-mm-dd → ISO yyyy-mm-dd ('' if invalid). */
export function toISODate(raw: string): string {
  const s = (raw || '').trim();
  if (!s) return '';
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return '';
}

/**
 * Resolve whatever the owner pasted in sheetConfig — normal Sheet ID,
 * "Publish to web" 2PACX ID, or any full Google Sheets URL — into the
 * correct gviz base URL. Published (2PACX) sheets use the /d/e/ form.
 */
function gvizBase(): string | null {
  const raw = GOOGLE_SHEET_ID.trim();
  if (!raw) return null;
  const published = raw.match(/\/d\/e\/([A-Za-z0-9-_]+)/);
  if (published) return `https://docs.google.com/spreadsheets/d/e/${published[1]}`;
  const normal = raw.match(/\/d\/([A-Za-z0-9-_]+)/);
  if (normal) return `https://docs.google.com/spreadsheets/d/${normal[1]}`;
  if (raw.startsWith('2PACX')) return `https://docs.google.com/spreadsheets/d/e/${raw}`;
  return `https://docs.google.com/spreadsheets/d/${raw}`;
}

async function fetchTab(tabName: string): Promise<SheetRow[]> {
  const base = gvizBase();
  if (!base) return [];
  const url = `${base}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(tabName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`sheet ${res.status}`);
  const text = await res.text();
  const m = text.match(/setResponse\(([\s\S]*)\);?\s*$/);
  if (!m) return [];
  const json = JSON.parse(m[1]);
  const cols: string[] = (json.table?.cols ?? []).map(
    (c: { label?: string }, i: number) => (c.label || `col${i}`).trim().toLowerCase()
  );
  return (json.table?.rows ?? [])
    .map((row: GvizRow) => {
      const obj: SheetRow = {};
      (row.c ?? []).forEach((cell, i) => {
        const key = cols[i];
        if (key) obj[key] = cellText(cell);
      });
      return obj;
    })
    .filter((o: SheetRow) => Object.values(o).some((v) => v));
}

/** Generic hook: rows of one sheet tab, cached 5 min, [] on any failure. */
export function useSheetRows(tab: SheetTab): SheetRow[] {
  const [rows, setRows] = useState<SheetRow[]>([]);

  useEffect(() => {
    if (!GOOGLE_SHEET_ID) return;
    const cacheKey = `ss-sheet:${tab}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { at, data } = JSON.parse(cached) as { at: number; data: SheetRow[] };
        if (Date.now() - at < CACHE_TTL) {
          setRows(data);
          return;
        }
      }
    } catch {
      /* ignore cache errors */
    }
    let alive = true;
    fetchTab(SHEET_TABS[tab])
      .then((r) => {
        if (!alive) return;
        setRows(r);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data: r }));
        } catch {
          /* storage full — ignore */
        }
      })
      .catch(() => {
        /* offline / unpublished sheet — keep built-in content */
      });
    return () => {
      alive = false;
    };
  }, [tab]);

  return rows;
}

/* ------------------------- row → app types ------------------------- */

const VALID_TINTS: Tint[] = ['terracotta', 'leaf', 'amber', 'rose', 'cocoa'];

function pickTint(raw: string | undefined, fallback: Tint): Tint {
  const t = (raw || '').trim().toLowerCase() as Tint;
  return VALID_TINTS.includes(t) ? t : fallback;
}

/** Jobs tab: Title | Org | OrgShort | Posts | Qualification | Age | LastDate | Link | Category */
export function useSheetJobs(): Job[] {
  const rows = useSheetRows('jobs');
  return rows
    .map((r, i): Job | null => {
      const iso = toISODate(r['lastdate'] ?? '');
      if (!r['title'] || !iso) return null;
      const org = r['org'] || 'सरकारी भर्ती';
      return {
        id: `sheet-job-${i}`,
        title: r['title'],
        org: { hi: org, en: org },
        orgShort: (r['orgshort'] || org).slice(0, 4).toUpperCase(),
        tint: pickTint(r['tint'], 'terracotta'),
        posts: r['posts'] || '—',
        qualification: r['qualification'] || '—',
        age: r['age'] || '—',
        lastDate: iso,
        isNew: true,
        tags: r['category'] ? [r['category']] : [],
      };
    })
    .filter((j): j is Job => Boolean(j));
}

/** Schemes tab: Name | Benefit | Audience | Summary | Link | Tint */
export function useSheetSchemes(): Scheme[] {
  const rows = useSheetRows('schemes');
  return rows
    .map((r, i): Scheme | null => {
      if (!r['name']) return null;
      const audience = r['audience'] || 'सभी';
      const summary = r['summary'] || '';
      return {
        id: `sheet-scheme-${i}`,
        name: { hi: r['name'], en: r['name'] },
        benefit: r['benefit'] || '',
        audience: { hi: audience, en: audience },
        summary: { hi: summary, en: summary },
        tint: pickTint(r['tint'], 'leaf'),
      };
    })
    .filter((sc): sc is Scheme => Boolean(sc));
}

/** Ticker tab: Headline | Link — shown on the home + jobs ticker strip. */
export function useSheetTickerItems(): TickerItem[] {
  const rows = useSheetRows('ticker');
  return rows
    .filter((r) => r['headline'])
    .map((r) => ({
      text: { hi: r['headline'], en: r['headline'] },
      href: r['link'] || '/jobs',
    }));
}

const VALID_UPDATE_CATEGORIES: LiveUpdateCategory[] = [
  'job',
  'exam',
  'admit',
  'result',
  'cbse',
  'tech',
  'ai',
  'news',
];

/**
 * Updates tab: Text | Category | Link | Date — the owner's daily
 * live-news feed (exams, hall tickets, job ads, tech/AI news, CBSE).
 * Category accepts: job, exam, admit, result, cbse, tech, ai, news.
 * Date: dd-mm-yyyy or yyyy-mm-dd (optional but recommended).
 */
export function useSheetUpdates(): LiveUpdate[] {
  const rows = useSheetRows('updates');
  return rows
    .map((r, i): LiveUpdate | null => {
      if (!r['text']) return null;
      const cat = (r['category'] || '').trim().toLowerCase() as LiveUpdateCategory;
      return {
        id: `sheet-update-${i}`,
        text: { hi: r['text'], en: r['text'] },
        category: VALID_UPDATE_CATEGORIES.includes(cat) ? cat : 'news',
        href: r['link'] || '/',
        date: toISODate(r['date'] ?? '') || '',
      };
    })
    .filter((u): u is LiveUpdate => Boolean(u))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
