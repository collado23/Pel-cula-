const gestor = new GestorCanales();
const btnCargar = document.getElementById('cargarLista');
const contenedor = document.getElementById('contenedorCanales');
const reproductor = document.getElementById('player');

btnCargar.addEventListener('click', async () => {
    const lista = await gestor.cargarArchivo();
    dibujarLista(lista);
});

function dibujarLista(lista) {
    contenedor.innerHTML = '';
    lista.forEach(canal => {
        const elem = document.createElement('div');
        elem.className = 'canal-item';
        elem.textContent = canal.nombre;
        elem.addEventListener('click', () => {
            reproductor.src = canal.url;
            reproductor.play();
        });
        contenedor.appendChild(elem);
    });
}

// Cargar lista automáticamente al abrir
document.addEventListener('DOMContentLoaded', () => {
    btnCargar.click();
});
