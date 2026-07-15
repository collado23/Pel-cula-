/* ===================================================================
   StreamVault - App Principal
   =================================================================== */
function $(id){return document.getElementById(id)}
function toast(m,t){const c=$('toasts'),cs={info:'border-accent bg-accent/10 text-accent',ok:'border-ok bg-ok/10 text-ok',err:'border-err bg-err/10 text-err',warn:'border-warn bg-warn/10 text-warn'},is={info:'fa-circle-info',ok:'fa-circle-check',err:'fa-circle-xmark',warn:'fa-triangle-exclamation'},e=document.createElement('div');e.className=`ti flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium ${cs[t||'info']}`;e.innerHTML=`<i class="fa-solid ${is[t||'info']}"></i><span>${m}</span>`;c.appendChild(e);setTimeout(()=>{e.classList.replace('ti','to');setTimeout(()=>e.remove(),300)},3500)}
function oM(id){$(id).classList.add('on')}
function cM(id){$(id).classList.remove('on')}
function nm(s){return(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
function fsz(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(1)+' MB'}
function uid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,5)}

/* ===================================================================
   CLAVE PIN
   =================================================================== */
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
const PN={v:'',m:'login',l:true,a:0};
function initLock(){const s=localStorage.getItem('svp'),t=$('lkt'),b=$('lks');if(s){PN.m='login';t.textContent='StreamVault';b.textContent='Ingresá tu clave'}else{PN.m='setup';t.textContent='Crear clave';b.textContent='Elegí un PIN de 4 digitos';document.querySelector('.lk').innerHTML='<i class="fa-solid fa-lock-open"></i>'}document.querySelectorAll('#keypad .kb').forEach(e=>e.addEventListener('click',()=>hK(e.dataset.k)));document.addEventListener('keydown',e=>{if(!PN.l)return;if(e.key>='0'&&e.key<='9')hK(e.key);else if(e.key==='Backspace')hK('d')})}
async function hK(k){if(!PN.l)return;$('lke').style.opacity='0';if(k==='d'){PN.v=PN.v.slice(0,-1);uD();return}if(/^\d$/.test(k)&&PN.v.length<4){PN.v+=k;uD();if(PN.v.length===4)setTimeout(sP,200)}}
function uD(){document.querySelectorAll('#pind .pd').forEach((d,i)=>{d.className='pd'+(i<PN.v.length?' f':'')})}
async function sP(){const h=await sha(PN.v),er=$('lke'),ds=document.querySelectorAll('#pind .pd');if(PN.m==='setup'){localStorage.setItem('svp',h);unl()}else if(h===localStorage.getItem('svp')){PN.a=0;unl()}else{PN.a++;ds.forEach(d=>{d.className='pd e'});er.textContent=PN.a>=3?'Demasiados intentos.':'Clave incorrecta';er.style.opacity='1';setTimeout(()=>{PN.v='';uD()},600)}}
function unl(){PN.l=false;$('lock-screen').classList.add('out');setTimeout(()=>{$('lock-screen').style.display='none';showApp()},500)}
function lockApp(){if(pl){pl.x();pl=null}PN.l=true;PN.v='';PN.a=0;uD();$('lke').style.opacity='0';$('lock-screen').style.display='flex';setTimeout(()=>$('lock-screen').classList.remove('out'),50);if(localStorage.getItem('svp')){PN.m='login';$('lkt').textContent='StreamVault';$('lks').textContent='Ingresá tu clave';document.querySelector('.lk').innerHTML='<i class="fa-solid fa-lock"></i>'}['hdr','mainc','ftr'].forEach(i=>$(i).style.display='none');$('psec').classList.add('hidden');$('npbar').classList.add('hidden')}
function showApp(){['hdr','mainc','ftr'].forEach(i=>$(i).style.display='');initApp()}

/* ===================================================================
   ESTADO
   =================================================================== */
const DL=[{i:'ar',n:'Argentina',u:'https://iptv-org.github.io/iptv/countries/ar.m3u'},{i:'sa',n:'Sudamerica',u:'https://iptv-org.github.io/iptv/regions/south-america.m3u'},{i:'la',n:'Latinoamerica',u:'https://iptv-org.github.io/iptv/regions/latin-america.m3u'},{i:'sp',n:'Espanol',u:'https://iptv-org.github.io/iptv/languages/spa.m3u'},{i:'ds',n:'Deportes',u:'https://iptv-org.github.io/iptv/categories/sports.m3u'},{i:'mv',n:'Peliculas',u:'https://iptv-org.github.io/iptv/categories/movies.m3u'},{i:'nw',n:'Noticias',u:'https://iptv-org.github.io/iptv/categories/news.m3u'},{i:'en',n:'Entretenimiento',u:'https://iptv-org.github.io/iptv/categories/entertainment.m3u'},{i:'mu',n:'Musica',u:'https://iptv-org.github.io/iptv/categories/music.m3u'},{i:'ki',n:'Infantil',u:'https://iptv-org.github.io/iptv/categories/kids.m3u'},{i:'dc',n:'Documentales',u:'https://iptv-org.github.io/iptv/categories/documentary.m3u'}];
const AK=['argentina','america tv','telefe','canal 13','elnueve','canal 9','canal 7','publica','tyc sports','fox sports argentina','espn argentina','depotv','flow','telecentro','cronica','canal 26','a24','ln+','cablenoticias','cn23','misiones','formosa','cordoba','rosario','mendoza','tucuman','salta','net tv','magazine','panamericana'];
const CK={deportes:['deporte','sports','futbol','football','soccer','nba','nfl','f1','formula','tenis','boxeo','wwe','ufc','motor','racing','bein','espn','fox sport','tyc sport','directv sport'],peliculas:['pelicula','movie','film','cinema','cine','amc','star cinema','golden','paramount'],series:['serie','series','show','sitcom','comedia','drama'],noticias:['noticia','news','24h','24 hor','cnne','telefe','milenio','adn40','cronica','canal 26','a24','ln+','cable','cn23'],musica:['musica','music','mtv','vh1','hit','radio','concert','banda','rock','pop','jazz'],infantil:['infantil','kids','children','nickelodeon','cartoon','disney channel','anime','boomerang','baby','nick','pj mask','paw patrol'],documentales:['documental','documentary','discovery','nat geo','national geographic','history','historia','animal','natura'],entretenimiento:['entretenimiento','entertainment','reality','var
