let canales = [];

async function cargarLista(ruta) {
    const response = await fetch(ruta);
    const text = await response.text();
    const lines = text.split('\n');
    canales = [];
    let meta = null;

    lines.forEach(line => {
        if (line.startsWith('#EXTINF')) {
            const name = line.split(',')[1] || "Sin nombre";
            const group = (line.match(/group-title="([^"]+)"/) || [])[1] || "Otros";
            meta = { name, group };
        } else if (line.startsWith('http') && meta) {
            canales.push({ ...meta, url: line.trim() });
            meta = null;
        }
    });
    render();
}

function render() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    const groups = [...new Set(canales.map(c => c.group))];

    groups.forEach(g => {
        const section = document.createElement('div');
        section.className = 'mb-6';
        section.innerHTML = `<h2 class="text-lg font-bold text-[#e8a020] mb-3">${g}</h2>`;
        const grid = document.createElement('div');
        grid.className = 'category-grid';
        canales.filter(c => c.group === g).forEach(c => {
            const card = document.createElement('div');
            card.className = 'card text-xs truncate';
            card.innerText = c.name;
            grid.appendChild(card);
        });
        section.appendChild(grid);
        container.appendChild(section);
    });
}

async function limpiarCaidos() {
    document.getElementById('loader').classList.remove('hidden');
    for (let i = canales.length - 1; i >= 0; i--) {
        try {
            await fetch(canales[i].url, { method: 'HEAD', mode: 'no-cors' });
        } catch {
            canales.splice(i, 1);
        }
    }
    document.getElementById('loader').classList.add('hidden');
    render();
                                           }
