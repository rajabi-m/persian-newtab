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

## Automatic GitHub releases

Every push to `main` runs tests and builds both browsers. On success, a separate job publishes both ZIPs and SHA-256 checksums as a GitHub prerelease. Each build has its own `main-<run-id>-<attempt>` tag pointing to the exact commit, so old downloads are preserved even when the extension version has not changed. A manual workflow run on `main` also publishes; pull requests only validate and never release.

The workflow uses GitHub's built-in token with read access for builds and write access only in the release job. No extra secret is required. GitHub Actions must be enabled and repository policy must allow the release job's contents write permission. If publication is denied by repository policy, the successful build's ZIPs remain available as Actions artifacts for 14 days.

Firefox downloads are explicitly labeled unsigned. CI does not sign, submit to stores or imply store approval. Store submissions and signed packages remain separate from these main-branch builds.
