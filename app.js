/* ===================================================================
   StreamVault - App Principal
   Incluye: lock/PIN, parser M3U, reproductor HLS, filtros,
   editor propio, explorador web, historial, y BUSCADOR TMDB
   =================================================================== */

/* === Utilidades generales === */
function $(id) { return document.getElementById(id); }

function toast(m, t) {
    const c = $('toasts');
    const cs = { info:'border-accent bg-accent/10 text-accent', ok:'border-ok bg-ok/10 text-ok', err:'border-err bg-err/10 text-err', warn:'border-warn bg-warn/10 text-warn' };
    const is = { info:'fa-circle-info', ok:'fa-circle-check', err:'fa-circle-xmark', warn:'fa-triangle-exclamation' };
    const e = document.createElement('div');
    e.className = `ti flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium ${cs[t||'info']}`;
    e.innerHTML = `<i class="fa-solid ${is[t||'info']}"></i><span>${m}</span>`;
    c.appendChild(e);
    setTimeout(() => { e.classList.replace('ti','to'); setTimeout(() => e.remove(), 300); }, 3500);
}

function oM(id) { $(id).classList.add('on'); }
function cM(id) { $(id).classList.remove('on'); }

function nm(s) { return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }
function fsz(b) { if(b<1024) return b+' B'; if(b<1048576) return (b/1024).toFixed(1)+' KB'; return (b/1048576).toFixed(1)+' MB'; }
function uid() { return Date.now().toString(36)+Math.random().toString(36).substr(2,5); }

/* ===================================================================
   SISTEMA DE CLAVE (PIN con SHA-256)
   =================================================================== */
async function sha(s) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('');
}

const PN = { v:'', m:'login', l:true, a:0 };

function initLock() {
    const s = localStorage.getItem('svp'), t = $('lkt'), b = $('lks');
    if (s) {
        PN.m = 'login'; t.textContent = 'StreamVault'; b.textContent = 'Ingresá tu clave';
    } else {
        PN.m = 'setup'; t.textContent = 'Crear clave'; b.textContent = 'Elegí un PIN de 4 digitos';
        document.querySelector('.lk').innerHTML = '<i class="fa-solid fa-lock-open"></i>';
    }
    document.querySelectorAll('#keypad .kb').forEach(e => e.addEventListener('click', () => hK(e.dataset.k)));
    document.addEventListener('keydown', e => {
        if (!PN.l) return;
        if (e.key >= '0' && e.key <= '9') hK(e.key);
        else if (e.key === 'Backspace') hK('d');
    });
}

async function hK(k) {
    if (!PN.l) return;
    $('lke').style.opacity = '0';
    if (k === 'd') { PN.v = PN.v.slice(0,-1); uD(); return; }
    if (/^\d$/.test(k) && PN.v.length < 4) { PN.v += k; uD(); if (PN.v.length === 4) setTimeout(sP, 200); }
}

function uD() {
    document.querySelectorAll('#pind .pd').forEach((d, i) => { d.className = 'pd' + (i < PN.v.length ? ' f' : ''); });
}

async function sP() {
    const h = await sha(PN.v), er = $('lke'), ds = document.querySelectorAll('#pind .pd');
    if (PN.m === 'setup') {
        localStorage.setItem('svp', h); unl();
    } else if (h === localStorage.getItem('svp')) {
        PN.a = 0; unl();
    } else {
        PN.a++;
        ds.forEach(d => { d.className = 'pd e'; });
        er.textContent = PN.a >= 3 ? 'Demasiados intentos.' : 'Clave incorrecta';
        er.style.opacity = '1';
        setTimeout(() => { PN.v = ''; uD(); }, 600);
    }
}

function unl() {
    PN.l = false;
    $('lock-screen').classList.add('out');
    setTimeout(() => { $('lock-screen').style.display = 'none'; showApp(); }, 500);
}

function lockApp() {
    if (pl) { pl.x(); pl = null; }
    PN.l = true; PN.v = ''; PN.a = 0; uD(); $('lke').style.opacity = '0';
    $('lock-screen').style.display = 'flex';
    setTimeout(() => $('lock-screen').classList.remove('out'), 50);
    if (localStorage.getItem('svp')) {
        PN.m = 'login'; $('lkt').textContent = 'StreamVault'; $('lks').textContent = 'Ingresá tu clave';
        document.querySelector('.lk').innerHTML = '<i class="fa-solid fa-lock"></i>';
    }
    ['hdr','mainc','ftr'].forEach(i => $(i).style.display = 'none');
    $('psec').classList.add('hidden'); $('npbar').classList.add('hidden');
}

function showApp() { ['hdr','mainc','ftr'].forEach(i => $(i).style.display = ''); initApp(); }

/* ===================================================================
   ESTADO GLOBAL
   =================================================================== */
const DL = [
    {i:'ar',n:'Argentina',u:'https://iptv-org.github.io/iptv/countries/ar.m3u'},
    {i:'sa',n:'Sudamerica',u:'https://iptv-org.github.io/iptv/regions/south-america.m3u'},
    {i:'la',n:'Latinoamerica',u:'https://iptv-org.github.io/iptv/regions/latin-america.m3u'},
    {i:'sp',n:'Espanol',u:'https://iptv-org.github.io/iptv/languages/spa.m3u'},
    {i:'ds',n:'Deportes',u:'https://iptv-org.github.io/iptv/categories/sports.m3u'},
    {i:'mv',n:'Peliculas',u:'https://iptv-org.github.io/iptv/categories/movies.m3u'},
    {i:'nw',n:'Noticias',u:'https://iptv-org.github.io/iptv/categories/news.m3u'},
    {i:'en',n:'Entretenimiento',u:'https://iptv-org.github.io/iptv/categories/entertainment.m3u'},
    {i:'mu',n:'Musica',u:'https://iptv-org.github.io/iptv/categories/music.m3u'},
    {i:'ki',n:'Infantil',u:'https://iptv-org.github.io/iptv/categories/kids.m3u'},
    {i:'dc',n:'Documentales',u:'https://iptv-org.github.io/iptv/categories/documentary.m3u'}
];

/* Palabras clave para detectar canales argentinos */
const AK = ['argentina','america tv','telefe','canal 13','elnueve','canal 9','canal 7','publica','tyc sports','fox sports argentina','espn argentina','depotv','flow','telecentro','cronica','canal 26','a24','ln+','cablenoticias','cn23','misiones','formosa','cordoba','rosario','mendoza','tucuman','salta','net tv','magazine','panamericana'];

/* Categorias basadas en palabras clave */
const CK = {
    deportes:['deporte','sports','futbol','football','soccer','nba','nfl','f1','formula','tenis','boxeo','wwe','ufc','motor','racing','bein','espn','fox sport','tyc sport','directv sport'],
    peliculas:['pelicula','movie','film','cinema','cine','amc','star cinema','golden','paramount'],
    series:['serie','series','show','sitcom','comedia','drama'],
    noticias:['noticia','news','24h','24 hor','cnne','telefe','milenio','adn40','cronica','canal 26','a24','ln+','cable','cn23'],
    musica:['musica','music','mtv','vh1','hit','radio','concert','banda','rock','pop','jazz'],
    infantil:['infantil','kids','children','nickelodeon','cartoon','disney channel','anime','boomerang','baby','nick','pj mask','paw patrol'],
    documentales:['documental','documentary','discovery','nat geo','national geographic','history','historia','animal','natura'],
    entretenimiento:['entretenimiento','entertainment','reality','variedad','programa','concurso','televisa','univision','magazine']
};

const S = {
    all:[], fl:[], cat:'all', q:'', fov:false,
    fav: JSON.parse(localStorage.getItem('svf') || '[]'),
    d:0, pp:48, cur:null, ini:false
};

let lft = null, lfn = '', editingId = null;

/* ===================================================================
   EDITOR PROPIO (listas M3U guardadas en localStorage)
   =================================================================== */
function gEd() { return JSON.parse(localStorage.getItem('sve') || '[]'); }
function sEd(list) { localStorage.setItem('sve', JSON.stringify(list)); }

function rEdList() {
    const list = gEd(), el = $('ed-list');
    if (!list.length) { el.innerHTML = '<p class="text-muted/50 text-xs text-center py-4">No hay listas guardadas. Creá una nueva.</p>'; return; }
    el.innerHTML = '';
    list.forEach(item => {
        const ch = pM(item.text, 'e').length;
        const d = document.createElement('div');
        d.className = 'ed-item flex items-center gap-3 p-2.5 rounded-lg border border-bdr' + (editingId === item.id ? ' active' : '');
        d.innerHTML = `<div class="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0"><i class="fa-solid fa-file-lines text-accent text-xs"></i></div><div class="flex-1 min-w-0"><p class="text-xs font-medium truncate">${item.name}</p><p class="text-[10px] text-muted/50">${ch} canales &middot; ${new Date(item.date).toLocaleDateString('es')}</p></div><div class="flex gap-1 shrink-0"><button class="ed-load-btn w-7 h-7 rounded-md hover:bg-accent/20 flex items-center justify-center text-muted hover:text-accent transition text-xs" title="Cargar"><i class="fa-solid fa-play"></i></button><button class="ed-edit-btn w-7 h-7 rounded-md hover:bg-card flex items-center justify-center text-muted hover:text-txt transition text-xs" title="Editar"><i class="fa-solid fa-pen"></i></button></div>`;
        d.querySelector('.ed-load-btn').addEventListener('click', e => { e.stopPropagation(); loadFT(item.text, item.name); cM('m-editor'); });
        d.querySelector('.ed-edit-btn').addEventListener('click', e => { e.stopPropagation(); openEditor(item.id); });
        d.addEventListener('click', () => openEditor(item.id));
        el.appendChild(d);
    });
}

function openEditor(id) {
    const list = gEd();
    editingId = id;
    rEdList();
    const area = $('ed-area');
    area.classList.remove('hidden');
    if (id) {
        const item = list.find(x => x.id === id);
        if (item) { $('ed-name').value = item.name; $('ed-text').value = item.text; updEdCount(); }
    } else {
        $('ed-name').value = ''; $('ed-text').value = '';
        $('ed-count').textContent = 'Sin contenido'; $('ed-del').classList.add('hidden');
    }
}

function updEdCount() {
    const t = $('ed-text').value.trim();
    if (!t) { $('ed-count').textContent = 'Sin contenido'; return; }
    const urls = t.split('\n').filter(l => l.trim().startsWith('http')).length;
    const exts = t.split('\n').filter(l => l.trim().startsWith('#EXTINF')).length;
    $('ed-count').textContent = `${exts} canales / ${urls} enlaces`;
}

/* ===================================================================
   HISTORIAL de listas cargadas
   =================================================================== */
function gH() { return JSON.parse(localStorage.getItem('svh') || '[]'); }
function aH(n, u, c) {
    const h = gH(); h.unshift({n, u, c, t:Date.now()});
    if (h.length > 20) h.length = 20;
    localStorage.setItem('svh', JSON.stringify(h)); rH();
}

function rH() {
    const h = gH(), s = $('histsec'), l = $('histlist');
    if (!h.length) { s.classList.add('hidden'); return; }
    s.classList.remove('hidden'); l.innerHTML = '';
    h.forEach(i => {
        const e = document.createElement('button');
        e.className = 'hi shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-bdr text-left';
        e.innerHTML = `<div class="w-7 h-7 rounded-md bg-accent/15 flex items-center justify-center shrink-0"><i class="fa-solid fa-list text-accent text-[10px]"></i></div><div class="min-w-0"><p class="text-[11px] font-medium truncate max-w-[120px]">${i.n}</p><p class="text-[9px] text-muted/50">${i.c} canales</p></div>`;
        if (i.u !== 'archivo-local') e.addEventListener('click', () => loadCust(i.u, i.n));
        l.appendChild(e);
    });
}

/* ===================================================================
   PARSER M3U
   =================================================================== */
function pM(t, sid) {
    const ls = t.split('\n'), ch = []; let c = null;
    for (const r of ls) {
        const l = r.trim();
        if (!l) continue;
        if (l.startsWith('#EXTINF:')) {
            c = {};
            const lm = l.match(/tvg-logo="([^"]*)"/), gm = l.match(/group-title="([^"]*)"/), ci = l.lastIndexOf(',');
            c.logo = lm ? lm[1] : '';
            c.group = gm ? gm[1] : 'Otros';
            c.name = ci >= 0 ? l.substring(ci+1).trim() : 'Sin nombre';
            if (!c.name) c.name = 'Sin nombre';
        } else if (!l.startsWith('#') && c) {
            if (l.startsWith('http') || l.startsWith('rtmp') || l.startsWith('rtsp')) {
                c.url = l; c.sid = sid; ch.push(c);
            }
            c = null;
        }
    }
    return ch;
}

function iA(n, g) { const t = nm(n+' '+g); return AK.some(k => t.includes(nm(k))); }

function cl(n, g) {
    const t = nm(n+' '+g);
    for (const [c, ks] of Object.entries(CK))
        for (const k of ks)
            if (t.includes(nm(k))) return c;
    return 'otros';
}

/* Merge de listas: une canales por nombre normalizado */
function mg(ls) {
    const m = new Map();
    for (const l of ls) for (const c of l) {
        const k = nm(c.name);
        if (m.has(k)) {
            const e = m.get(k);
            if (!e.urls.includes(c.url)) e.urls.push(c.url);
            if (!e.logo && c.logo) e.logo = c.logo;
            if (c.sid === 'ar' && !e.arg) e.arg = iA(c.name, c.group);
        } else {
            m.set(k, { name:c.name, logo:c.logo, group:c.group, cat:cl(c.name,c.group), urls:[c.url], sid:c.sid, arg:c.sid==='ar'||iA(c.name,c.group) });
        }
    }
    return Array.from(m.values());
}

/* ===================================================================
   CARGA DE LISTAS
   =================================================================== */
async function loadAll(force) {
    const ck = 'sv2', ct = 'sv3';
    if (!force) {
        const c = sessionStorage.getItem(ck), ca = parseInt(sessionStorage.getItem(ct)||'0');
        if (c && Date.now()-ca < 30*60*1000) { S.all = JSON.parse(c); return S.all; }
    }
    const bar = $('loadbar'), st = $('loadst'), tot = DL.length;
    let d = 0;
    const res = await Promise.allSettled(DL.map(async l => {
        try {
            const r = await fetch(l.u);
            if (!r.ok) throw 0;
            const t = await r.text(), p = pM(t, l.i);
            d++; bar.style.width = `${(d/tot)*100}%`; st.textContent = `${l.n}: ${p.length}`;
            return p;
        } catch(e) { d++; bar.style.width = `${(d/tot)*100}%`; st.textContent = `${l.n}: -`; return []; }
    }));
    const al = [];
    for (const r of res) if (r.status === 'fulfilled' && r.value.length) al.push(r.value);
    S.all = mg(al);
    sessionStorage.setItem(ck, JSON.stringify(S.all));
    sessionStorage.setItem(ct, Date.now().toString());
    return S.all;
}

async function loadCust(url, ln) {
    toast('Cargando lista...', 'info');
    try {
        const r = await fetch(url);
        if (!r.ok) throw new Error(r.status);
        const t = await r.text(), p = pM(t, 'c');
        if (!p.length) throw new Error('Lista vacia');
        doM(p, ln || url.split('/').pop() || 'Lista');
        aH(ln || 'Lista', url, p.length);
        toast(`+${p.length} canales`, 'ok');
    } catch(e) { toast('Error: ' + e.message, 'err'); }
}

function loadFT(t, n) {
    const p = pM(t, 'f');
    if (!p.length) { toast('Sin canales validos', 'warn'); return; }
    doM(p, n); aH(n, 'archivo-local', p.length);
    toast(`+${p.length} canales de ${n}`, 'ok');
}

function doM(p, n) {
    const fm = new Map();
    for (const c of S.all) fm.set(nm(c.name), {...c});
    let a = 0;
    for (const c of p) {
        const k = nm(c.name);
        if (fm.has(k)) {
            const e = fm.get(k);
            if (!e.urls.includes(c.url)) { e.urls.push(c.url); a++; }
        } else {
            fm.set(k, { name:c.name, logo:c.logo, group:c.group, cat:cl(c.name,c.group), urls:[c.url], sid:'c', arg:iA(c.name,c.group) });
            a++;
        }
    }
    S.all = Array.from(fm.values());
    applyF();
}

/* ===================================================================
   EXPLORADOR WEB
   =================================================================== */
async function explorePage(url) {
    const st = $('ex-status'), res = $('ex-results'), emp = $('ex-empty');
    st.classList.remove('hidden'); emp.classList.add('hidden'); res.innerHTML = '';
    $('ex-stmsg').textContent = 'Conectando con la pagina...';

    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const resp = await fetch(proxyUrl);
        if (!resp.ok) throw new Error('No se pudo acceder a la pagina');
        $('ex-stmsg').textContent = 'Buscando archivos M3U...';
        const html = await resp.text();
        const found = new Set();

        // Buscar links href con .m3u/.m3u8
        let match;
        const hrefRe = /href=["']([^"']*(?:\.m3u8?|\.M3U8?)[^"']*)["']/gi;
        while ((match = hrefRe.exec(html)) !== null) found.add(match[1]);

        // URLs sueltas
        const urlRe = /https?:\/\/[^\s"'<>]+\.m3u8?[^\s"'<>]*/gi;
        while ((match = urlRe.exec(html)) !== null) found.add(match[0]);

        // raw.githubusercontent.com
        const rawRe = /https?:\/\/raw\.githubusercontent\.com\/[^\s"'<>]+/gi;
        while ((match = rawRe.exec(html)) !== null) {
            if (match[0].match(/\.(m3u8?|M3U8?)(\?|$)/)) found.add(match[0]);
        }

        st.classList.add('hidden');
        let links = [...found].filter(u => u.startsWith('http'));

        // Si es GitHub, buscar via API
        if (url.includes('github.com')) {
            const ghMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (ghMatch) {
                $('ex-stmsg').textContent = 'Tambien buscando via API de GitHub...';
                st.classList.remove('hidden');
                try {
                    const apiRes = await fetch(`https://api.github.com/repos/${ghMatch[1]}/${ghMatch[2]}/contents/`);
                    if (apiRes.ok) {
                        const files = await apiRes.json();
                        for (const f of files) {
                            if (f.name.endsWith('.m3u') || f.name.endsWith('.m3u8') || f.name.endsWith('.M3U')) {
                                if (f.download_url) links.push(f.download_url);
                            }
                        }
                    }
                } catch(e) {}
                st.classList.add('hidden');
            }
        }

        const unique = [...new Set(links)];
        if (!unique.length) { emp.classList.remove('hidden'); return; }

        res.innerHTML = '';
        unique.forEach(link => {
            const fileName = link.split('/').pop().split('?')[0];
            const el = document.createElement('div');
            el.className = 'link-found bg-card border border-bdr rounded-lg p-3';
            el.innerHTML = `<div class="flex items-start gap-3"><div class="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 mt-0.5"><i class="fa-solid fa-file-code text-accent text-sm"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${fileName}</p><p class="text-[10px] text-muted/60 truncate mt-0.5">${link}</p></div><button class="ex-load-btn shrink-0 px-3 py-1.5 rounded-lg bg-accent/15 text-accent text-xs font-medium hover:bg-accent/25 transition">Cargar</button></div>`;
            el.querySelector('.ex-load-btn').addEventListener('click', async () => {
                const btn = el.querySelector('.ex-load-btn');
                btn.innerHTML = '<i class="fa-solid fa-spinner spin"></i>'; btn.disabled = true;
                try {
                    const r = await fetch(link);
                    if (!r.ok) throw 0;
                    const t = await r.text(), p = pM(t, 'ex');
                    if (!p.length) throw 0;
                    doM(p, fileName); aH(fileName, link, p.length);
                    toast(`+${p.length} canales de ${fileName}`, 'ok');
                    btn.innerHTML = '<i class="fa-solid fa-check"></i>'; btn.classList.replace('text-accent','text-ok');
                } catch(e) { toast('Error al cargar','err'); btn.innerHTML = 'Cargar'; btn.disabled = false; }
            });
            res.appendChild(el);
        });
    } catch(e) {
        st.classList.add('hidden');
        toast('Error: ' + e.message, 'err');
        res.innerHTML = `<p class="text-err text-xs text-center py-4">No se pudo acceder. Probá copiar el contenido manualmente desde "Mi Editor" o "Pegar texto".</p>`;
    }
}

/* ===================================================================
   REPRODUCTOR HLS (con fallback de multiples enlaces)
   =================================================================== */
class RP {
    constructor(v) { this.v = v; this.h = null; this.c = null; this.i = 0; this.d = false; }

    play(c) { this.x(); this.d = false; this.c = c; this.i = 0; this._t(); }
    playUrl(u, n) { this.x(); this.d = false; this.c = {name:n||'Stream',group:'Manual',urls:[u],logo:''}; this.i = 0; this._t(); }

    _t() {
        if (this.d) return;
        if (this.i >= this.c.urls.length) { this._e('Todos los enlaces fallaron.'); $('pfb').classList.add('hidden'); return; }
        const u = this.c.urls[this.i], fb = $('pfb');
        if (this.i > 0) { fb.classList.remove('hidden'); fb.innerHTML = `<i class="fa-solid fa-rotate mr-1"></i>${this.i+1}/${this.c.urls.length}`; }

        if (Hls.isSupported()) {
            this.h = new Hls({ maxBufferLength:30, maxMaxBufferLength:60, startLevel:-1, fragLoadingTimeOut:15000, manifestLoadingTimeOut:15000, levelLoadingTimeOut:15000 });
            this.h.loadSource(u); this.h.attachMedia(this.v);
            this.h.on(Hls.Events.MANIFEST_PARSED, () => { if (!this.d) { this.v.play().catch(()=>{}); fb.classList.add('hidden'); $('vov').classList.add('hidden'); } });
            this.h.on(Hls.Events.ERROR, (_, d) => { if (this.d) return; if (d.fatal) { this.i++; if (this.h) this.h.destroy(); this.h = null; setTimeout(() => this._t(), 800); } });
        } else if (this.v.canPlayType('application/vnd.apple.mpegurl')) {
            this.v.src = u;
            this.v.addEventListener('loadeddata', () => { if (!this.d) { this.v.play().catch(()=>{}); fb.classList.add('hidden'); $('vov').classList.add('hidden'); } }, {once:true});
            this.v.addEventListener('error', () => { if (!this.d) { this.i++; setTimeout(() => this._t(), 800); } }, {once:true});
        } else { this._e('Sin soporte HLS'); }
    }

    _e(m) { $('vov').classList.remove('hidden'); $('vomsg').textContent = m; toast(m, 'err'); }
    x() { this.d = true; if (this.h) { this.h.destroy(); this.h = null; } this.v.src = ''; this.v.load(); this.c = null; }
}

let pl = null;

function playCh(ch) {
    const s = $('psec'), v = $('vid');
    s.classList.remove('hidden'); s.scrollIntoView({behavior:'smooth',block:'start'});
    $('vov').classList.remove('hidden'); $('vomsg').textContent = 'Cargando...';
    $('pname').textContent = ch.name;
    $('pgrp').textContent = ch.arg ? 'Argentina' : ch.cat;
    $('pfb').classList.add('hidden'); S.cur = ch;
    if (!pl) pl = new RP(v);
    pl.play(ch);
    $('npbar').classList.remove('hidden'); $('npn').textContent = ch.name;
    uPF(); rG();
}

function stopP() {
    if (pl) { pl.x(); pl = null; }
    $('psec').classList.add('hidden'); $('npbar').classList.add('hidden'); S.cur = null; rG();
}

/* ===================================================================
   RENDER DE GRILLA DE CANALES
   =================================================================== */
function gI(n) { return n.split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase().substring(0,2); }

function mC(ch, idx) {
    const f = S.fav.includes(nm(ch.name));
    const p = S.cur && nm(S.cur.name) === nm(ch.name);
    const cc = {
        deportes:'bg-emerald-500/15 text-emerald-400', peliculas:'bg-amber-500/15 text-amber-400',
        series:'bg-violet-500/15 text-violet-400', noticias:'bg-sky-500/15 text-sky-400',
        musica:'bg-pink-500/15 text-pink-400', infantil:'bg-lime-500/15 text-lime-400',
        documentales:'bg-teal-500/15 text-teal-400', entretenimiento:'bg-orange-500/15 text-orange-400',
        otros:'bg-gray-500/15 text-gray-400'
    }[ch.cat] || 'bg-gray-500/15 text-gray-400';

    const d = document.createElement('div');
    d.className = `cf group relative bg-card border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-accent/40 hover:bg-card-h ${p ? 'border-accent ring-1 ring-accent/30' : 'border-bdr'}`;
    d.style.animationDelay = `${Math.min(idx*20,400)}ms`;

    const logoHtml = ch.logo
        ? `<img src="${ch.logo}" alt="" class="w-full h-full object-contain p-3" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="absolute inset-0 items-center justify-center text-2xl font-display font-bold text-muted/40" style="display:none">${gI(ch.name)}</div>`
        : `<span class="text-2xl font-display font-bold text-muted/40">${gI(ch.name)}</span>`;

    const liveBadge = p ? '<div class="absolute top-2 left-2 flex items-center gap-1 bg-err/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-white live-dot"></span>VIVO</div>' : '';
    const arBadge = ch.arg ? `<div class="absolute top-2 left-2 bg-sky-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded" ${p?'style="left:auto;right:2px"':''}>AR</div>` : '';
    const favBtnTop = ch.arg && !p ? 'top-8' : '';

    d.innerHTML = `
        <div class="aspect-video bg-bg/60 flex items-center justify-center relative overflow-hidden">
            ${logoHtml}${liveBadge}${arBadge}
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${favBtnTop}">
                <button data-fav="${nm(ch.name)}" class="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-xs ${f?'text-err':'text-white/60 hover:text-err'}"><i class="fa-${f?'solid':'regular'} fa-heart"></i></button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
                <span class="text-[10px] text-accent font-medium"><i class="fa-solid fa-play mr-1"></i>Reproducir</span>
            </div>
        </div>
        <div class="p-2.5">
            <p class="text-xs font-medium truncate leading-tight">${ch.name}</p>
            <div class="flex items-center gap-1.5 mt-1.5">
                <span class="text-[10px] px-1.5 py-0.5 rounded-full ${cc}">${ch.cat}</span>
                <span class="text-[10px] text-muted/50">${ch.urls.length>1 ? ch.urls.length+' enl.' : ''}</span>
            </div>
        </div>`;

    d.addEventListener('click', e => { if (!e.target.closest('[data-fav]')) playCh(ch); });
    const fb = d.querySelector('[data-fav]');
    if (fb) fb.addEventListener('click', e => { e.stopPropagation(); tF(nm(ch.name)); });
    return d;
}

function rG() {
    const g = $('grid'), em = $('emptyst'), lm = $('lmwrap'), cn = $('gcount'), ti = $('gtitle');
    g.innerHTML = '';
    if (!S.fl.length) { em.classList.remove('hidden'); lm.classList.add('hidden'); cn.textContent = '0 canales'; return; }
    em.classList.add('hidden'); cn.textContent = S.fl.length + ' canales';
    if (S.fov) ti.textContent = 'Mis favoritos';
    else if (S.q) ti.textContent = `"${S.q}"`;
    else if (S.cat === 'all') ti.textContent = 'Todos los canales';
    else if (S.cat === 'argentina') ti.textContent = 'Canales de Argentina';
    else ti.textContent = S.cat.charAt(0).toUpperCase() + S.cat.slice(1);
    const end = Math.min(S.d, S.fl.length), fr = document.createDocumentFragment();
    S.fl.slice(0, end).forEach((c, i) => fr.appendChild(mC(c, i)));
    g.appendChild(fr);
    lm.classList.toggle('hidden', end >= S.fl.length);
}

/* ===================================================================
   FILTROS Y FAVORITOS
   =================================================================== */
function applyF() {
    let c = [...S.all];
    if (S.fov) c = c.filter(x => S.fav.includes(nm(x.name)));
    if (S.cat === 'argentina') c = c.filter(x => x.arg);
    else if (S.cat !== 'all') c = c.filter(x => x.cat === S.cat);
    if (S.q) { const q = nm(S.q); c = c.filter(x => nm(x.name).includes(q) || nm(x.group).includes(q)); }
    S.fl = c; S.d = S.pp; rG();
}

function tF(k) {
    const i = S.fav.indexOf(k);
    if (i >= 0) { S.fav.splice(i, 1); toast('Quitado', 'info'); }
    else { S.fav.push(k); toast('Favorito', 'ok'); }
    localStorage.setItem('svf', JSON.stringify(S.fav)); rG(); uFB(); uPF();
}

function uFB() {
    const b = $('bfav');
    b.classList.toggle('bg-accent/20', S.fov); b.classList.toggle('text-accent', S.fov);
    b.classList.toggle('border-accent/40', S.fov); b.classList.toggle('text-muted', !S.fov);
}

function uPF() {
    const b = $('bfch');
    if (!S.cur) return;
    const f = S.fav.includes(nm(S.cur.name));
    b.innerHTML = `<i class="fa-${f?'solid':'regular'} fa-heart"></i>`;
    b.className = `text-sm transition ${f?'text-err':'text-muted hover:text-accent'}`;
}

/* ===================================================================
   MANEJO DE ARCHIVOS LOCALES
   =================================================================== */
function initFH() {
    const dz = $('dropz'), fi = $('finp'), finfo = $('finfo'), fnm = $('fnm'), fszEl = $('fsz'), frem = $('frem'), fbtn = $('fl-go');

    dz.addEventListener('click', () => fi.click());
    fi.addEventListener('change', e => { if (e.target.files.length) hF(e.target.files[0]); });
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('do'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('do'));
    dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('do'); if (e.dataTransfer.files.length) hF(e.dataTransfer.files[0]); });

    function hF(file) {
        if (!file.name.toLowerCase().match(/\.(m3u8?|txt)$/)) { toast('Solo .m3u, .m3u8, .txt', 'warn'); return; }
        const reader = new FileReader();
        reader.onload = () => { lft = reader.result; lfn = file.name; fnm.textContent = file.name; fszEl.textContent = fsz(file.size); finfo.classList.remove('hidden'); fbtn.disabled = false; };
        reader.onerror = () => toast('Error al leer', 'err');
        reader.readAsText(file);
    }

    frem.addEventListener('click', () => { lft = null; lfn = ''; finfo.classList.add('hidden'); fbtn.disabled = true; fi.value = ''; });
    fbtn.addEventListener('click', () => {
        if (!lft) return;
        cM('m-file'); loadFT(lft, lfn);
        lft = null; lfn = ''; finfo.classList.add('hidden'); fbtn.disabled = true; fi.value = '';
    });
}

/* ===================================================================
   TMDB - BUSCADOR DE PELICULAS
   =================================================================== */
const TMDB = {
    key: localStorage.getItem('svtmdb') || '',
    base: 'https://api.themoviedb.org/3',
    imgW: 'https://image.tmdb.org/t/p/w342',
    imgO: 'https://image.tmdb.org/t/p/w780',
    /* Guardar clave */
    setKey(k) { this.key = k; localStorage.setItem('svtmdb', k); this.updateUI(); },
    /* Actualizar estado visual */
    updateUI() {
        const st = $('tmdb-key-status'), si = $('tmdb-search'), sel = $('tmdb-type');
        if (this.key) {
            st.textContent = 'Configurada'; st.className = 'text-[10px] px-2 py-0.5 rounded-full bg-ok/15 text-ok';
            si.disabled = false; sel.disabled = false;
        } else {
            st.textContent = 'Sin configurar'; st.className = 'text-[10px] px-2 py-0.5 rounded-full bg-err/15 text-err';
            si.disabled = true; sel.disabled = true;
        }
    },
    /* Buscar peliculas o series */
    async search(q, type, page) {
        if (!this.key) throw new Error('Sin API Key');
        const t = type === 'tv' ? 'tv' : 'movie';
        const r = await fetch(`${this.base}/search/${t}?query=${encodeURIComponent(q)}&api_key=${this.key}&language=es-ES&page=${page||1}&include_adult=false`);
        if (!r.ok) { const err = await r.json().catch(()=>({})); throw new Error(err.status_message || 'Error de TMDB'); }
        return r.json();
    },
    /* Busqueda multi (peliculas + series juntas) */
    async searchMulti(q, page) {
        if (!this.key) throw new Error('Sin API Key');
        const r = await fetch(`${this.base}/search/multi?query=${encodeURIComponent(q)}&api_key=${this.key}&language=es-ES&page=${page||1}&include_adult=false`);
        if (!r.ok) throw new Error('Error de TMDB');
        const data = await r.json();
        data.results = data.results.filter(i => i.media_type === 'movie' || i.media_type === 'tv');
        return data;
    },
    /* Listados: trending, popular, top_rated, now_playing, upcoming */
    async getList(tab, page) {
        if (!this.key) throw new Error('Sin API Key');
        const endpoints = {
            trending: `trending/all/week`,
            popular: `movie/popular`,
            top_rated: `movie/top_rated`,
            now_playing: `movie/now_playing`,
            upcoming: `movie/upcoming`
        };
        const r = await fetch(`${this.base}/${endpoints[tab]}?api_key=${this.key}&language=es-ES&page=${page||1}`);
        if (!r.ok) throw new Error('Error de TMDB');
        return r.json();
    },
    /* Detalle de pelicula */
    async getDetail(id, type) {
        if (!this.key) throw new Error('Sin API Key');
        const r = await fetch(`${this.base}/${type||'movie'}/${id}?api_key=${this.key}&language=es-ES&append_to_response=credits`);
        if (!r.ok) throw new Error('Error de TMDB');
        return r.json();
    },
    /* Renderizar resultados en la grilla */
    renderResults(results) {
        const container = $('tmdb-results'), empty = $('tmdb-empty');
        container.innerHTML = '';
        if (!results || !results.length) {
            empty.classList.remove('hidden'); $('tmdb-empty-msg').textContent = 'No se encontraron resultados';
            return;
        }
        empty.classList.add('hidden');

        results.forEach(item => {
            const isMovie = item.media_type === 'movie' || item.title;
            const title = isMovie ? item.title : item.name;
            const date = isMovie ? item.release_date : item.first_air_date;
            const year = date ? date.substring(0,4) : '?';
            const rating = item.vote_average ? item.vote_average.toFixed(1) : '-';
            const poster = item.poster_path ? this.imgW + item.poster_path : '';
            const type = isMovie ? 'movie' : 'tv';
            const id = item.id;

            const card = document.createElement('div');
            card.className = 'tmdb-card bg-card border border-bdr rounded-xl overflow-hidden';
            card.innerHTML = `
                <div class="aspect-[2/3] bg-bg/60 relative overflow-hidden">
                    ${poster ? `<img src="${poster}" alt="${title}" class="w-full h-full object-cover" loading="lazy">` : `<div class="w-full h-full flex items-center justify-center text-muted/30"><i class="fa-solid fa-film text-4xl"></i></div>`}
                    <div class="tmdb-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3">
                        <p class="text-[10px] text-accent font-medium mb-0.5">${isMovie ? 'Pelicula' : 'Serie'}</p>
                        <p class="text-xs font-semibold leading-tight">${title}</p>
                        <div class="flex items-center gap-2 mt-1.5">
                            <span class="text-[10px] text-muted">${year}</span>
                            <span class="text-[10px] text-accent"><i class="fa-solid fa-star mr-0.5"></i>${rating}</span>
                        </div>
                    </div>
                    ${rating !== '-' && parseFloat(rating) >= 7 ? '<div class="absolute top-2 right-2 bg-ok/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Top</div>' : ''}
                </div>`;

            card.addEventListener('click', () => TMDB.showDetail(id, type));
            container.appendChild(card);
        });
    },
    /* Mostrar detalle completo de una pelicula */
    async showDetail(id, type) {
        const container = $('tmdb-results'), detail = $('tmdb-detail'), loading = $('tmdb-loading');
        container.classList.add('hidden');
        detail.classList.add('hidden');
        loading.classList.remove('hidden');

        try {
            const data = await this.getDetail(id, type);
            loading.classList.add('hidden');
            detail.classList.remove('hidden');

            const isMovie = type === 'movie';
            const title = isMovie ? data.title : data.name;
            const year = (isMovie ? data.release_date : data.first_air_date || '').substring(0,4);
            const rating = data.vote_average ? data.vote_average.toFixed(1) : '-';
            const runtime = isMovie && data.runtime ? data.runtime + ' min' : (data.episode_run_time && data.episode_run_time.length ? data.episode_run_time[0] + ' min/ep' : '');
            const genres = (data.genres || []).map(g => g.name).join(', ');
            const poster = data.poster_path ? this.imgW + data.poster_path : '';
            const overview = data.overview || 'Sin descripcion disponible.';

            $('td-poster').src = poster || '';
            $('td-poster').style.display = poster ? '' : 'none';
            $('td-title').textContent = title;
            $('td-year').textContent = year || '?';
            $('td-rating').innerHTML = `<i class="fa-solid fa-star mr-0.5"></i>${rating}`;
            $('td-runtime').textContent = runtime;
            $('td-genres').textContent = genres;
            $('td-overview').textContent = overview;
            $('td-tmdb-link').href = `https://www.themoviedb.org/${type}/${id}`;

            /* Boton "Buscar stream" busca canales por nombre */
            $('td-search-stream').onclick = () => {
                cM('m-tmdb');
                /* Cerrar modales y buscar en canales */
                S.q = title; $('sinput').value = title;
                S.cat = 'all'; S.fov = false;
                document.querySelectorAll('.cp').forEach(x => { x.className = 'cp shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition bg-card text-muted border-bdr hover:border-accent/40 hover:text-txt'; });
                document.querySelector('[data-c="all"]').className = 'cp shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition bg-accent text-bg border-accent';
                uFB(); applyF();
                window.scrollTo({top: $('mainc').offsetTop - 70, behavior:'smooth'});
                toast(`Buscando "${title}" en canales`, 'info');
            };

        } catch(e) {
            loading.classList.add('hidden');
            container.classList.remove('hidden');
            toast('Error al cargar detalle: ' + e.message, 'err');
        }
    },
    /* Resetear vista a resultados */
    backToResults() {
        $('tmdb-detail').classList.add('hidden');
        $('tmdb-results').classList.remove('hidden');
    }
};

/* Inicializar estado TMDB al cargar */
function initTMDB() {
    TMDB.updateUI();
    $('tmdb-key-input').value = TMDB.key;

    /* Guardar API key */
    $('tmdb-key-save').addEventListener('click', () => {
        const k = $('tmdb-key-input').value.trim();
        if (!k) { toast('Ingresá una API Key', 'warn'); return; }
        TMDB.setKey(k);
        toast('API Key guardada', 'ok');
    });

    /* Busqueda con debounce */
    let searchTimer;
    $('tmdb-search').addEventListener('input', e => {
        clearTimeout(searchTimer);
        const q = e.target.value.trim();
        if (q.length < 2) { $('tmdb-results').innerHTML = ''; $('tmdb-empty').classList.remove('hidden'); $('tmdb-empty-msg').textContent = 'Escribi al menos 2 caracteres'; return; }
        searchTimer = setTimeout(async () => {
            $('tmdb-loading').classList.remove('hidden'); $('tmdb-results').innerHTML = ''; $('tmdb-empty').classList.add('hidden'); $('tmdb-detail').classList.add('hidden');
            /* Desactivar tabs activos */
            document.querySelectorAll('.tmdb-tab').forEach(t => t.classList.remove('on'));
            try {
                const type = $('tmdb-type').value;
                const data = type === 'multi' ? await TMDB.searchMulti(q) : await TMDB.search(q, type);
                $('tmdb-loading').classList.add('hidden');
                TMDB.renderResults(data.results);
            } catch(e) {
                $('tmdb-loading').classList.add('hidden');
                toast('Error TMDB: ' + e.message, 'err');
                $('tmdb-empty').classList.remove('hidden'); $('tmdb-empty-msg').textContent = e.message;
            }
        }, 500);
    });

    /* Enter en busqueda */
    $('tmdb-search').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.dispatchEvent(new Event('input')); });

    /* Tabs rapidos */
    document.querySelectorAll('.tmdb-tab').forEach(tab => {
        tab.addEventListener('click', async () => {
            if (!TMDB.key) { toast('Configurá tu API Key primero', 'warn'); return; }
            document.querySelectorAll('.tmdb-tab').forEach(t => t.classList.remove('on'));
            tab.classList.add('on');
            $('tmdb-search').value = '';
            $('tmdb-loading').classList.remove('hidden'); $('tmdb-results').innerHTML = ''; $('tmdb-empty').classList.add('hidden'); $('tmdb-detail').classList.add('hidden');
            try {
                const data = await TMDB.getList(tab.dataset.tab);
                $('tmdb-loading').classList.add('hidden');
                TMDB.renderResults(data.results);
            } catch(e) {
                $('tmdb-loading').classList.add('hidden');
                toast('Error: ' + e.message, 'err');
                $('tmdb-empty').classList.remove('hidden'); $('tmdb-empty-msg').textContent = e.message;
            }
        });
    });

    /* Volver desde detalle */
    $('tmdb-detail-back').addEventListener('click', () => TMDB.backToResults());
}

/* ===================================================================
   EVENTOS DE LA INTERFAZ
   =================================================================== */
function initEv() {
    let st;

    /* Busqueda de canales */
    $('sinput').addEventListener('input', e => { clearTimeout(st); st = setTimeout(() => { S.q = e.target.value.trim(); applyF(); }, 250); });

    /* Categorias */
    document.querySelectorAll('.cp').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.cp').forEach(x => { x.className = 'cp shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition bg-card text-muted border-bdr hover:border-accent/40 hover:text-txt'; });
            b.className = 'cp shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition bg-accent text-bg border-accent';
            S.cat = b.dataset.c; S.fov = false; uFB(); applyF();
        });
    });

    /* Favoritos toggle */
    $('bfav').addEventListener('click', () => {
        S.fov = !S.fov;
        if (S.fov) {
            S.cat = 'all';
            document.querySelectorAll('.cp').forEach(x => { x.className = 'cp shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition bg-card text-muted border-bdr hover:border-accent/40 hover:text-txt'; });
            document.querySelector('[data-c="all"]').className = 'cp shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition bg-accent text-bg border-accent';
        }
        uFB(); applyF();
    });

    /* Reproductor: cerrar */
    $('pcls').addEventListener('click', stopP);
    $('npc').addEventListener('click', stopP);

    const vid = $('vid');
    $('bplay').addEventListener('click', () => { vid.paused ? vid.play().catch(()=>{}) : vid.pause(); });
    $('npp').addEventListener('click', () => { vid.paused ? vid.play().catch(()=>{}) : vid.pause(); });
    vid.addEventListener('play', () => { $('bplay').innerHTML = '<i class="fa-solid fa-pause"></i>'; $('npp').innerHTML = '<i class="fa-solid fa-pause text-sm"></i>'; });
    vid.addEventListener('pause', () => { $('bplay').innerHTML = '<i class="fa-solid fa-play"></i>'; $('npp').innerHTML = '<i class="fa-solid fa-play text-sm"></i>'; });

    const vs = $('vslider');
    vs.addEventListener('input', () => { vid.volume = vs.value / 100; });
    vid.volume = 0.8;

    $('bfs').addEventListener('click', () => {
        const w = document.querySelector('.vw');
        document.fullscreenElement ? document.exitFullscreen() : w.requestFullscreen().catch(()=>{});
    });

    $('bpip').addEventListener('click', async () => {
        try { document.pictureInPictureElement ? await document.exitPictureInPicture() : await vid.requestPictureInPicture(); }
        catch(e) { toast('PiP no soportado', 'warn'); }
    });

    $('bfch').addEventListener('click', () => { if (S.cur) tF(nm(S.cur.name)); });
    $('blm').addEventListener('click', () => { S.d += S.pp; rG(); });

    /* Botones del banner */
    $('bb-editor').addEventListener('click', () => { oM('m-editor'); editingId = null; rEdList(); $('ed-area').classList.add('hidden'); });
    $('bb-paste').addEventListener('click', () => oM('m-paste'));
    $('bb-url').addEventListener('click', () => oM('m-url'));
    $('bb-file').addEventListener('click', () => oM('m-file'));
    $('bb-explorer').addEventListener('click', () => oM('m-explorer'));
    $('btmdb').addEventListener('click', () => { oM('m-tmdb'); TMDB.updateUI(); });

    /* Editor propio: eventos */
    $('ed-new').addEventListener('click', () => openEditor(null));
    $('ed-text').addEventListener('input', updEdCount);
    $('ed-save').addEventListener('click', () => {
        const name = $('ed-name').value.trim() || 'Sin nombre', text = $('ed-text').value.trim();
        if (!text) { toast('Escribí algo', 'warn'); return; }
        const list = gEd();
        if (editingId) {
            const item = list.find(x => x.id === editingId);
            if (item) { item.name = name; item.text = text; item.date = Date.now(); }
        } else { list.push({id:uid(), name, text, date:Date.now()}); }
        sEd(list); editingId = null; rEdList(); $('ed-area').classList.add('hidden'); toast('Lista guardada', 'ok');
    });
    $('ed-load').addEventListener('click', () => {
        const text = $('ed-text').value.trim(), name = $('ed-name').value.trim() || 'Lista';
        if (!text) { toast('Sin contenido', 'warn'); return; }
        loadFT(text, name); cM('m-editor');
    });
    $('ed-del').addEventListener('click', () => {
        if (!editingId) return;
        let list = gEd(); list = list.filter(x => x.id !== editingId);
        sEd(list); editingId = null; rEdList(); $('ed-area').classList.add('hidden'); toast('Eliminada', 'info');
    });
    $('ed-cancel').addEventListener('click', () => { editingId = null; rEdList(); $('ed-area').classList.add('hidden'); });

    /* Pegar texto */
    const pt = $('pt-text'), pc = $('pt-count'), pb = $('pt-go');
    pt.addEventListener('input', () => {
        const t = pt.value.trim();
        if (!t) { pc.textContent = 'Sin contenido'; pb.disabled = true; return; }
        const urls = t.split('\n').filter(l => l.trim().startsWith('http')).length;
        const exts = t.split('\n').filter(l => l.trim().startsWith('#EXTINF')).length;
        pc.textContent = `${exts} canales / ${urls} enlaces`; pb.disabled = urls === 0;
    });
    pb.addEventListener('click', () => {
        const t = pt.value.trim();
        if (!t) return;
        cM('m-paste'); loadFT(t, $('pt-name').value.trim() || 'Lista pegada');
        pt.value = ''; $('pt-name').value = ''; pc.textContent = 'Sin contenido'; pb.disabled = true;
    });

    /* Desde URL */
    $('ur-go').addEventListener('click', () => {
        const u = $('ur-in').value.trim();
        if (!u) { toast('Ingresa URL', 'warn'); return; }
        cM('m-url'); loadCust(u, $('ur-nm').value.trim()); $('ur-in').value = ''; $('ur-nm').value = '';
    });

    /* Explorador web */
    $('ex-go').addEventListener('click', () => { const u = $('ex-in').value.trim(); if (!u) { toast('Ingresa una URL', 'warn'); return; } explorePage(u); });
    $('ex-in').addEventListener('keydown', e => { if (e.key === 'Enter') { const u = e.target.value.trim(); if (u) explorePage(u); } });
    document.querySelectorAll('.ex-q').forEach(b => { b.addEventListener('click', () => { $('ex-in').value = b.dataset.u; explorePage(b.dataset.u); }); });

    /* URL directa */
    $('dr-go').addEventListener('click', () => {
        const u = $('dr-in').value.trim(), n = $('dr-nm').value.trim();
        if (!u) { toast('Ingresa URL', 'warn'); return; }
        cM('m-dir'); $('dr-in').value = ''; $('dr-nm').value = '';
        const s = $('psec'); s.classList.remove('hidden'); s.scrollIntoView({behavior:'smooth',block:'start'});
        $('vov').classList.remove('hidden'); $('vomsg').textContent = 'Cargando...';
        $('pname').textContent = n || 'Stream'; $('pgrp').textContent = 'Manual';
        $('npbar').classList.remove('hidden'); $('npn').textContent = n || 'Stream';
        if (!pl) pl = new RP(vid);
        pl.playUrl(u, n || 'Stream');
    });

    /* Cerrar modales */
    document.querySelectorAll('.mx').forEach(b => b.addEventListener('click', () => b.closest('.mo').classList.remove('on')));
    document.querySelectorAll('.mo').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('on'); }));

    /* Limpiar historial */
    $('bclrh').addEventListener('click', () => { localStorage.removeItem('svh'); rH(); toast('Historial limpio', 'info'); });

    /* Salir (lock) */
    $('bout').addEventListener('click', lockApp);

    /* Escape cierra modales */
    document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.mo.on').forEach(m => m.classList.remove('on')); });

    initFH();
    initTMDB();
}

/* ===================================================================
   INICIO DE LA APLICACION
   =================================================================== */
async function initApp() {
    if (S.ini) return;
    S.ini = true;
    initEv();
    uFB();
    rH();
    $('load-scr').style.display = 'flex';

    try {
        await loadAll();
        $('lup').textContent = new Date().toLocaleTimeString('es', {hour:'2-digit',minute:'2-digit'});
        applyF();
    } catch(e) { toast('Error al cargar', 'err'); }

    const ls = $('load-scr');
    ls.style.transition = 'opacity 0.5s'; ls.style.opacity = '0';
    setTimeout(() => { ls.style.display = 'none'; }, 500);

    /* Refrescar listas cada 30 minutos */
    setInterval(async () => {
        try {
            sessionStorage.removeItem('sv2');
            await loadAll(true);
            applyF();
            $('lup').textContent = new Date().toLocaleTimeString('es', {hour:'2-digit',minute:'2-digit'});
        } catch(e) {}
    }, 30 * 60 * 1000);
}

/* Arranque */
document.addEventListener('DOMContentLoaded', initLock);
