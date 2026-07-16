class GestorCanales {
    constructor() {
        this.canales = [];
    }

    parsearM3U(contenido) {
        const lineas = contenido.split('\n');
        let canalActual = {};
        
        lineas.forEach(linea => {
            linea = linea.trim();
            if (!linea) return;

            if (linea.startsWith('#EXTINF:')) {
                const nombre = linea.split(',').pop();
                canalActual.nombre = nombre;
            } else if (linea.startsWith('http') || linea.startsWith('rtmp')) {
                canalActual.url = linea;
                this.canales.push({...canalActual});
                canalActual = {};
            }
        });
        return this.canales;
    }

    async cargarArchivo(ruta = 'canales.m3u') {
        try {
            const res = await fetch(ruta);
            const texto = await res.text();
            return this.parsearM3U(texto);
        } catch (err) {
            console.error('Error al cargar lista:', err);
            return [];
        }
    }
}
