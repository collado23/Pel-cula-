let canales = [];

// 1. Carga Inteligente (Optimizado para listas muy largas)
async function cargarLista(ruta) {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');

    try {
        const response = await fetch(ruta);
        const text = await response.text();
        const lines = text.split('\n');
        
        canales = [];
        let meta = null;

        // Procesamos la lista rápidamente
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.startsWith('#EXTINF')) {
                // Extrae el nombre después de la última coma
                const name = line.includes(',') ? line.split(',').pop().trim() : "Sin nombre";
                meta = { name };
            } else if (line.trim().startsWith('http') && meta) {
                canales.push({ ...meta, url: line.trim() });
                meta = null;
            }
        }
        
        render(canales);
        alert(`¡Lista cargada exitosamente! Total de canales: ${canales.length}`);
    } catch (e) { 
        alert("Error al cargar la lista: " + e.message); 
    } finally {
        if (loader) loader.classList.add('hidden');
    }
}

// 2. Renderizado de alto rendimiento
function render(lista) {
    const container = document.getElementById('container');
    if (!container) return;
    
    // Limpiamos y agregamos contador
    container.innerHTML = `<div class="p-4 text-[#e8a020] font-bold">Canales disponibles: ${lista.length}</div>`;
    
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 md:grid-cols-4 gap-2 p-2';
    
    // Solo renderizamos los primeros 500 para no trabar el celular
    // Si quieres ver todos, quita el .slice(0, 500)
    lista.slice(0, 500).forEach(c => {
        const card = document.createElement('div');
        card.className = 'bg-[#181822] p-3 rounded text-[11px] truncate border border-[#2a2a3a] hover:border-[#e8a020] cursor-pointer text-white';
        card.innerText = c.name;
        card.onclick = () => window.open(c.url, '_blank');
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

// 3. Limpiador por lotes (Evita colapso de memoria)
async function limpiarCaidos() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
    
    let nuevosCanales = [];
    const batchSize = 20; // Verificamos de a 20 para ser muy livianos

    for (let i = 0; i < canales.length; i += batchSize) {
        const batch = canales.slice(i, i + batchSize);
        const resultados = await Promise.all(batch.map(async (c) => {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 2000);
                const res = await fetch(c.url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
                clearTimeout(timeout);
                return res ? c : null;
            } catch { return null; }
        }));
        nuevosCanales.push(...resultados.filter(c => c !== null));
    }

    canales = nuevosCanales;
    render(canales);
    if (loader) loader.classList.add('hidden');
    alert(`Limpieza completada. Canales activos: ${canales.length}`);
        }
