const API_KEY = '61f4c33ea3300d41b27b413ae33b4b64'; // <--- PEGA AQUÍ LA CLAVE QUE TE DIERON

// 1. Carga de archivos M3U (TV y Listas personales)
async function cargarLista(ruta) {
    document.getElementById('loader').classList.remove('hidden');
    try {
        const response = await fetch(ruta);
        const text = await response.text();
        // ... (lógica de renderizado que vimos antes)
        alert("Lista cargada");
    } catch (e) { alert("Error al cargar"); }
    document.getElementById('loader').classList.add('hidden');
}

// 2. Buscador TMDB (Películas nuevas de internet)
async function buscarTMDB(query) {
    if (query.length < 3) return;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;
    
    const res = await fetch(url);
    const data = await res.json();
    renderResultados(data.results);
}

function renderResultados(peliculas) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    peliculas.forEach(p => {
        if (!p.poster_path) return;
        const card = document.createElement('div');
        card.innerHTML = `<img src="https://image.tmdb.org/t/p/w200${p.poster_path}" class="rounded">
                          <h3 class="text-[10px] mt-1">${p.title}</h3>`;
        card.onclick = () => window.open(`https://www.google.com/search?q=${p.title}+pelicula+online`, '_blank');
        container.appendChild(card);
    });
}
