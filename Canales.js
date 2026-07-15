/*
 * ============================================================
 *  LISTA DE CANALES - StreamVault
 * ============================================================
 *  Pegá todo el contenido de tu archivo .m3u aca adentro.
 *  La primera linea tiene que ser   var LISTA_CANALES = `
 *  y la ultima linea tiene que ser   `;
 *  Nada mas. El resto es tu M3U tal cual.
 *
 *  Tambien podes crear mas archivos (deportes.js, peliculas.js)
 *  usando otros nombres de variable:
 *    var LISTA_DEPORTES = `...`;
 *    var LISTA_PELICULAS = `...`;
 *    var LISTA_SERIES = `...`;
 *    var LISTA_MUSICA = `...`;
 *  Y agregarlos en index.html antes de app.js
 * ============================================================
 */

var LISTA_CANALES = `#EXTM3U
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_america-tv_m.png" group-title="Argentina",America TV
https://stream-gtlc.telecentro.net.ar/hls/americatvHD/americatvHD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_telefe-hd_m.png" group-title="Argentina",Telefe HD
https://stream-gtlc.telecentro.net.ar/hls/telefeHD/telefeHD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_el-trece-hd_m.png" group-title="Argentina",El Trece HD
https://stream-gtlc.telecentro.net.ar/hls/el13HD/el13HD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_el-nueve_m.png" group-title="Argentina",El Nueve
https://stream-gtlc.telecentro.net.ar/hls/elnueveHD/elnueveHD.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Canal_7_Argentina_logo.svg/200px-Canal_7_Argentina_logo.svg.png" group-title="Argentina",Canal 7 Publica
https://stream-gtlc.telecentro.net.ar/hls/canal7HD/canal7HD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_cronica-tv_m.png" group-title="Noticias",Cronica TV
https://stream-gtlc.telecentro.net.ar/hls/cronicatvHD/cronicatvHD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_canal-26_m.png" group-title="Noticias",Canal 26
https://stream-gtlc.telecentro.net.ar/hls/canal26HD/canal26HD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_a24_m.png" group-title="Noticias",A24
https://stream-gtlc.telecentro.net.ar/hls/a24HD/a24HD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_tyc-sports_m.png" group-title="Deportes",TyC Sports
https://stream-gtlc.telecentro.net.ar/hls/tycsportsHD/tycsportsHD.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Logo_Telecentro.svg/200px-Logo_Telecentro.svg.png" group-title="Argentina",Telecentro
https://stream-gtlc.telecentro.net.ar/hls/telecentroHD/telecentroHD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_net-tv_m.png" group-title="Argentina",Net TV
https://stream-gtlc.telecentro.net.ar/hls/nettvHD/nettvHD.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_magazine_m.png" group-title="Entretenimiento",Magazine
https://stream-gtlc.telecentro.net.ar/hls/magazineHD/magazineHD.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Deportv_logo.svg/200px-Deportv_logo.svg.png" group-title="Deportes",DeporTV
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/deportv/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Pakapaka_logo.svg/200px-Pakapaka_logo.svg.png" group-title="Infantil",Pakapaka
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/pakapaka/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Encuentro_logo.svg/200px-Encuentro_logo.svg.png" group-title="Documentales",Encuentro
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/encuentro/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_ln_m.png" group-title="Noticias",LN+
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/ln/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Cablenoticias_logo.svg/200px-Cablenoticias_logo.svg.png" group-title="Noticias",Cable Noticias
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/cablenoticias/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cnn_en_espa%C3%B1ol_logo.svg/200px-Cnn_en_espa%C3%B1ol_logo.svg.png" group-title="Noticias",CNNE
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/cnn-espanol/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Monterrey_Television_logo.svg/200px-Monterrey_Television_logo.svg.png" group-title="Musica",Music Top
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/musictop/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Canal_9_La_Plata_logo.svg/200px-Canal_9_La_Plata_logo.svg.png" group-title="Argentina",Canal 9 La Plata
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal9laplata/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Canal_10_Mar_del_Plata_logo.svg/200px-Canal_10_Mar_del_Plata_logo.svg.png" group-title="Argentina",Canal 10 Mar del Plata
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal10mdq/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Canal_12_Cordoba_logo.svg/200px-Canal_12_Cordoba_logo.svg.png" group-title="Argentina",Canal 12 Cordoba
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal12cba/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Canal_6_Salta_logo.svg/200px-Canal_6_Salta_logo.svg.png" group-title="Argentina",Canal 6 Salta
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal6salta/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Telefe_Rosario_logo.svg/200px-Telefe_Rosario_logo.svg.png" group-title="Argentina",Telefe Rosario
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/teleferosario/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Elnueve_Tucuman_logo.svg/200px-Elnueve_Tucuman_logo.svg.png" group-title="Argentina",Canal 9 Tucuman
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal9tuc/PROD/index.m3u8
#EXTM3U
#EXTINF:-1 group-title="Cine",Batman Begins
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 group-title="Cine",Matrix
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 group-title="Cine",Relatos Salvajes
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTM3U
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/TV_Publica_Argentina.png/200px-TV_Publica_Argentina.png" group-title="Argentina",Canal 7 (Alt)
https://contar.monstercat.com/live/primary.m3u8
#EXTINF:-1 tvg-logo="https://cdn.mitvstatic.com/channels/ar_ln_m.png" group-title="Noticias",LN+
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/ln/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Cablenoticias_logo.svg/200px-Cablenoticias_logo.svg.png" group-title="Noticias",Cable Noticias
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/cablenoticias/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Canal_26_HD_logo.svg/200px-Canal_26_HD_logo.svg.png" group-title="Noticias",Canal 26 (Alt)
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal26/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Monterrey_Television_logo.svg/200px-Monterrey_Television_logo.svg.png" group-title="Musica",Music Top
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/musictop/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/RTN_Northeast_Television_Network_logo.svg/200px-RTN_Northeast_Television_Network_logo.svg.png" group-title="Documentales",RTN Documentales
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/rtn/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Canal_9_La_Plata_logo.svg/200px-Canal_9_La_Plata_logo.svg.png" group-title="Argentina",Canal 9 La Plata
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal9laplata/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Canal_10_Mar_del_Plata_logo.svg/200px-Canal_10_Mar_del_Plata_logo.svg.png" group-title="Argentina",Canal 10 Mar del Plata
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal10mdq/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Canal_12_Cordoba_logo.svg/200px-Canal_12_Cordoba_logo.svg.png" group-title="Argentina",Canal 12 Cordoba
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal12cba/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Canal_6_Salta_logo.svg/200px-Canal_6_Salta_logo.svg.png" group-title="Argentina",Canal 6 Salta
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal6salta/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Telefe_Rosario_logo.svg/200px-Telefe_Rosario_logo.svg.png" group-title="Argentina",Telefe Rosario
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/teleferosario/PROD/index.m3u8
#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Elnueve_Tucuman_logo.svg/200px-Elnueve_Tucuman_logo.svg.png" group-title="Argentina",Canal 9 Tucuman
https://d1gymyavdvyjgt.cloudfront.net/v1/manifest/3722c60a815c199d9c1ef46cf4e8a03207b528c4/canal9tuc/PROD/index.m3u8
:root{--accent:#e8a020;--bg:#0a0a0f}
*{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#2a2a3a transparent}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:3px}
body{font-family:'DM Sans',sans-serif;background:var(--bg);overflow-x:hidden;margin:0}
.bg-glow{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 600px 400px at 20% 10%,rgba(232,160,32,.06),transparent),radial-gradient(ellipse 500px 500px at 80% 80%,rgba(220,80,50,.04),transparent);animation:gl 20s ease-in-out infinite alternate}
@keyframes gl{to{opacity:.7;transform:scale(1.1)}}
@keyframes lp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
.live-dot{animation:lp 1.5s ease-in-out infinite}
@keyframes sd{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
.pe{animation:sd .4s cubic-bezier(.16,1,.3,1)}
@keyframes ci{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.cf{animation:ci .35s ease-out both}
.cs{overflow-x:auto;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity}
.cs>*{scroll-snap-align:start}
@keyframes tI{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
.ti{animation:tI .35s ease-out}
@keyframes tO{to{opacity:0;transform:translateX(40px)}}
.to{animation:tO .3s ease-in forwards}
.vw video{width:100%;display:block;background:#000;border-radius:8px}
.vs{-webkit-appearance:none;appearance:none;height:4px;background:#2a2a3a;border-radius:2px;outline:none}
.vs::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:var(--accent);border-radius:50%;cursor:pointer}
.mo{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}
.mo.on{opacity:1;pointer-events:auto}
.mb{background:#181822;border:1px solid #2a2a3a;border-radius:16px;padding:24px;max-width:620px;width:94%;max-height:88vh;overflow-y:auto;transform:scale(.95);transition:transform .25s}
.mo.on .mb{transform:scale(1)}
.nb{backdrop-filter:blur(16px);background:rgba(17,17,24,.92);border-top:1px solid #2a2a3a}
.ls{position:fixed;inset:0;z-index:200;background:var(--bg);display:flex;align-items:center;justify-content:center;transition:opacity .5s,transform .5s}
.ls.out{opacity:0;transform:scale(1.05);pointer-events:none}
@keyframes lb{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.lk{animation:lb 2s ease-in-out infinite}
.pd{width:12px;height:12px;border-radius:50%;border:2px solid #2a2a3a;transition:all .2s}
.pd.f{background:var(--accent);border-color:var(--accent)}
.pd.e{background:#ef4444;border-color:#ef4444;animation:sh .4s}
@keyframes sh{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.kb{width:68px;height:68px;border-radius:50%;background:#181822;border:1px solid #2a2a3a;color:#eaeaf0;font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;user-select:none}
.kb:hover{background:#20202e;border-color:#e8a020;color:#e8a020}
.kb:active{transform:scale(.92);background:#e8a020;color:#0a0a0f}
@keyframes sp{to{transform:rotate(360deg)}}
.spin{animation:sp 1s linear infinite}
.dz{border:2px dashed #2a2a3a;border-radius:12px;transition:all .25s;cursor:pointer}
.dz:hover,.dz.do{border-color:var(--accent);background:rgba(232,160,32,.05)}
.hi{transition:all .15s}
.hi:hover{background:#20202e}
.pa{background:#0a0a0f;border:2px dashed #2a2a3a;border-radius:12px;transition:all .25s;resize:vertical;min-height:200px;font-family:'DM Sans',monospace;font-size:12px;color:#eaeaf0;line-height:1.5}
.pa:focus{border-color:var(--accent);outline:none}
.pa::placeholder{color:#4a4a5a}
.ed-item{transition:all .15s;cursor:pointer}
.ed-item:hover{background:#20202e}
.ed-item.active{border-color:rgba(232,160,32,.4);background:rgba(232,160,32,.05)}
.link-found{transition:all .15s}
.link-found:hover{background:#20202e;border-color:rgba(232,160,32,.3)}
.tmdb-card{transition:all .2s;cursor:pointer}
.tmdb-card:hover{transform:translateY(-4px);border-color:rgba(232,160,32,.4)}
.tmdb-card:hover .tmdb-card-overlay{opacity:1}
.tmdb-card-overlay{opacity:0;transition:opacity .2s}
.tmdb-tab{transition:all .15s}
.tmdb-tab.on{color:var(--accent);border-color:var(--accent);background:rgba(232,160,32,.1)}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
@media(max-width:380px){.kb{width:58px;height:58px;font-size:18px}}
13maxhd/live13maxtvnuevo/playlist.m3u8#EXTINF:-1 tvg-id="247CanaldeNoticias.ar" tvg-logo="https://i.imgur.com/4hDCB1M.png" group-title="News",24/7 Can
`;
