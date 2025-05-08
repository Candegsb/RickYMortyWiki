$(document).ready(function() {

    const API_URL = "https://rickandmortyapi.com/api/";

    const dynamicContentSection = $('#dynamic-content');

    function clearDynamicContent() {
        dynamicContentSection.empty();
    }

    function showMessage(message) {
        clearDynamicContent();
        dynamicContentSection.append(`<div class="col-12"><p class="text-center">${message}</p></div>`);
    }

    async function fetchData(endpoint) {
        try {
            showMessage("Cargando datos...");
            const response = await fetch(API_URL + endpoint);
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            showMessage(`Error al cargar datos: ${error.message}`);
            return null;
        }
    }

    function renderCharacters(characters) {
        clearDynamicContent();
        if (!characters || characters.length === 0) {
            showMessage("No se encontraron personajes.");
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
            dynamicContentSection.append(cardHtml);
        });
    }

    function renderEpisodes(episodes) {
        clearDynamicContent();
        if (!episodes || episodes.length === 0) {
            showMessage("No se encontraron episodios.");
            return;
        }

        episodes.forEach(episode => {
            const cardHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${episode.episode} - ${episode.name}</h5>
                            <p class="card-text">Fecha de estreno: ${episode.air_date}</p>
                        </div>
                    </div>
                </div>
            `;
            dynamicContentSection.append(cardHtml);
        });
    }

    function renderLocations(locations) {
        clearDynamicContent();
        if (!locations || locations.length === 0) {
            showMessage("No se encontraron localizaciones.");
            return;
        }

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
            dynamicContentSection.append(cardHtml);
        });
    }


    async function loadContent(category) {
        let data = null;
        switch (category) {
            case 'Personajes':
                data = await fetchData('character');
                if (data) {
                    renderCharacters(data.results);
                }
                break;
            case 'Episodios':
                 data = await fetchData('episode');
                 if (data) {
                     renderEpisodes(data.results);
                 }
                break;
            case 'Localizaciones':
                data = await fetchData('location');
                 if (data) {
                     renderLocations(data.results);
                 }
                break;
            case 'Inicio':
                 clearDynamicContent();
                 break;
            case 'Otros':
                 showMessage("Contenido 'Otros' aún no disponible.");
                 break;
            default:
                showMessage("Categoría no reconocida.");
                break;
        }
    }

    $('.navbar-nav .nav-link').on('click', function(event) {
        event.preventDefault();

        $('.navbar-nav .nav-link').removeClass('active');
        $(this).addClass('active');

        const category = $(this).text();
        loadContent(category);
    });


});
