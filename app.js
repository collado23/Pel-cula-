/* ===================================================================
   EXPLORADOR WEB, REPRODUCTOR, GRILLA, FILTROS, TMDB E INICIO
   =================================================================== */
async function explorePage(url) {
    const st = $('ex-status'), res = $('ex-results'), emp = $('ex-empty');
    st.classList.remove('hidden'); emp.classList.add('hidden'); res.innerHTML = '';
    const ghMatch = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (ghMatch) {
        const user = ghMatch[1], repo = ghMatch[2];
        $('ex-stmsg').textContent = `Buscando en repositorio ${user}/${repo}...`;
        try {
            const rootData = await fetchGithubFiles(user, repo, '');
            let allFiles = [...rootData];
            const subcarpetas = ['lists', 'm3u', 'iptv', 'channels', 'src', 'data', 'extras'];
            for (const sub of subcarpetas) {
                try { const subData = await fetchGithubFiles(user, repo, sub); if (subData.length) allFiles = allFiles.concat(subData); } catch(e) {}
            }
            const m3uFiles = allFiles.filter(f => f.name.match(/\.(m3u8?|M3U8?)$/i));
            st.classList.add('hidden');
            if (!m3uFiles.length) { emp.classList.remove('hidden'); return; }
            m3uFiles.forEach(file => {
                const link = file.download_url || file.html_url;
                const size = file.size ? fsz(file.size) : '';
                const el = document.createElement('div');
                el.className = 'link-found bg-card border border-bdr rounded-lg p-3 mb-2';
                el.innerHTML = `<div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center"><i class="fa-solid fa-file-code text-accent"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${file.name}</p>${size?`<p class="text-xs text-muted/50">${size}</p>`:''}</div><button class="ex-load-btn px-3 py-1.5 rounded-lg bg-accent text-white text-xs hover:bg-accent/90 transition">Cargar</button></div>`;
                el.querySelector('.ex-load-btn').addEventListener('click', ()=>{loadCust(link,file.name);cM('m-explorer')});
                res.appendChild(el);
            });
            return;
        } catch(e) { st.classList.add('hidden'); toast('Error al leer repositorio: '+e.message,'err'); return; }
    }
    $('ex-stmsg').textContent = 'Conectando con la pagina...';
    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const resp = await fetch(proxyUrl); if (!resp.ok) throw new Error(resp.status);
        const html = await resp.text(); const found = new Set(); let m;
        const hR = /href=["']([^"']*\.(m3u8?|M3U8?)[^"']*)["']/gi;
        while ((m = hR.exec(html)) !== null) found.add(new URL(m[1], url).href);
        st.classList.add('hidden');
        if (!found.size) { emp.classList.remove('hidden'); return; }
        [...found].forEach(link => {
            const fn = link.split('/').pop().split('?')[0] || 'Lista.m3u';
            const el = document.createElement('div');
            el.className = 'link-found bg-card border border-bdr rounded-lg p-3 mb-2';
            el.innerHTML = `<div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center"><i class="fa-solid fa-link text-accent"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${fn}</p><p class="text-xs text-muted/50 truncate">${link}</p></div><button class="ex-load-btn px-3 py-1.5 rounded-lg bg-accent text-white text-xs hover:bg-accent/90 transition">Cargar</button></div>`;
            el.querySelector('.ex-load-btn').addEventListener('click', ()=>{loadCust(link,fn);cM('m-explorer')});
            res.appendChild(el);
        });
    } catch(e) { st.classList.add('hidden'); toast('Error: '+e.message,'err'); }
}
async function fetchGithubFiles(user, repo, path) {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${path||''}`;
    const r = await fetch(url); if (!r.ok) throw new Error('No disponible'); return await r.json();
}

/* REPRODUCTOR HLS */
class RP{constructor(v){this.v=v;this.h=null;this.c=null;this.i=0;this.d=false}
play(c){this.x();this.d=false;this.c=c;this.i=0;this._t()}
_t(){if(this.d)return;if(typeof Hls==='undefined'){$('pfb').classList.add('hidden');this._e('Falta cargar librería HLS.js');return}
if(this.i>=this.c.urls.length){this._e('Todos los enlaces fallaron');$('pfb').classList.add('hidden');return}
const u=this.c.urls[this.i],fb=$('pfb');if(this.i>0){fb.classList.remove('hidden');fb.innerHTML=`<i class="fa-solid fa-rotate-right mr-1"></i> Probando ${this.i+1}/${this.c.urls.length}`}
if(Hls.isSupported()){this.h=new Hls({maxBufferLength:30,maxMaxBufferLength:60});this.h.loadSource(u);this.h.attachMedia(this.v);this.h.on(Hls.Events.MANIFEST_PARSED,()=>{fb.classList.add('hidden');$('vov').classList.add('hidden');this.v.play().catch(e=>console.log('Autoplay bloqueado'))});
this.h.on(Hls.Events.ERROR, (_,d)=>{if(d.fatal){this.h.destroy();this.i++;setTimeout(()=>this._t(),800)}})}
else if(this.v.canPlayType('application/vnd.apple.mpegurl')){this.v.src=u;this.v.addEventListener('loadedmetadata',()=>{fb.classList.add('hidden');$('vov').classList.add('hidden');this.v.play().catch(e=>{})}, {once:true});
this.v.addEventListener('error',()=>{this.i++;setTimeout(()=>this._t(),800)}, {once:true})}
else{this._e('Tu navegador no soporta reproducción');$('pfb').classList.add('hidden')}}
_e(m){$('vov').classList.remove('hidden');$('vomsg').textContent=m;toast(m,'err')}
x(){this.d=true;if(this.h)this.h.destroy();this.v.pause();this.v.src='';this.v.load();this.c=null}
}
function playCh(ch){const s=$('psec'),v=$('vid');s.classList.remove('hidden');s.scrollIntoView({behavior:'smooth',block:'start'});
$('vov').classList.remove('hidden');$('vomsg').textContent='Cargando stream...';$('pname').textContent=ch.name;$('pgrp').textContent=ch.arg?'🇦🇷 Argentina':ch.cat.toUpperCase();$('pfb').classList.add('hidden');
S.cur=ch;if(!pl)pl=new RP(v);pl.play(ch);$('npbar').classList.remove('hidden');$('npn').textContent=ch.name;uPF();rG()}
function stopP(){if(pl){pl.x();pl=null}$('psec').classList.add('hidden');$('npbar').classList.add('hidden');S.cur=null;rG()}

/* GRILLA Y FILTROS */
function gI(n){return n.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase().substring(0,2)}
function mC(ch,idx){const f=S.fav.includes(nm(ch.name)),p=S.cur&&nm(S.cur.name)===nm(ch.name);
const cc={deportes:'bg-emerald-500/15 text-emerald-400',peliculas:'bg-amber-500/15 text-amber-400',series:'bg-violet-500/15 text-violet-400',noticias:'bg-sky-500/15 text-sky-400',musica:'bg-pink-500/15 text-pink-400',infantil:'bg-lime-500/15 text-lime-400',documentales:'bg-teal-500/15 text-teal-400',entretenimiento:'bg-orange-500/15 text-orange-400',otros:'bg-gray-500/15 text-gray-400'}[ch.cat]||'bg-gray-500/15 text-gray-400';
const d=document.createElement('div');d.className=`cf group relative bg-card border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-accent/40 ${p?'border-accent ring-1 ring-accent/30':'border-bdr'}`;d.style.animationDelay=`${Math.min(idx*18,350)}ms`;
const logoHtml=ch.logo?`<img src="${ch.logo}" alt="${ch.name}" class="w-full h-full object-contain p-2 bg-white" onerror="this.parentElement.innerHTML='<span class=\\'text-xl font-bold text-muted\\'>${gI(ch.name)}</span>'">`:`<span class="text-xl font-bold text-muted">${gI(ch.name)}</span>`;
d.innerHTML=`<div class="aspect-video bg-bg/80 flex items-center justify-center relative overflow-hidden">${logoHtml}${p?`<div class="absolute top-2 left-2 flex items-center gap-1 bg-destructive/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>EN VIVO</div>`:''}${ch.arg?`<div class="absolute top-2 right-2 text-[10px] font-bold bg-sky-500/80 text-white px-1.5 py-0.5 rounded-full">🇦🇷</div>`:''}<div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"><div class="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center"><i class="fa-solid fa-play text-black ml-0.5"></i></div></div></div><div class="p-2"><p class="text-xs font-medium truncate leading-tight">${ch.name}</p><div class="flex items-center justify-between mt-1"><span class="text-[10px] px-1.5 py-0.5 rounded-full ${cc}">${ch.cat}</span>${ch.urls.length>1?`<span class="text-[9px] text-muted/50">x${ch.urls.length}</span>`:''}</div><button data-fav="${nm(ch.name)}" class="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all ${f?'text-red-500':''}"><i class="fa-solid fa-heart text-xs ${f?'':'fa-regular'}"></i></button></div>`;
d.addEventListener('click',e=>{if(!e.target.closest('button'))playCh(ch)});
d.querySelector('[data-fav]').addEventListener('click',e=>{e.stopPropagation();tF(nm(ch.name))});
return d;
}
function rG(){const g=$('grid'),em=$('emptystate'),lm=$('loadmore'),cn=$('gcount'),ti=$('gtitle');g.innerHTML='';
if(!S.fl.length){em.classList.remove('hidden');lm.classList.add('hidden');cn.textContent='0 canales';return}
em.classList.add('hidden');cn.textContent=S.fl.length+' canales';
ti.textContent=S.fov?'Mis favoritos':S.q?`Búsqueda: "${S.q}"`:S.cat==='all'?'Todos los canales':S.cat==='argentina'?'🇦🇷 Argentina':S.cat.charAt(0).toUpperCase()+S.cat.slice(1);
const end=Math.min(S.d,S.fl.length);const fr=document.createDocumentFragment();
for(let i=0;i<end;i++)fr.appendChild(mC(S.fl[i],i));g.appendChild(fr);
lm.classList.toggle('hidden',end>=S.fl.length)}
function applyF(){let temp=[...S.all];if(S.fov)temp=temp.filter(x=>S.fav.includes(nm(x.name)));if(S.cat==='argentina')temp=temp.filter(x=>x.arg);else if(S.cat!=='all')temp=temp.filter(x=>x.cat===S.cat);if(S.q){const q=nm(S.q);temp=temp.filter(x=>nm(x.name).includes(q)||nm(x.group||'').includes(q))}
S.fl=temp;S.d=S.pp;rG()}
function tF(k){const i=S.fav.indexOf(k);if(i>=0){S.fav.splice(i,1);toast('Quitado de favoritos','info')}else{S.fav.push(k);toast('Agregado a favoritos ❤️','ok')}localStorage.setItem('svf',JSON.stringify(S.fav));rG();uPF()}
function uFB(){const b=$('bfav');b.classList.toggle('bg-accent/20',S.fov);b.classList.toggle('text-accent',S.fov)}
function uPF(){const b=$('bfch');if(!S.cur)return;const f=S.fav.includes(nm(S.cur.name));b.innerHTML=`<i class="fa-${f?'solid':'regular'} fa-heart"></i>`;b.classList.toggle('text-red-500',f)}

/* ARCHIVOS LOCALES */
function initFH(){const dz=$('dropzone'),fi=$('fileinput'),fnm=$('filename'),fszEl=$('filesize'),frem=$('remfile'),fbtn=$('loadfile');
dz.addEventListener('click',()=>fi.click());
fi.addEventListener('change',e=>{if(e.target.files[0])hF(e.target.files[0])});
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('border-accent')});
dz.addEventListener('dragleave',()=>dz.classList.remove('border-accent'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('border-accent');if(e.dataTransfer.files[0])hF(e.dataTransfer.files[0])});
function hF(file){if(!file.name.match(/\.(m3u8?|txt)$/i)){toast('Solo archivos .m3u / .m3u8 / .txt','warn');return}
const r=new FileReader();r.onload=()=>{lft=r.result;lfn=file.name;fnm.textContent=file.name;fszEl.textContent=fsz(file.size);$('fileinfo').classList.remove('hidden');fbtn.disabled=false};r.onerror=()=>toast('Error al leer archivo','err');r.readAsText(file)}
frem.addEventListener('click',()=>{lft=null;lfn='';$('fileinfo').classList.add('hidden');fbtn.disabled=true;fi.value=''});
fbtn.addEventListener('click',()=>{if(!lft)return;cM('m-file');loadFT(lft,lfn);lft=null;lfn='';$('fileinfo').classList.add('hidden');fbtn.disabled=true;fi.value=''})}

/* TMDB */
const TMDB={key:localStorage.getItem('tmdbk')||'',base:'https://api.themoviedb.org/3',imgW:'https://image.tmdb.org/t/p/w342',
setKey(k){this.key=k;localStorage.setItem('tmdbk',k);this.updateUI()},
updateUI(){const st=$('tmdbkeystat'),si=$('tmdbsearch'),sel=$('tmdbtype');if(this.key){st.textContent='✅ Configurada';st.className='text-xs text-ok'}else{st.textContent='❌ Falta clave';st.className='text-xs text-err';si.disabled=true;sel.disabled=true;return}si.disabled=false;sel.disabled=false},
async search(q,type,page=1){if(!this.key)throw new Error('Ingresá tu API Key de TMDB');const t=type==='todo'?'multi':type;const r=await fetch(`${this.base}/search/${t}?api_key=${this.key}&query=${encodeURIComponent(q)}&language=es-ES&page=${page}`);if(!r.ok)throw new Error('Clave inválida o error de conexión');return await r.json()},
renderResults(res){const c=$('tmdbres'),emp=$('tmdbemp');c.innerHTML='';if(!res?.results?.length){emp.classList.remove('hidden');return}emp.classList.add('hidden');res.results.forEach(it=>{if(!it.poster_path)return;const isM=it.media_type==='movie'||!it.media_type;const ti=isM?it.title:it.name;const ye=(isM?it.release_date:it.first_air_date)?.substring(0,4)||'???';const el=document.createElement('div');el.className='rounded-lg overflow-hidden border border-bdr hover:border-accent transition-all cursor-pointer bg-card';el.innerHTML=`<div class="aspect-[2/3] bg-muted"><img src="${this.imgW}${it.poster_path}" alt="${ti}" class="w-full h-full object-cover" loading="lazy"></div><div class="p-2"><p class="text-xs font-medium truncate">${ti}</p><p class="text-[10px] text-muted">${ye} · ${isM?'Película':'Serie'}</p></div>`;
el.addEventListener('click',()=>{cM('m-tmdb');S.q=ti;$('sinput').value=ti;applyF();window.scrollTo({top:0,behavior:'smooth'})});
c.appendChild(el)})}};
function initTMDB(){TMDB.updateUI();$('savetmdbk').addEventListener('click',()=>{const k=$('tmdbkey').value.trim();if(!k){toast('Escribí tu API Key primero','warn');return}TMDB.setKey(k);toast('Clave guardada correctamente','ok')});
let tm;$('tmdbsearch').addEventListener('input',e=>{clearTimeout(tm);const q=e.target.value.trim();if(q.length<3){$('tmdbres').innerHTML='';$('tmdbemp').classList.add('hidden');return}tm=setTimeout(async()=>{$('tmdbemp').classList.add('hidden');$('tmdbres').innerHTML='<p class="text-center text-xs text-muted py-4">Buscando...</p>';try{const d=await TMDB.search(q,$('tmdbtype').value);TMDB.renderResults(d)}catch(e){$('tmdbres').innerHTML='';$('tmdbemp').classList.remove('hidden');$('tmdbemp').textContent=e.message;toast(e.message,'err')}},650)})}

/* INICIO GENERAL */
async function initApp(){if(S.ini)return;S.ini=true;
await loadAll();rG();rH();initFH();initTMDB();
$('sinput').addEventListener('input',e=>{S.q=e.target.value.trim();applyF()});
document.querySelectorAll('.catbtn').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.catbtn').forEach(x=>x.classList.remove('bg-accent/20','text-accent'));b.classList.add('bg-accent/20','text-accent');S.cat=b.dataset.cat;applyF()})});
$('bfav').addEventListener('click',()=>{S.fov=!S.fov;uFB();applyF()});
$('loadmore').addEventListener('click',()=>{S.d+=S.pp;rG()});
$('reloadall').addEventListener('click',async()=>{await loadAll(true);toast('Listas actualizadas','ok')});
console.log('✅ StreamVault cargado completamente')}
/* ===================================================================
   EXPLORADOR WEB, REPRODUCTOR, GRILLA, FILTROS, TMDB E INICIO
   =================================================================== */
async function explorePage(url) {
    const st = $('ex-status'), res = $('ex-results'), emp = $('ex-empty');
    st.classList.remove('hidden'); emp.classList.add('hidden'); res.innerHTML = '';
    const ghMatch = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
    if (ghMatch) {
        const user = ghMatch[1], repo = ghMatch[2];
        $('ex-stmsg').textContent = `Buscando en repositorio ${user}/${repo}...`;
        try {
            const rootData = await fetchGithubFiles(user, repo, '');
            let allFiles = [...rootData];
            const subcarpetas = ['lists', 'm3u', 'iptv', 'channels', 'src', 'data', 'extras'];
            for (const sub of subcarpetas) {
                try { const subData = await fetchGithubFiles(user, repo, sub); if (subData.length) allFiles = allFiles.concat(subData); } catch(e) {}
            }
            const m3uFiles = allFiles.filter(f => f.name.match(/\.(m3u8?|M3U8?)$/i));
            st.classList.add('hidden');
            if (!m3uFiles.length) { emp.classList.remove('hidden'); return; }
            m3uFiles.forEach(file => {
                const link = file.download_url || file.html_url;
                const size = file.size ? fsz(file.size) : '';
                const el = document.createElement('div');
                el.className = 'link-found bg-card border border-bdr rounded-lg p-3 mb-2';
                el.innerHTML = `<div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center"><i class="fa-solid fa-file-code text-accent"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${file.name}</p>${size?`<p class="text-xs text-muted/50">${size}</p>`:''}</div><button class="ex-load-btn px-3 py-1.5 rounded-lg bg-accent text-white text-xs hover:bg-accent/90 transition">Cargar</button></div>`;
                el.querySelector('.ex-load-btn').addEventListener('click', ()=>{loadCust(link,file.name);cM('m-explorer')});
                res.appendChild(el);
            });
            return;
        } catch(e) { st.classList.add('hidden'); toast('Error al leer repositorio: '+e.message,'err'); return; }
    }
    $('ex-stmsg').textContent = 'Conectando con la pagina...';
    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const resp = await fetch(proxyUrl); if (!resp.ok) throw new Error(resp.status);
        const html = await resp.text(); const found = new Set(); let m;
        const hR = /href=["']([^"']*\.(m3u8?|M3U8?)[^"']*)["']/gi;
        while ((m = hR.exec(html)) !== null) found.add(new URL(m[1], url).href);
        st.classList.add('hidden');
        if (!found.size) { emp.classList.remove('hidden'); return; }
        [...found].forEach(link => {
            const fn = link.split('/').pop().split('?')[0] || 'Lista.m3u';
            const el = document.createElement('div');
            el.className = 'link-found bg-card border border-bdr rounded-lg p-3 mb-2';
            el.innerHTML = `<div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center"><i class="fa-solid fa-link text-accent"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${fn}</p><p class="text-xs text-muted/50 truncate">${link}</p></div><button class="ex-load-btn px-3 py-1.5 rounded-lg bg-accent text-white text-xs hover:bg-accent/90 transition">Cargar</button></div>`;
            el.querySelector('.ex-load-btn').addEventListener('click', ()=>{loadCust(link,fn);cM('m-explorer')});
            res.appendChild(el);
        });
    } catch(e) { st.classList.add('hidden'); toast('Error: '+e.message,'err'); }
}
async function fetchGithubFiles(user, repo, path) {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/${path||''}`;
    const r = await fetch(url); if (!r.ok) throw new Error('No disponible'); return await r.json();
}

/* REPRODUCTOR HLS */
class RP{constructor(v){this.v=v;this.h=null;this.c=null;this.i=0;this.d=false}
play(c){this.x();this.d=false;this.c=c;this.i=0;this._t()}
_t(){if(this.d)return;if(typeof Hls==='undefined'){$('pfb').classList.add('hidden');this._e('Falta cargar librería HLS.js');return}
if(this.i>=this.c.urls.length){this._e('Todos los enlaces fallaron');$('pfb').classList.add('hidden');return}
const u=this.c.urls[this.i],fb=$('pfb');if(this.i>0){fb.classList.remove('hidden');fb.innerHTML=`<i class="fa-solid fa-rotate-right mr-1"></i> Probando ${this.i+1}/${this.c.urls.length}`}
if(Hls.isSupported()){this.h=new Hls({maxBufferLength:30,maxMaxBufferLength:60});this.h.loadSource(u);this.h.attachMedia(this.v);this.h.on(Hls.Events.MANIFEST_PARSED,()=>{fb.classList.add('hidden');$('vov').classList.add('hidden');this.v.play().catch(e=>console.log('Autoplay bloqueado'))});
this.h.on(Hls.Events.ERROR, (_,d)=>{if(d.fatal){this.h.destroy();this.i++;setTimeout(()=>this._t(),800)}})}
else if(this.v.canPlayType('application/vnd.apple.mpegurl')){this.v.src=u;this.v.addEventListener('loadedmetadata',()=>{fb.classList.add('hidden');$('vov').classList.add('hidden');this.v.play().catch(e=>{})}, {once:true});
this.v.addEventListener('error',()=>{this.i++;setTimeout(()=>this._t(),800)}, {once:true})}
else{this._e('Tu navegador no soporta reproducción');$('pfb').classList.add('hidden')}}
_e(m){$('vov').classList.remove('hidden');$('vomsg').textContent=m;toast(m,'err')}
x(){this.d=true;if(this.h)this.h.destroy();this.v.pause();this.v.src='';this.v.load();this.c=null}
}
function playCh(ch){const s=$('psec'),v=$('vid');s.classList.remove('hidden');s.scrollIntoView({behavior:'smooth',block:'start'});
$('vov').classList.remove('hidden');$('vomsg').textContent='Cargando stream...';$('pname').textContent=ch.name;$('pgrp').textContent=ch.arg?'🇦🇷 Argentina':ch.cat.toUpperCase();$('pfb').classList.add('hidden');
S.cur=ch;if(!pl)pl=new RP(v);pl.play(ch);$('npbar').classList.remove('hidden');$('npn').textContent=ch.name;uPF();rG()}
function stopP(){if(pl){pl.x();pl=null}$('psec').classList.add('hidden');$('npbar').classList.add('hidden');S.cur=null;rG()}

/* GRILLA Y FILTROS */
function gI(n){return n.split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase().substring(0,2)}
function mC(ch,idx){const f=S.fav.includes(nm(ch.name)),p=S.cur&&nm(S.cur.name)===nm(ch.name);
const cc={deportes:'bg-emerald-500/15 text-emerald-400',peliculas:'bg-amber-500/15 text-amber-400',series:'bg-violet-500/15 text-violet-400',noticias:'bg-sky-500/15 text-sky-400',musica:'bg-pink-500/15 text-pink-400',infantil:'bg-lime-500/15 text-lime-400',documentales:'bg-teal-500/15 text-teal-400',entretenimiento:'bg-orange-500/15 text-orange-400',otros:'bg-gray-500/15 text-gray-400'}[ch.cat]||'bg-gray-500/15 text-gray-400';
const d=document.createElement('div');d.className=`cf group relative bg-card border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-accent/40 ${p?'border-accent ring-1 ring-accent/30':'border-bdr'}`;d.style.animationDelay=`${Math.min(idx*18,350)}ms`;
const logoHtml=ch.logo?`<img src="${ch.logo}" alt="${ch.name}" class="w-full h-full object-contain p-2 bg-white" onerror="this.parentElement.innerHTML='<span class=\\'text-xl font-bold text-muted\\'>${gI(ch.name)}</span>'">`:`<span class="text-xl font-bold text-muted">${gI(ch.name)}</span>`;
d.innerHTML=`<div class="aspect-video bg-bg/80 flex items-center justify-center relative overflow-hidden">${logoHtml}${p?`<div class="absolute top-2 left-2 flex items-center gap-1 bg-destructive/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>EN VIVO</div>`:''}${ch.arg?`<div class="absolute top-2 right-2 text-[10px] font-bold bg-sky-500/80 text-white px-1.5 py-0.5 rounded-full">🇦🇷</div>`:''}<div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"><div class="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center"><i class="fa-solid fa-play text-black ml-0.5"></i></div></div></div><div class="p-2"><p class="text-xs font-medium truncate leading-tight">${ch.name}</p><div class="flex items-center justify-between mt-1"><span class="text-[10px] px-1.5 py-0.5 rounded-full ${cc}">${ch.cat}</span>${ch.urls.length>1?`<span class="text-[9px] text-muted/50">x${ch.urls.length}</span>`:''}</div><button data-fav="${nm(ch.name)}" class="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all ${f?'text-red-500':''}"><i class="fa-solid fa-heart text-xs ${f?'':'fa-regular'}"></i></button></div>`;
d.addEventListener('click',e=>{if(!e.target.closest('button'))playCh(ch)});
d.querySelector('[data-fav]').addEventListener('click',e=>{e.stopPropagation();tF(nm(ch.name))});
return d;
}
function rG(){const g=$('grid'),em=$('emptystate'),lm=$('loadmore'),cn=$('gcount'),ti=$('gtitle');g.innerHTML='';
if(!S.fl.length){em.classList.remove('hidden');lm.classList.add('hidden');cn.textContent='0 canales';return}
em.classList.add('hidden');cn.textContent=S.fl.length+' canales';
ti.textContent=S.fov?'Mis favoritos':S.q?`Búsqueda: "${S.q}"`:S.cat==='all'?'Todos los canales':S.cat==='argentina'?'🇦🇷 Argentina':S.cat.charAt(0).toUpperCase()+S.cat.slice(1);
const end=Math.min(S.d,S.fl.length);const fr=document.createDocumentFragment();
for(let i=0;i<end;i++)fr.appendChild(mC(S.fl[i],i));g.appendChild(fr);
lm.classList.toggle('hidden',end>=S.fl.length)}
function applyF(){let temp=[...S.all];if(S.fov)temp=temp.filter(x=>S.fav.includes(nm(x.name)));if(S.cat==='argentina')temp=temp.filter(x=>x.arg);else if(S.cat!=='all')temp=temp.filter(x=>x.cat===S.cat);if(S.q){const q=nm(S.q);temp=temp.filter(x=>nm(x.name).includes(q)||nm(x.group||'').includes(q))}
S.fl=temp;S.d=S.pp;rG()}
function tF(k){const i=S.fav.indexOf(k);if(i>=0){S.fav.splice(i,1);toast('Quitado de favoritos','info')}else{S.fav.push(k);toast('Agregado a favoritos ❤️','ok')}localStorage.setItem('svf',JSON.stringify(S.fav));rG();uPF()}
function uFB(){const b=$('bfav');b.classList.toggle('bg-accent/20',S.fov);b.classList.toggle('text-accent',S.fov)}
function uPF(){const b=$('bfch');if(!S.cur)return;const f=S.fav.includes(nm(S.cur.name));b.innerHTML=`<i class="fa-${f?'solid':'regular'} fa-heart"></i>`;b.classList.toggle('text-red-500',f)}

/* ARCHIVOS LOCALES */
function initFH(){const dz=$('dropzone'),fi=$('fileinput'),fnm=$('filename'),fszEl=$('filesize'),frem=$('remfile'),fbtn=$('loadfile');
dz.addEventListener('click',()=>fi.click());
fi.addEventListener('change',e=>{if(e.target.files[0])hF(e.target.files[0])});
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('border-accent')});
dz.addEventListener('dragleave',()=>dz.classList.remove('border-accent'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('border-accent');if(e.dataTransfer.files[0])hF(e.dataTransfer.files[0])});
function hF(file){if(!file.name.match(/\.(m3u8?|txt)$/i)){toast('Solo archivos .m3u / .m3u8 / .txt','warn');return}
const r=new FileReader();r.onload=()=>{lft=r.result;lfn=file.name;fnm.textContent=file.name;fszEl.textContent=fsz(file.size);$('fileinfo').classList.remove('hidden');fbtn.disabled=false};r.onerror=()=>toast('Error al leer archivo','err');r.readAsText(file)}
frem.addEventListener('click',()=>{lft=null;lfn='';$('fileinfo').classList.add('hidden');fbtn.disabled=true;fi.value=''});
fbtn.addEventListener('click',()=>{if(!lft)return;cM('m-file');loadFT(lft,lfn);lft=null;lfn='';$('fileinfo').classList.add('hidden');fbtn.disabled=true;fi.value=''})}

/* TMDB */
const TMDB={key:localStorage.getItem('tmdbk')||'',base:'https://api.themoviedb.org/3',imgW:'https://image.tmdb.org/t/p/w342',
setKey(k){this.key=k;localStorage.setItem('tmdbk',k);this.updateUI()},
updateUI(){const st=$('tmdbkeystat'),si=$('tmdbsearch'),sel=$('tmdbtype');if(this.key){st.textContent='✅ Configurada';st.className='text-xs text-ok'}else{st.textContent='❌ Falta clave';st.className='text-xs text-err';si.disabled=true;sel.disabled=true;return}si.disabled=false;sel.disabled=false},
async search(q,type,page=1){if(!this.key)throw new Error('Ingresá tu API Key de TMDB');const t=type==='todo'?'multi':type;const r=await fetch(`${this.base}/search/${t}?api_key=${this.key}&query=${encodeURIComponent(q)}&language=es-ES&page=${page}`);if(!r.ok)throw new Error('Clave inválida o error de conexión');return await r.json()},
renderResults(res){const c=$('tmdbres'),emp=$('tmdbemp');c.innerHTML='';if(!res?.results?.length){emp.classList.remove('hidden');return}emp.classList.add('hidden');res.results.forEach(it=>{if(!it.poster_path)return;const isM=it.media_type==='movie'||!it.media_type;const ti=isM?it.title:it.name;const ye=(isM?it.release_date:it.first_air_date)?.substring(0,4)||'???';const el=document.createElement('div');el.className='rounded-lg overflow-hidden border border-bdr hover:border-accent transition-all cursor-pointer bg-card';el.innerHTML=`<div class="aspect-[2/3] bg-muted"><img src="${this.imgW}${it.poster_path}" alt="${ti}" class="w-full h-full object-cover" loading="lazy"></div><div class="p-2"><p class="text-xs font-medium truncate">${ti}</p><p class="text-[10px] text-muted">${ye} · ${isM?'Película':'Serie'}</p></div>`;
el.addEventListener('click',()=>{cM('m-tmdb');S.q=ti;$('sinput').value=ti;applyF();window.scrollTo({top:0,behavior:'smooth'})});
c.appendChild(el)})}};
function initTMDB(){TMDB.updateUI();$('savetmdbk').addEventListener('click',()=>{const k=$('tmdbkey').value.trim();if(!k){toast('Escribí tu API Key primero','warn');return}TMDB.setKey(k);toast('Clave guardada correctamente','ok')});
let tm;$('tmdbsearch').addEventListener('input',e=>{clearTimeout(tm);const q=e.target.value.trim();if(q.length<3){$('tmdbres').innerHTML='';$('tmdbemp').classList.add('hidden');return}tm=setTimeout(async()=>{$('tmdbemp').classList.add('hidden');$('tmdbres').innerHTML='<p class="text-center text-xs text-muted py-4">Buscando...</p>';try{const d=await TMDB.search(q,$('tmdbtype').value);TMDB.renderResults(d)}catch(e){$('tmdbres').innerHTML='';$('tmdbemp').classList.remove('hidden');$('tmdbemp').textContent=e.message;toast(e.message,'err')}},650)})}

/* INICIO GENERAL */
async function initApp(){if(S.ini)return;S.ini=true;
await loadAll();rG();rH();initFH();initTMDB();
$('sinput').addEventListener('input',e=>{S.q=e.target.value.trim();applyF()});
document.querySelectorAll('.catbtn').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.catbtn').forEach(x=>x.classList.remove('bg-accent/20','text-accent'));b.classList.add('bg-accent/20','text-accent');S.cat=b.dataset.cat;applyF()})});
$('bfav').addEventListener('click',()=>{S.fov=!S.fov;uFB();applyF()});
$('loadmore').addEventListener('click',()=>{S.d+=S.pp;rG()});
$('reloadall').addEventListener('click',async()=>{await loadAll(true);toast('Listas actualizadas','ok')});
console.log('✅ StreamVault cargado completamente')}
