$(document).ready(function() {
    const API_URL = "https://rickandmortyapi.com/api/";

    // contenedores en el HTML
    const locationsListContainer = $('#locations-list');
    const paginationContainer = $('#locations-pagination'); 

    // Variables de paginación
    let locationsCurrentPage = 1;
    let locationsPaginationInfo = null;

    function clearLocationsList() {
        locationsListContainer.empty();
    }

    function showMessageInContainer(message) {
        clearLocationsList();
        locationsListContainer.append(`<div class="col-12"><p class="text-center">${message}</p></div>`);
        paginationContainer.empty(); 
    }

    // Función para obtener datos de la API para las localizaciones con paginación
    async function fetchLocationsData(page = 1) {
        try {
            showMessageInContainer("Cargando localizaciones...");
            const response = await fetch(`${API_URL}location/?page=${page}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP ${response.status}: ${errorText || response.statusText}`);
            }

            const data = await response.json();

            if (!data || !data.results || !data.info) {
                throw new Error("La respuesta de la API no tiene el formato esperado (missing results or info).");
            }

            return data; // Devolvemos los datos incluyendo info y results

        } catch (error) {
            console.error("Error fetching locations data:", error);
            showMessageInContainer(`Error al cargar localizaciones: ${error.message}`);
            paginationContainer.empty(); 
            return null;
        }
    }

    // Renderizar lista de localizaciones en el contenedor
    function renderLocations(locations) {
        clearLocationsList();

        if (!locations || locations.length === 0) {
            locationsListContainer.append(`<div class="col-12"><p class="text-center">No se encontraron localizaciones para esta página.</p></div>`);
            return;
        }

        // Creamos fila para las tarjetas usando clases de Bootstrap
        const locationsRow = $('<div class="row mt-4"></div>');

        locations.forEach(location => {
            const cardHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                         <div class="card-body">
                            <h5 class="card-title">${location.name}</h5>
                            <p class="card-text">Tipo: ${location.type}</p>
                            <p class="card-text">Dimensión: ${location.dimension}</p>
                            </div>
                    </div>
                </div>
            `;
             locationsRow.append(cardHtml);
        });
        locationsListContainer.append(locationsRow);
    }

     // Función para la barra de paginación
    function renderLocationsPagination() {
        paginationContainer.empty();

        if (!locationsPaginationInfo || locationsPaginationInfo.pages <= 1) {
            return;
        }

        const totalPages = locationsPaginationInfo.pages;
        const hasPrev = locationsPaginationInfo.prev !== null;
        const hasNext = locationsPaginationInfo.next !== null;

        // Botón "Anterior"
        const prevItem = `<li class="page-item ${hasPrev ? '' : 'disabled'}">
                              <a class="page-link" href="#" data-page="${locationsCurrentPage - 1}">Anterior</a>
                            </li>`;
        paginationContainer.append(prevItem);

        const startPage = Math.max(1, locationsCurrentPage - 2);
        const endPage = Math.min(totalPages, locationsCurrentPage + 2);

        if (startPage > 1) {
             paginationContainer.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = `<li class="page-item ${i === locationsCurrentPage ? 'active' : ''}">
                                 <a class="page-link" href="#" data-page="${i}">${i}</a>
                               </li>`;
            paginationContainer.append(pageItem);
        }

         if (endPage < totalPages) {
              paginationContainer.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
         }


        // Botón "Siguiente"
        const nextItem = `<li class="page-item ${hasNext ? '' : 'disabled'}">
                              <a class="page-link" href="#" data-page="${locationsCurrentPage + 1}">Siguiente</a>
                            </li>`;
        paginationContainer.append(nextItem);

        // Evento de clic a los enlaces de paginación
        paginationContainer.find('.page-link').on('click', function(event) {
            event.preventDefault();
            const targetPage = $(this).data('page');
            // Solo cargar si no está deshabilitado y es una página diferente
            if (!$(this).closest('.page-item').hasClass('disabled') && targetPage !== locationsCurrentPage) {
                loadLocationsPage(targetPage); 
            }
        });
    }

    // Función para cargarpágina específica de localizaciones
    async function loadLocationsPage(pageNumber) {
        locationsCurrentPage = pageNumber;

        const data = await fetchLocationsData(locationsCurrentPage);

        if (data && data.results) {
            locationsPaginationInfo = data.info; 
            renderLocations(data.results); 
            renderLocationsPagination();
        } else if (data === null) {
             // El mensaje de error y limpieza ya se manejaron en fetchLocationsData
        } else {
             // Manejar caso donde data no es null pero no tiene results
             showMessageInContainer("No se encontraron localizaciones para esta página.");
             paginationContainer.empty();
        }
    }
    loadLocationsPage(1);
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