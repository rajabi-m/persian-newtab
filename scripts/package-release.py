"""Package already-built extensions, verifying manifests and archive contents."""
import hashlib
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'release-assets'
version = json.loads((ROOT / 'package.json').read_text())['version']
if not re.fullmatch(r'[0-9]+(?:\.[0-9]+){1,3}', version):
    raise ValueError('Version must be a valid numeric browser extension version')
OUT.mkdir(exist_ok=True)
checksums = []
for browser, directory in [('chrome-edge', 'dist'), ('firefox-unsigned', 'dist-firefox')]:
    build = ROOT / directory
    manifest = json.loads((build / 'manifest.json').read_text())
    assert manifest['version'] == version, f'{directory}: version mismatch'
    assert manifest['manifest_version'] == 3
    assert manifest['chrome_url_overrides']['newtab'] == 'index.html'
    required = ['index.html', *manifest['icons'].values()]
    assert all((build / file).is_file() for file in required)
    if browser == 'chrome-edge':
        assert 'browser_specific_settings' not in manifest
    else:
        assert manifest['browser_specific_settings']['gecko']['id'] == '{c7e8c038-592f-4f9e-a7a2-8a38d953e77d}'
    archive = OUT / f'no-newtab-{browser}-{version}.zip'
    with ZipFile(archive, 'w', ZIP_DEFLATED) as zipped:
        for file in sorted(build.rglob('*')):
            if not file.is_file():
                continue
            relative = file.relative_to(build)
            assert not file.is_symlink(), f'Unexpected symlink: {file}'
            assert not any(part.startswith('.') for part in relative.parts)
            assert file.suffix.lower() not in {'.ics', '.ical', '.pem', '.key', '.pfx', '.xpi', '.zip'}
            zipped.write(file, relative.as_posix())
    with ZipFile(archive) as zipped:
        assert zipped.testzip() is None
        assert 'manifest.json' in zipped.namelist()
    checksums.append(f'{hashlib.sha256(archive.read_bytes()).hexdigest()}  {archive.name}')
    print(f'Validated {archive.name}')
(OUT / 'SHA256SUMS.txt').write_text('\n'.join(checksums) + '\n')
(OUT / 'VERSION.txt').write_text(version + '\n')
(OUT / 'RELEASE_NOTES.md').write_text(f"""Automated build of main, extension version {version}. Tests, TypeScript checks and both browser builds passed before packaging. These are development builds, marked as prereleases; store approval is separate.

- **Chrome / Edge:** Download the chrome-edge ZIP, extract it, enable Developer mode in chrome://extensions or edge://extensions, and use Load unpacked on the folder containing manifest.json. Keep the folder in place.
- **Firefox:** The firefox-unsigned ZIP is for temporary installation via about:debugging or submission to Mozilla. It is **not signed** and cannot be permanently installed in normal Firefox until Mozilla signs it.
- **SHA256SUMS.txt:** Checksums for both ZIPs.

Settings and user data are not included. No store accounts, signing secrets or deployment keys are used by this workflow. Download these packages from the Assets section below.
""")
