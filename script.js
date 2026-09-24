const numeroWhatsApp = "525520797502"; 

const galleryContainer = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

let todasLasObras = [];
let filtroActualAño = 'todos';
let filtroActualTecnica = 'todas';

function mezclarArreglo(arreglo) {
    let arrayMezclado = [...arreglo];
    for (let i = arrayMezclado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayMezclado[i], arrayMezclado[j]] = [arrayMezclado[j], arrayMezclado[i]];
    }
    return arrayMezclado;
}

async function inicializar() {
    try {
        const respuesta = await fetch('obras.json');
        todasLasObras = await respuesta.json();
        aplicarFiltros(); 
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        galleryContainer.innerHTML = "<p style='text-align:center; padding: 2rem; grid-column: 1 / -1;'>Error al cargar las obras.</p>";
    }
}

function renderizarGaleria(obras) {
    galleryContainer.innerHTML = ''; 

    if (obras.length === 0) {
        galleryContainer.innerHTML = "<p style='text-align:center; padding: 3rem; grid-column: 1 / -1; color: #888;'>No hay piezas que coincidan con estos filtros.</p>";
        return;
    }

    obras.forEach(obra => {
        const article = document.createElement('article');
        article.className = 'art-card';

        const mensajeTexto = `Hola, me interesa adquirir la pieza ${obra.id} - ${obra.titulo}`;
        const mensajeCodificado = encodeURIComponent(mensajeTexto);
        const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

        // Verificamos si existe el tamaño para mostrarlo limpiamente
        const textoTamaño = obra.tamaño ? ` • ${obra.tamaño}` : '';

        article.innerHTML = `
            <img src="${obra.imagen}" alt="${obra.titulo}" class="obra-img" loading="lazy">
            <div class="card-content">
                <h2>${obra.titulo}</h2>
                <p class="technique">${obra.tecnica}${textoTamaño}</p>
                <p class="price">${obra.precio}</p>
                <a href="${enlaceWhatsApp}" class="btn-contact" target="_blank" rel="noopener noreferrer">
                   Adquirir pieza
                </a>
            </div>
        `;

        const imgElement = article.querySelector('.obra-img');
        imgElement.addEventListener('click', () => {
            lightboxImg.src = obra.imagen;
            lightbox.classList.add('active');
        });

        galleryContainer.appendChild(article);
    });
}

function aplicarFiltros() {
    let obrasFiltradas = todasLasObras;

    if (filtroActualAño !== 'todos') {
        obrasFiltradas = obrasFiltradas.filter(obra => obra.id.startsWith(filtroActualAño));
    }

    if (filtroActualTecnica !== 'todas') {
        obrasFiltradas = obrasFiltradas.filter(obra => 
            obra.tecnica.toLowerCase().includes(filtroActualTecnica)
        );
    }

    const obrasMezcladas = mezclarArreglo(obrasFiltradas);
    renderizarGaleria(obrasMezcladas);
}

document.querySelectorAll('#filter-year .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('#filter-year .filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filtroActualAño = e.target.getAttribute('data-year');
        aplicarFiltros();
    });
});

document.querySelectorAll('#filter-tech .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('#filter-tech .filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filtroActualTecnica = e.target.getAttribute('data-tech');
        aplicarFiltros();
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
    }
});

inicializar();