# Mozilla reviewer build instructions — No NewTab 1.2.2

This is the complete original source for the Firefox package. Own code is MIT; third-party license notices are in THIRD_PARTY_NOTICES.txt and public/vendor.

## Build
Use Node.js 22 or later and Bun 1.3.8 (tested on macOS).
From the source root:

    bun install --frozen-lockfile
    bun run build:firefox

The complete installable extension is in dist-firefox/. Zip the CONTENTS of this directory so manifest.json is at the archive root. Vite bundles React, TypeScript, Lucide and ical.js. scripts/firefox-manifest.mjs adds the stable Gecko ID and Firefox-specific manifest fields. No environment variables, secrets, external build services, or private dependencies are required.

## Validation
    bun test
    bunx web-ext lint --source-dir dist-firefox

## Functionality and privacy
Persian RTL new tab with local notes, todos, shortcuts, Jalali calendar, Iranian occasions and holidays, and customizable backgrounds. Settings can optionally connect a user-provided Google Calendar private iCal URL. Google host permission is requested only on explicit connection; event data is fetched directly from calendar.google.com, with no intermediary server. Search queries go to the search provider selected by the user. No analytics or advertising. Private feed URLs stay in browser local storage and are excluded from backups. Local background images/GIFs/videos stay in IndexedDB; videos are muted. No remote scripts are loaded.

The generated scenic wallpaper is documented in ASSETS.md. Calendar data provenance and year coverage are documented in IRAN_CALENDAR_DATA.md. The unmodified readable ical.js sources are also shipped under public/vendor for MPL compliance.
