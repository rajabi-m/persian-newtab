# Contributing to No NewTab

No NewTab is an independent Persian RTL new tab extension. Contributions can be discussed and reviewed locally now; this repository has not been published to GitHub.

## Run it locally

Use Node.js 22 and Bun 1.3.8. Install Bun from its official distribution, then run:

```sh
bun install --frozen-lockfile
bun run dev
```

The development server is local to your computer. Browser extension permissions are available only in the installed extension; the web preview cannot connect Google Calendar.

```sh
bun run build             # Chrome / Edge: dist/
bun run build:firefox     # Firefox desktop 140+: dist-firefox/
bun test
```

In Chrome or Edge, enable Developer mode and load the corresponding build folder with **Load unpacked**. In Firefox, use `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** and select `dist-firefox/manifest.json`. Firefox development installations are temporary. Keep the Gecko ID in `scripts/firefox-manifest.mjs` unchanged.

## Find your way around

- `src/main.tsx`, `src/style.css`: dashboard, settings and layout.
- `src/calendar.ts`, `src/iran-calendar.ts`, `src/data/`: Persian dates and Iranian occasions.
- `src/google-calendar.ts`, `src/use-google-calendar.ts`: private iCal parsing and connection lifecycle.
- `src/background.ts`, `src/background-media.tsx`: local uploaded media and muted video.
- `public/manifest.json`, `scripts/firefox-manifest.mjs`: browser manifests.
- `tests/`: calendar, feed, permissions and file validation checks.

## Make a change

1. Start a focused branch, for example `git switch -c fix/calendar-navigation`.
2. Explain the problem and intended behavior before large changes. Pick a starter task from [ROADMAP.md](ROADMAP.md).
3. Keep a change small enough to review. Preserve Persian text, RTL behavior, accessibility labels and the desktop layout that fits the window.
4. Run `bun run check`. Add meaningful regression tests for date calculations, recurrence, permissions or data handling that you change.
5. Test UI changes manually in a clean browser profile, including a short desktop window and light/dark themes. Record which browsers you actually tested.
6. Use a concise commit message describing the change. When the repository is published, submit a pull request using the included template. Until then, share a Git patch or a source archive with the maintainer.

Do not commit dependency folders, compiled builds, store packages, real calendar feeds, personal screenshots, notes, exported backups or signing credentials. Use fictional calendar fixtures. Do not add telemetry, advertising, remote scripts, new permissions or runtime dependencies without discussing the need first.

## Calendar data and licenses

Lunar holidays are verified for 1405 only. Any new year's data needs source attribution and date validation; never silently estimate official holidays. Read [IRAN_CALENDAR_DATA.md](IRAN_CALENDAR_DATA.md). Keep third-party license notices intact. Your contributions to project code are provided under the existing MIT license; dependencies and assets retain their own licenses.

## Releases

Contributing does not require access to store accounts. Maintainers review releases and handle Mozilla signing separately. CI validates pull requests; successful pushes to main publish development ZIPs in GitHub Releases. It does not sign packages or publish to browser stores. See [RELEASING.md](RELEASING.md).
