const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const plantasPorMes = {
  0: [
    { nome: "Alface", img: "src/plantas/alface.jpg" },
    { nome: "Manjericão", img: "src/plantas/manjericao.jpg" },
    { nome: "Cebolinha", img: "src/plantas/cebolinha.jpg" },
    { nome: "Rúcula", img: "src/plantas/rucula.jpg" }
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
      <img src="${planta.img}" alt="${planta.nome}">
      <small>${planta.nome}</small>
    `;
    container.appendChild(div);
  });
}

if (seletor) {
  seletor.value = mesAtual;
  renderPlantas(mesAtual);

  seletor.addEventListener("change", e => {
    renderPlantas(Number(e.target.value));
  });
}

// --- MENU DE PERFIL ---

const perfilAvatar = document.getElementById('perfilAvatar');
const perfilMenu = document.getElementById('perfilMenu');
const logoutLink = document.getElementById('logoutLink');
const editarPerfilLink = document.getElementById('editarPerfilLink');

// 1. Alterna a visibilidade do menu ao clicar no avatar
if(perfilAvatar && perfilMenu) {
    perfilAvatar.addEventListener('click', function(event) {
        perfilMenu.classList.toggle('show');
        event.stopPropagation();
    });

    // 2. Fecha o menu se o usuário clicar em qualquer lugar fora dele
    document.addEventListener('click', function(event) {
        if (!perfilMenu.contains(event.target) && !perfilAvatar.contains(event.target)) {
            if (perfilMenu.classList.contains('show')) {
                perfilMenu.classList.remove('show');
            }
        }
    });
}

// 3. Funcionalidade de Sair (Logout)
if(logoutLink) {
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
}

// 4. Funcionalidade de Editar Perfil
if(editarPerfilLink) {
    editarPerfilLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Funcionalidade de Editar Perfil: Redirecionando para a página de edição...");
        // window.location.href = 'editar-perfil.html';
        perfilMenu.classList.remove('show');
    });
}