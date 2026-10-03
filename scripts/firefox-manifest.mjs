import {readFile,writeFile} from 'node:fs/promises';
const manifestPath=new URL('../dist-firefox/manifest.json',import.meta.url);
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
manifest.browser_specific_settings={gecko:{id:'{c7e8c038-592f-4f9e-a7a2-8a38d953e77d}',strict_min_version:'140.0',data_collection_permissions:{required:['searchTerms']}}};
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Firefox Manifest V3 generated (Firefox desktop 140+).');
