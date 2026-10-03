# Preparing a release

Only a maintainer should publish store releases. No publishing credentials are included in this repository or used by CI.

1. Update `package.json`, `public/manifest.json` and the version heading in `SOURCE_BUILD.md` together. Keep the Firefox Gecko ID stable.
2. Record behavior changes and any new permissions in the release notes.
3. Run `bun install --frozen-lockfile` and `bun run check`.
4. Check the installable builds in clean profiles for both browsers. Review calendar year coverage, RTL, short desktop windows, persistence, privacy and muted custom video.
5. Zip the **contents** of `dist/` for Chrome/Edge and `dist-firefox/` for Firefox. Each ZIP must contain `manifest.json` at its root. Never zip a browser profile or local user-data export.
6. For a Mozilla source submission, include original code, lockfile, assets, notices and build instructions. Exclude `.git`, `node_modules`, compiled builds and personal files.
7. Check listing screenshots and package contents for real calendar events, private feed URLs, personal notes, account details and secrets. Use the clean demo images in `docs/images/`.
8. Submit the Firefox package for Mozilla signing. Each new release needs a new signature for normal Firefox installation. Chrome unpacked builds can be used locally; public Chrome distribution is a separate store process.

CI verifies code; successful CI does not mean store approval or publication. Store submissions and downloaded signed packages belong outside the tracked source tree. Any release automation must be configured explicitly later.
