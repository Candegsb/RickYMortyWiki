const imagenes = [
  "Cabezon.png", "GuardialTemporal.png", "JerryGusano.png", "MeeseeksBox.png",
  "Nave.png", "OjeteSucio.png", "PapaNoel.png", "PapaNoelFlotante.png",
  "Pistola.png", "Portal.png", "Rickinillo.png", "RickMortyAsomando.png",
  "RickMortyOjos.png", "RickTarro.png", "RobotMantequilla.png", "SnowBall.png"
];

const rutasBase = "media/Stickers/";

const dificultades = {
  facil: 4,
  medio: 6,
  dificil: 8
};

let cartasSeleccionadas = [];
let paresEncontrados = 0;

function iniciarJuego(nivel) {
  const cantidad = dificultades[nivel];
  let seleccionadas = imagenes.slice(0, cantidad);
  let pares = [...seleccionadas, ...seleccionadas];
  pares = pares.sort(() => Math.random() - 0.5);

const tablero = document.getElementById("juego");
tablero.innerHTML = "";

let columnas;
switch (nivel) {
  case 'facil':
    columnas = 4; // 8 cartas → 4x2
    break;
  case 'medio':
    columnas = 4; // 12 cartas → 4x3
    break;
  case 'dificil':
    columnas = 4; // 16 cartas → 4x4
    break;
}

tablero.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;


  pares.forEach((img) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-face", "card-front");

    const back = document.createElement("div");
    back.classList.add("card-face", "card-back");

    const imagen = document.createElement("img");
    imagen.src = rutasBase + img;
    back.appendChild(imagen);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.dataset.imagen = img;

    card.addEventListener("click", () => revelarCarta(card, cantidad));
    tablero.appendChild(card);
  });

  cartasSeleccionadas = [];
  paresEncontrados = 0;
}


function revelarCarta(card, totalPares) {
  if (card.classList.contains("revelada") || cartasSeleccionadas.length === 2) return;

  card.classList.add("revelada");
  cartasSeleccionadas.push(card);

  if (cartasSeleccionadas.length === 2) {
    const [c1, c2] = cartasSeleccionadas;
    if (c1.dataset.imagen === c2.dataset.imagen) {
      paresEncontrados++;
      cartasSeleccionadas = [];
      checkVictoria(totalPares);
    } else {
      setTimeout(() => {
        c1.classList.remove("revelada");
        c2.classList.remove("revelada");
        cartasSeleccionadas = [];
      }, 1000);
    }
  }
}


function checkVictoria(totalPares) {
  if (paresEncontrados === totalPares) {
    setTimeout(() => {
      alert("¡Felicidades! Has completado el juego 🎉");
    }, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const transicion = document.getElementById("pantalla-transicion");

  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    if (
      link.getAttribute("href").startsWith("#") ||
      link.hasAttribute("target")
    ) return;

    link.addEventListener("click", function (e) {
      e.preventDefault();
      const destino = this.getAttribute("href");
      transicion.classList.add("activa");
      setTimeout(() => {
        window.location.href = destino;
      }, 500);
    });
  });
});