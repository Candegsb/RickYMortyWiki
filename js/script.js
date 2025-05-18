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
            case 'PERSONAJES': // Nota: Cambié a mayúsculas para que coincida con el texto del enlace
                data = await fetchData('character');
                if (data) {
                    renderCharacters(data.results);
                }
                break;
            case 'EPISODIOS': // Nota: Cambié a mayúsculas
                 data = await fetchData('episode');
                 if (data) {
                     renderEpisodes(data.results);
                 }
                break;
            case 'LOCALIZACIONES': // Nota: Cambié a mayúsculas
                data = await fetchData('location');
                 if (data) {
                     renderLocations(data.results);
                 }
                break;
            case 'INICIO': // Nota: Cambié a mayúsculas
                 clearDynamicContent();
                 // Podrías añadir aquí lógica para mostrar el contenido original del inicio si es necesario
                 break;
            case 'OTROS': // Nota: Cambié a mayúsculas
                 showMessage("Contenido 'Otros' aún no disponible.");
                 break;
            case 'JUEGO': // Añadir el caso para el enlace "JUEGO" si existe en el HTML principal
                 showMessage("Contenido 'Juego' aún no disponible.");
                 break;
            default:
                showMessage("Categoría no reconocida.");
                break;
        }
    }

    // Elimina o comenta este bloque:
    /*
    $('.navbar-nav .nav-link').on('click', function(event) {
        event.preventDefault();

        $('.navbar-nav .nav-link').removeClass('active');
        $(this).addClass('active');

        const category = $(this).text();
        loadContent(category);
    });
    */
   
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contacto-form");
  const respuesta = document.getElementById("respuesta-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !email || !mensaje) {
      respuesta.textContent = "¡Completa todos los campos, viajero dimensional!";
      respuesta.style.color = "var(--secondary-color-yellow)";
      return;
    }

    // Simulación de envío exitoso
    respuesta.textContent = "¡Tu mensaje fue enviado al Consejo de Ricks!";
    respuesta.style.color = "var(--primary-color-green)";
    form.reset();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".slider-track");
  const items = document.querySelectorAll(".slider-item");
  const btnLeft = document.querySelector(".slider-btn.left");
  const btnRight = document.querySelector(".slider-btn.right");

  let currentIndex = 0;

  const updateSlider = () => {
    const itemWidth = items[0].offsetWidth + 20; // 20px de gap
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  };

  btnLeft.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  btnRight.addEventListener("click", () => {
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener("resize", updateSlider);
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

document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".slider-track");
    const items = document.querySelectorAll(".slider-item");
    const prevBtn = document.querySelector(".slider-btn.left");
    const nextBtn = document.querySelector(".slider-btn.right");

    let index = 0;
    const itemCount = items.length;

    function updateSlider() {
      const offset = index * (items[0].offsetWidth + 20); // item + gap
      track.style.transform = `translateX(-${offset}px)`;
    }

    function goNext() {
      index = (index + 1) % itemCount;
      updateSlider();
    }

    function goPrev() {
      index = (index - 1 + itemCount) % itemCount;
      updateSlider();
    }

    // Botones
    nextBtn.addEventListener("click", goNext);
    prevBtn.addEventListener("click", goPrev);

    // Autoplay
    let autoplayInterval = setInterval(goNext, 3000); // cada 3 segundos

    // Pausar autoplay al pasar el mouse
    track.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
    track.addEventListener("mouseleave", () => {
      autoplayInterval = setInterval(goNext, 5000);
    });

    // Ajuste inicial
    window.addEventListener("resize", updateSlider);
    updateSlider();
  });