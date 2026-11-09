// Deterministic format generation: no bundler or runtime dependency.
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(base,'scripts/three-scene-debugger.js'),'utf8');
const marker="'use strict';",start=source.indexOf(marker),end=source.lastIndexOf('Object.assign(publicApi,{createSceneDebugger,VERSION});');
if(start<0||end<0)throw Error('Unexpected UMD layout');
fs.mkdirSync(path.join(base,'dist'),{recursive:true});
fs.writeFileSync(path.join(base,'dist/three-scene-debugger.js'),source);
fs.writeFileSync(path.join(base,'dist/three-scene-debugger.mjs'),"const globalRoot = null;\n"+source.slice(start,end)+'export {createSceneDebugger,VERSION};\n');
console.log('Built UMD + named-export ESM');
