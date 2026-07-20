/* ------------------------------------------------------------------ */
/* GOOGLE SHEET DAILY-UPDATE SYSTEM — आपका अपडेट पैनल                  */
/*                                                                    */
/* HOW TO USE (2-minute one-time setup):                              */
/* 1. Create a Google Sheet with 3 tabs named EXACTLY:                */
/*    Jobs · Schemes · Ticker                                         */
/* 2. Add the header row shown in the update guide (README-UPDATE.md) */
/* 3. In Google Sheets: File → Share → Publish to web → Publish       */
/* 4. Copy the Sheet ID from the sheet URL:                           */
/*    https://docs.google.com/spreadsheets/d/<THIS_PART>/edit         */
/* 5. Paste it below between the quotes and save.                     */
/*    (Edit this one file on GitHub → site auto-updates in ~2 min)    */
/*                                                                    */
/* While GOOGLE_SHEET_ID is empty, the site shows built-in content.   */
/* ------------------------------------------------------------------ */

export const GOOGLE_SHEET_ID = '';

/** Tab names inside the Google Sheet (must match exactly). */
export const SHEET_TABS = {
  jobs: 'Jobs',
  schemes: 'Schemes',
  ticker: 'Ticker',
} as const;

export type SheetTab = keyof typeof SHEET_TABS;
