$(document).ready(function() {

    // URL base de la API de Rick y Morty
    const API_URL = "https://rickandmortyapi.com/api/";

    // Referencias a los contenedores en el HTML
    const seasonsContainer = $('#seasons-container');
    const episodesListContainer = $('#episodes-list');

    let allEpisodes = [];
    let isEpisodesLoaded = false;

    // Función para limpiar el contenido de la lista de episodios
    function clearEpisodesList() {
        episodesListContainer.empty();
    }

    // Función para mostrar un mensaje en el contenedor de episodios
    function showMessageInEpisodesList(message) {
        clearEpisodesList();
        episodesListContainer.append(`<div class="col-12"><p class="text-center">${message}</p></div>`);
    }

    // Función para obtener *todos* los episodios de la API (maneja la paginación interna de la API)
    async function fetchAllEpisodes(url = `${API_URL}episode`) {
        try {
            // Mostrar mensaje de carga inicial solo la primera vez
            if (!isEpisodesLoaded) {
                 showMessageInEpisodesList("Cargando todos los episodios...");
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.status}`);
            }
            const data = await response.json();

            // Añadir los resultados a nuestra lista total
            allEpisodes = allEpisodes.concat(data.results);

            if (data.info.next) {
                await fetchAllEpisodes(data.info.next);
            } else {
                // Si no hay más páginas, hemos terminado de cargar
                isEpisodesLoaded = true;
                console.log(`Total de episodios cargados: ${allEpisodes.length}`);
                // Mostrar el mensaje inicial después de cargar todo
                 showMessageInEpisodesList("Selecciona una temporada para ver los episodios.");
                 // Opcional: Habilitar visualmente las tarjetas de temporada si estaban deshabilitadas
                 seasonsContainer.find('.season-card').removeClass('disabled').css('cursor', 'pointer');
            }
        } catch (error) {
            console.error("Error fetching all episodes:", error);
            isEpisodesLoaded = false; // Marcar como no cargado si hay un error
            showMessageInEpisodesList(`Error al cargar todos los episodios: ${error.message}`);
             // Opcional: Deshabilitar clics en tarjetas de temporada en caso de error grave
             seasonsContainer.find('.season-card').addClass('disabled').css('cursor', 'not-allowed');
        }
    }

    // Función para renderizar una lista de episodios en el contenedor
    function renderEpisodesList(episodes) {
        clearEpisodesList(); // Limpiamos el contenido anterior

        if (!episodes || episodes.length === 0) {
            showMessageInEpisodesList("No se encontraron episodios para esta temporada.");
            return;
        }

        episodes.forEach(episode => {
            const episodeHtml = `
                <div class="episode-item mb-3 p-3 border rounded">
                    <div class="row align-items-center">
                        <div class="col-md-2 text-center">
                            <img src="media/img/RYMFoto1.png" alt="Imagen de episodio" class="img-fluid rounded">
                        </div>
                        <div class="col-md-10">
                            <h5 class="episode-title">${episode.episode} - ${episode.name}</h5>
                            <p class="episode-air-date">Fecha de estreno: ${episode.air_date}</p>
                            </div>
                    </div>
                </div>
            `;
            episodesListContainer.append(episodeHtml);
        });
    }

    function filterEpisodesBySeason(seasonNumber) {
        const seasonCode = `S${String(seasonNumber).padStart(2, '0')}`; // Formato "S01", "S02", etc.
        return allEpisodes.filter(episode => episode.episode.startsWith(seasonCode));
    }


    // Cargar todos los episodios de la API al iniciar la página
    fetchAllEpisodes();

    seasonsContainer.find('.season-card').on('click', function() {
        // Solo permitir clic si los episodios ya se cargaron
        if (isEpisodesLoaded) {
            const selectedSeason = $(this).data('season'); // Obtener el número de temporada del atributo data-season
            console.log(`Temporada seleccionada: ${selectedSeason}`);

            showMessageInEpisodesList(`Cargando episodios de la Temporada ${selectedSeason}...`);

            // Filtrar y renderizar los episodios de la temporada seleccionada
            const episodesForSeason = filterEpisodesBySeason(selectedSeason);
            renderEpisodesList(episodesForSeason);

            // Opcional: Resaltar la tarjeta de temporada seleccionada
            seasonsContainer.find('.season-card').removeClass('active-season');
            $(this).addClass('active-season');

        } else {
            // Si los episodios aún no se han cargado, mostrar un mensaje
            showMessageInEpisodesList("Por favor, espera mientras cargamos todos los episodios...");
        }
    });


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