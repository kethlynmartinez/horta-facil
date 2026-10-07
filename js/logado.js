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
