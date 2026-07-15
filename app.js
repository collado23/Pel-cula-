const61f4c33ea3300d41b27b413ae33b4b64';

// 1. Cargar tus listas M3U
async function cargarLista(ruta) {
    const container = document.getElementById('container');
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');
    container.innerHTML = '';
    
    try {
        const res = await fetch(ruta);
        const text = await res.text();
        const lines = text.split('\n');
        
        lines.forEach(line => {
            if (line.startsWith('#EXTINF')) {
                const nombre = line.split(',').pop();
                const card = document.createElement('div');
                card.className = 'bg-[#181822] p-3 rounded border border-[#2a2a3a] text-[12px] text-center cursor-pointer hover:border-[#e8a020]';
                card.innerText = nombre;
                card.onclick = () => alert("Abriendo: " + nombre);
                container.appendChild(card);
            }
        });
    } catch (e) { alert("Error al cargar el archivo: " + ruta); }
    loader.classList.add('hidden');
}

// 2. Buscador inteligente TMDB
async function buscarTMDB(query) {
    if (query.length < 3) return;
    const container = document.getElementById('container');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        container.innerHTML = '';
        data.results.forEach(p => {
            if (!p.poster_path) return;
            const card = document.createElement('div');
            card.innerHTML = `<img src="https://image.tmdb.org/t/p/w200${p.poster_path}" class="rounded w-full mb-2">
                              <h3 class="text-[10px] text-white">${p.title}</h3>`;
            card.onclick = () => window.open(`https://www.google.com/search?q=${p.title}+pelicula+online`, '_blank');
            container.appendChild(card);
        });
    } catch (e) { console.error(e); }
}
