let canales = [];

// 1. Carga y Filtrado Inicial
async function cargarLista(ruta) {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');

    try {
        const response = await fetch(ruta);
        const text = await response.text();
        const lines = text.split('\n');
        
        // Define aquí qué países o idiomas quieres mantener
        const palabrasClave = ["argentina", "esp", "lat", "latino", "chile", "mexico", "colombia", "españa", "uruguay"];
        
        canales = [];
        let meta = null;

        lines.forEach(line => {
            if (line.startsWith('#EXTINF')) {
                const name = line.split(',')[1] || "Sin nombre";
                const group = (line.match(/group-title="([^"]+)"/) || [])[1] || "Otros";
                meta = { name, group };
            } else if (line.trim().startsWith('http') && meta) {
                // Filtramos: solo agregamos si contiene alguna palabra clave en español/país
                const textoCompleto = (meta.name + meta.group).toLowerCase();
                const esDeInteres = palabrasClave.some(p => textoCompleto.includes(p));

                if (esDeInteres) {
                    canales.push({ ...meta, url: line.trim() });
                }
                meta = null;
            }
        });
        render(canales);
    } catch (e) { 
        alert("Error al cargar: " + e.message); 
    } finally {
        if (loader) loader.classList.add('hidden');
    }
}

// 2. Filtro en tiempo real (Buscador)
function filtrarCanales() {
    const term = document.getElementById('buscador').value.toLowerCase();
    const filtrados = canales.filter(c => c.name.toLowerCase().includes(term));
    render(filtrados);
}

// 3. Renderizado eficiente (Grid compacto)
function render(lista) {
    const container = document.getElementById('container');
    if (!container) return;
    container.innerHTML = '';
    
    const groups = [...new Set(lista.map(c => c.group))];
    groups.forEach(g => {
        const section = document.createElement('div');
        section.className = 'mb-6';
        section.innerHTML = `<h2 class="text-sm font-bold text-[#e8a020] uppercase mb-2 border-b border-[#2a2a3a] pb-1">${g} (${lista.filter(c => c.group === g).length})</h2>`;
        
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2';
        
        lista.filter(c => c.group === g).forEach(c => {
            const card = document.createElement('div');
            card.className = 'bg-[#181822] p-2 rounded text-[10px] truncate border border-[#2a2a3a] hover:border-[#e8a020] cursor-pointer';
            card.innerText = c.name;
            grid.appendChild(card);
        });
        section.appendChild(grid);
        container.appendChild(section);
    });
}

// 4. Limpiador masivo de canales
async function limpiarCaidos() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
    
    // Verificación rápida en paralelo
    const validaciones = await Promise.all(canales.map(async (canal) => {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000); // Timeout de 3 segundos
            await fetch(canal.url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
            clearTimeout(timeout);
            return true;
        } catch {
            return false;
        }
    }));

    canales = canales.filter((_, index) => validaciones[index]);
    
    if (loader) loader.classList.add('hidden');
    render(canales);
    alert("¡Limpieza finalizada! Canales caídos eliminados.");
        }
