const gestor = new GestorCanales();
const btnCargar = document.getElementById('cargarLista');
const contenedor = document.getElementById('contenedorCanales');
const reproductor = document.getElementById('player');
const botonesCat = document.querySelectorAll('#categorias button');

let listaCompleta = [];

// Definimos las palabras clave para cada categoría
const reglasCategorias = {
    deportes: ['sport','deportes','fox','tyc','espn','bein','nba','nfl','nhl','mlb','golf','racing','moto','tenis','futbol','depor','canal+ sport','cazé','dazn','fight','mma','boxeo','rugby','ciclismo','claro sports'],
    noticias: ['noticias','news','cnn','tn','c5n','a24','crónica','todo noticias','euronews','24h','n1','telefe noticias','el trece noticias','ln+'],
    argentina: ['telefe','el trece','el nueve','canal 26','publica','cronica','net tv','pakapaka','encuentro','deportv','tyc','a24','argentina'],
    entretenimiento: ['cine','pelicula','series','movie','film','comedia','dramatico','anime','disney','cartoon','nick','mtv','pluto tv','rakuten tv']
};

// Asignar categoría a cada canal
function asignarCategoria(canal) {
    const nombre = canal.nombre.toLowerCase();
    for(let cat in reglasCategorias){
        for(let palabra of reglasCategorias[cat]){
            if(nombre.includes(palabra)) return cat;
        }
    }
    return 'otros';
}

btnCargar.addEventListener('click', async () => {
    listaCompleta = await gestor.cargarArchivo();
    // Agregamos la categoría a cada canal
    listaCompleta.forEach(c => c.categoria = asignarCategoria(c));
    dibujarLista('todos');
});

function dibujarLista(filtro = 'todos') {
    contenedor.innerHTML = '';
    const listaFiltrada = filtro === 'todos' 
        ? listaCompleta 
        : listaCompleta.filter(c => c.categoria === filtro);

    listaFiltrada.forEach(canal => {
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

// Manejar los botones de categoría
botonesCat.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesCat.forEach(b => b.classList.remove('cat-activa'));
        boton.classList.add('cat-activa');
        dibujarLista(boton.dataset.cat);
    });
});

// Cargar automáticamente
document.addEventListener('DOMContentLoaded', () => {
    btnCargar.click();
});
