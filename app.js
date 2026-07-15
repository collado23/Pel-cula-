const API_KEY = '61f4c33ea3300d41b27b413ae33b4b64'; // <--- PEGA TU CLAVE AQUÍ

async function cargarLista(ruta) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    try {
        const res = await fetch(ruta);
        const text = await res.text();
        text.split('\n').forEach(line => {
            if (line.startsWith('#EXTINF')) {
                const nombre = line.split(',').pop();
                const card = document.createElement('div');
                card.className = 'bg-[#181822] p-2 rounded border border-[#2a2a3a] text-[12px] truncate cursor-pointer';
                card.innerText = nombre;
                container.appendChild(card);
            }
        });
    } catch (e) { alert("Error al cargar lista"); }
}

async function buscarTMDB(query) {
    if (query.length < 3) return;
    const container = document.getElementById('container');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
    
    const res = await fetch(url);
    const data = await res.json();
    container.innerHTML = '';
    
    data.results.forEach(p => {
        if (!p.poster_path) return;
        const card = document.createElement('div');
        card.className = 'bg-[#181822] p-2 rounded';
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${p.poster_path}" class="rounded w-full mb-1">
            <h3 class="text-[10px] text-white truncate">${p.title}</h3>
        `;
        card.onclick = () => window.open(`https://www.google.com/search?q=${p.title}+pelicula+online`, '_blank');
        container.appendChild(card);
    });
}
