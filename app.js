let canales = [];

// Función para cargar la lista con ruta dinámica (evita errores en GitHub Pages)
async function cargarLista(ruta) {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');

    try {
        // Resolvemos la ruta absoluta para que siempre encuentre el archivo .m3u
        const baseUrl = window.location.href.split('/').slice(0, -1).join('/');
        const fullUrl = `${baseUrl}/${ruta}`;
        
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("No se pudo cargar el archivo: " + response.statusText);
        
        const text = await response.text();
        const lines = text.split('\n');
        canales = [];
        let meta = null;

        lines.forEach(line => {
            if (line.startsWith('#EXTINF')) {
                const name = line.split(',')[1] || "Sin nombre";
                const group = (line.match(/group-title="([^"]+)"/) || [])[1] || "Otros";
                meta = { name, group };
            } else if (line.trim().startsWith('http') && meta) {
                canales.push({ ...meta, url: line.trim() });
                meta = null;
            }
        });
        render();
    } catch (error) {
        console.error("Error al cargar la lista:", error);
        alert("Error al cargar: " + error.message + ". Verifica que 'canales.m3u' esté en la carpeta raíz.");
    } finally {
        if (loader) loader.classList.add('hidden');
    }
}

// Función para renderizar los canales
function render() {
    const container = document.getElementById('container');
    if (!container) return;
    container.innerHTML = '';
    
    const groups = [...new Set(canales.map(c => c.group))];

    groups.forEach(g => {
        const section = document.createElement('div');
        section.className = 'mb-6';
        section.innerHTML = `<h2 class="text-lg font-bold text-[#e8a020] mb-3 border-b border-[#2a2a3a] pb-1">${g}</h2>`;
        
        const grid = document.createElement('div');
        grid.className = 'category-grid';
        
        canales.filter(c => c.group === g).forEach(c => {
            const card = document.createElement('div');
            card.className = 'card text-xs truncate';
            card.title = c.name; // Muestra el nombre completo al pasar el mouse
            card.innerText = c.name;
            grid.appendChild(card);
        });
        
        section.appendChild(grid);
        container.appendChild(section);
    });
}

// Función para limpiar canales caídos
async function limpiarCaidos() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
    
    // Verificación rápida en paralelo
    const validaciones = await Promise.all(canales.map(async (canal) => {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            await fetch(canal.url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
            clearTimeout(timeout);
            return true;
        } catch {
            return false;
        }
    }));

    canales = canales.filter((_, index) => validaciones[index]);
    
    if (loader) loader.classList.add('hidden');
    render();
    alert("Limpieza finalizada.");
                    }
