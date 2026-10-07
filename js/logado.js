const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const plantasPorMes = {
  0: [
    { nome: "Alface", img: "src/plantas/alface.jpg" },
    { nome: "Manjericão", img: "src/plantas/manjericao.jpg" },
    { nome: "Cebolinha", img: "src/plantas/cebolinha.jpg" },
    { nome: "Rúcula", img: null }
  ]
};

const mesAtual = new Date().getMonth();

const container = document.getElementById("plantas-mes");
const spanMes = document.getElementById("mes-atual");
const seletor = document.getElementById("seletor-mes");

function renderPlantas(mes) {
  if (!container || !plantasPorMes[mes]) return;

  container.innerHTML = "";

  if (spanMes) {
    spanMes.innerText = meses[mes];
  }

  plantasPorMes[mes].forEach(planta => {
    const div = document.createElement("div");
    div.className = "planta-item";
    div.innerHTML = `
      <img src="${planta.img || ''}" alt="${planta.nome}">
      <small>${planta.nome}</small>
    `;
    container.appendChild(div);
    if (!planta.img && window.HortaPlantas) {
      const dados = HortaPlantas.buscarPorNome(planta.nome);
      if (dados) {
        HortaPlantas.obterImagem(dados).then(url => {
          if (url) div.querySelector("img").src = url;
        });
      }
    }
  });
}

if (seletor) {
  seletor.value = mesAtual;
  renderPlantas(mesAtual);

  seletor.addEventListener("change", e => {
    renderPlantas(Number(e.target.value));
  });
}

// --- CANTEIROS (mesmos dados da página de canteiros) ---
(function () {
  const grid = document.getElementById("home-canteiros");
  if (!grid) return;
  const novo = grid.querySelector(".canteiro-card--new");
  let lista = null;
  try { lista = JSON.parse(localStorage.getItem("horta_canteiros")); } catch (e) { lista = null; }
  if (!Array.isArray(lista)) {
    lista = [
      { nome: "PANCs", plantas: [{ nome: "Ora-pro-nóbis", img: "src/plantas/orapronobis.png" }, { nome: "Peixinho-da-horta", img: "src/plantas/peixinho.png" }] },
      { nome: "Temperos", plantas: [{ nome: "Orégano", img: "src/plantas/oregano.jpg" }, { nome: "Manjerona", img: "src/plantas/manjerona.jpg" }] }
    ];
  }
  lista.forEach(c => {
    const card = document.createElement("div");
    card.className = "card canteiro-card";
    const titulo = document.createElement("h3");
    titulo.className = "card__title";
    titulo.textContent = "\u{1F33F} " + c.nome;
    const itens = document.createElement("div");
    itens.className = "card__list";
    (c.plantas || []).forEach(p => {
      const item = document.createElement("div");
      item.className = "list__item";
      const img = document.createElement("img");
      img.className = "list__item-img";
      img.alt = p.nome;
      img.src = p.img || "src/plantas/sem-foto.svg";
      const nome = document.createElement("span");
      nome.className = "list__item-name";
      nome.textContent = p.nome;
      item.append(img, nome);
      itens.appendChild(item);
    });
    card.append(titulo, itens);
    grid.insertBefore(card, novo);
  });
})();

// --- PLANTAS PARA A ESTAÇÃO ---
(function () {
  const box = document.getElementById("home-plantas");
  if (!box || !window.HortaPlantas) return;
  const est = HortaPlantas.estacaoAtual();
  document.getElementById("home-estacao").textContent = HortaPlantas.NOMES_ESTACAO[est].toLowerCase();
  const preferidas = ["Alface", "Cebolinha", "Manjericão", "Tomate", "Cenoura", "Salsa", "Coentro", "Couve", "Rabanete", "Beterraba"];
  preferidas
    .map(n => HortaPlantas.buscarPorNome(n))
    .filter(p => p && HortaPlantas.plantarEm(p, est))
    .slice(0, 3)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card plant-card";
      const img = document.createElement("img");
      img.className = "plant-card__img";
      img.alt = p.nome;
      img.src = "src/plantas/sem-foto.svg";
      HortaPlantas.obterImagem(p).then(url => { if (url) img.src = url; });
      const t = document.createElement("h3");
      t.className = "plant-card__title";
      t.textContent = p.nome;
      const info = document.createElement("p");
      info.className = "plant-card__info";
      info.textContent = p.sol + " • Rega " + p.rega.toLowerCase();
      card.append(img, t, info);
      box.appendChild(card);
    });
})();
