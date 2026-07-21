/* ------------------------------------------------------------------ */
/* GOOGLE SHEET DAILY-UPDATE SYSTEM — आपका अपडेट पैनल                  */
/*                                                                    */
/* Your published SevaSathi Updates sheet is already connected below. */
/* To use a different sheet later, paste here ANY of these:           */
/*   • the normal Sheet ID (from the .../d/<ID>/edit URL), or         */
/*   • the "Publish to web" 2PACX ID (from the pubhtml URL), or       */
/*   • the full Google Sheets URL — it will be detected automatically */
/* (Edit this one file on GitHub → site auto-updates in ~2 min)       */
/* ------------------------------------------------------------------ */

export const GOOGLE_SHEET_ID =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcVCk_3UsDv3fsv2Hj-a5oDQLdyjvyDFB1OmAppuq6Y_NFwzrH6OxS5dSNEk3f2EVSS5Qn0Zn-bdCJ/pubhtml';

/** Tab names inside the Google Sheet (must match exactly). */
export const SHEET_TABS = {
  jobs: 'Jobs',
  schemes: 'Schemes',
  ticker: 'Ticker',
  updates: 'Updates',
} as const;

export type SheetTab = keyof typeof SHEET_TABS;
