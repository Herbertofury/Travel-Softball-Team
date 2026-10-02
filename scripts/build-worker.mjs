import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'site.config.js'),'utf8'),context);
const assets={};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.ttf':'font/ttf','.png':'image/png','.webmanifest':'application/manifest+json'};
function include(name){const p=path.join(root,name);if(fs.statSync(p).isDirectory()){for(const f of fs.readdirSync(p))include(name+'/'+f);}else assets['/'+name]={type:types[path.extname(name)]||'application/octet-stream',data:fs.readFileSync(p).toString('base64')};}
for(const name of ['index.html','calendar.html','rsvp.html','connect-app.html','connect-app.js','privacy.html','delete-data.html','data-account.js','styles.css','calendar.css','app.js','calendar.js','site.config.js','assets'])include(name);
function includeMobile(relative=''){for(const file of fs.readdirSync(path.join(root,'mobile/www',relative),{withFileTypes:true})){const name=relative+file.name;if(file.isDirectory())includeMobile(name+'/');else assets['/mobile/'+name]={type:types[path.extname(name)]||'application/octet-stream',data:fs.readFileSync(path.join(root,'mobile/www',name)).toString('base64')};}}
includeMobile();assets['/app-sw.js']=assets['/mobile/sw.js'];
fs.rmSync(path.join(root,'dist'),{recursive:true,force:true});
fs.mkdirSync(path.join(root,'dist/server'),{recursive:true});fs.mkdirSync(path.join(root,'dist/.openai'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/server/index.js'),`const SITE=${JSON.stringify(context.window.SOFTBALL_SITE)};\nconst ASSETS=${JSON.stringify(assets)};\n`+fs.readFileSync(path.join(root,'worker/api.js'),'utf8'));
fs.copyFileSync(path.join(root,'.openai/hosting.json'),path.join(root,'dist/.openai/hosting.json'));
console.log(`Built native Worker with ${Object.keys(assets).length} embedded assets.`);
