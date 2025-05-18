$(document).ready(function() {

    const API_URL = "https://rickandmortyapi.com/api/";

    const charactersListContainer = $('#characters-list');
    const paginationContainer = $('#characters-pagination');

    // paginacion
    let currentPage = 1;
    let paginationInfo = null;
    function clearCharactersList() {
        charactersListContainer.empty();
    }

    // Función para mostrar un mensaje en el contenedor de personajes
    function showMessageInContainer(message) {
        clearCharactersList();
        charactersListContainer.append(`<div class="col-12"><p class="text-center">${message}</p></div>`);
        paginationContainer.empty();
    }

    // Función para obtener datos de la API con paginación
    async function fetchData(endpoint, page = 1) {
        try {
            showMessageInContainer("Cargando datos...");
            const response = await fetch(`${API_URL}${endpoint}?page=${page}`);
            if (!response.ok) {
                // mensaje de error
                showMessageInContainer(`Error al obtener datos: ${response.status}`);
                throw new Error(`Error al obtener datos: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            paginationContainer.empty(); // Limpiamos la paginación en caso de error
            return null;
        }
    }

    // Función para renderizar personajes
    function renderCharacters(characters) {
        clearCharactersList(); // Limpiamos el contenido anterior

        if (!characters || characters.length === 0) {
            showMessageInContainer("No se encontraron personajes para esta página.");
            return;
        }

        characters.forEach(character => {
            const cardHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                        <img src="${character.image}" class="card-img-top" alt="${character.name}">
                        <div class="card-body">
                            <h5 class="card-title">${character.name}</h5>
                            <p class="card-text">Especie: ${character.species}</p>
                            <p class="card-text">Estado: ${character.status}</p>
                            <p class="card-text">Origen: ${character.origin.name}</p>
                            <p class="card-text">Última ubicación: ${character.location.name}</p>
                        </div>
                    </div>
                </div>
            `;
            charactersListContainer.append(cardHtml);
        });
    }

    // barra de paginación
    function renderPagination(info) {
        paginationContainer.empty(); // Limpiamos la paginación anterior

        if (!info || info.pages <= 1) {
            return;
        }

        const totalPages = info.pages;
        const hasPrev = info.prev !== null;
        const hasNext = info.next !== null;

        // Botón anterior
        const prevItem = `<li class="page-item ${hasPrev ? '' : 'disabled'}">
                              <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
                          </li>`;
        paginationContainer.append(prevItem);

        // Enlaces a las páginas
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
             paginationContainer.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
        }


        for (let i = startPage; i <= endPage; i++) {
            const pageItem = `<li class="page-item ${i === currentPage ? 'active' : ''}">
                                  <a class="page-link" href="#" data-page="${i}">${i}</a>
                              </li>`;
            paginationContainer.append(pageItem);
        }

         if (endPage < totalPages) {
             paginationContainer.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
        }


        // Botón Siguiente
        const nextItem = `<li class="page-item ${hasNext ? '' : 'disabled'}">
                              <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
                          </li>`;
        paginationContainer.append(nextItem);

        paginationContainer.find('.page-link').on('click', function(event) {
            event.preventDefault();

            const targetPage = $(this).data('page');
            if (!$(this).closest('.page-item').hasClass('disabled') && targetPage !== currentPage) {
                loadPage(targetPage);
            }
        });
    }

    // personajes
    async function loadPage(pageNumber) {
        currentPage = pageNumber; // Actualizamos la página

        const data = await fetchData('character', currentPage);

        if (data && data.results) {
            renderCharacters(data.results); // Renderiza los personajes
            renderPagination(data.info);
        } else if (data === null) {
             paginationContainer.empty(); // Limpiamos la paginación
        } else {
             showMessageInContainer("No se encontraron personajes para esta página.");
             paginationContainer.empty(); // Limpiamos la paginación
        }
    }

    loadPage(1); // Cargamos la página 1 al inicio

});

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    // Excluir enlaces con # (anclas internas o vacías)
    if (
      link.getAttribute("href").startsWith("#") ||
      link.hasAttribute("target")
    ) return;

    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = href;
      }, 500); // Espera a que termine la animación
    });
});
});
