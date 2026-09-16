import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const files=new Map([['/','index.html'],['/index.html','index.html'],['/style.css','style.css'],['/src/app.mjs','src/app.mjs'],['/src/board.mjs','src/board.mjs']]);
createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
  const file=files.get(path);
  if(!file){res.writeHead(404);return res.end('Not found');}
  try{
    const body=await readFile(new URL(file,import.meta.url));
    res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript',
      'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'"});
    res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(500);res.end('Unable to read application file');}
}).listen(4173,'127.0.0.1',()=>console.log('Focusboard: http://127.0.0.1:4173'));
