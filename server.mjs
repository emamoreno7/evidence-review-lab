import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const assets = new Map([['/', ['index.html','text/html']], ['/index.html',['index.html','text/html']], ['/style.css',['style.css','text/css']], ...['app','policy','fixtures'].map(n=>[`/src/${n}.mjs`, [`src/${n}.mjs`,'text/javascript']])]);
const port = 4173;
createServer(async (req,res)=>{
  const asset = assets.get(req.url);
  if (req.method !== 'GET' || !asset) {res.writeHead(404);res.end('Not found');return;}
  try {
    const data = await readFile(new URL(asset[0],import.meta.url));
    res.writeHead(200,{'Content-Type':`${asset[1]}; charset=utf-8`,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(data);
  } catch {res.writeHead(500);res.end('Could not read demo asset');}
}).listen(port,'127.0.0.1',()=>console.log(`Evidence Review Lab: http://127.0.0.1:${port}`));
