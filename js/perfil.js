/*
  perfil.js
  Comportamento compartilhado das páginas com usuário logado (logado, canteiros, catálogo):
  - protege as páginas internas (redireciona para o login se não houver sessão)
  - monta o menu logado no catálogo quando há sessão
  - menu do avatar (editar perfil / sair)
  - modal para trocar nome e avatar
*/
(function () {
  const AVATARES = [1, 2, 3, 4, 5, 6].map(n => "src/perfil/avatar" + n + ".svg");
  const AVATAR_PADRAO = "src/perfil/perfil.png";

  function lerUsuario() {
    try { return JSON.parse(localStorage.getItem("usuarioLogado")); } catch (e) { return null; }
  }

  let usuario = lerUsuario();
  const paginaProtegida = document.body.hasAttribute("data-protegida");

  if (paginaProtegida && !usuario) {
    window.location.replace("login.html");
    return;
  }

  // catálogo é público: com sessão ativa, troca o menu e o botão de login
  if (usuario && document.body.dataset.nav === "publico") {
    const menu = document.querySelector(".main-menu");
    if (menu) {
      menu.innerHTML =
        '<li class="main-menu__item"><a href="logado.html" class="main-menu__link">Início</a></li>' +
        '<li class="main-menu__item"><a href="catalogo.html" class="main-menu__link main-menu__link--ativo">Catálogo de Plantas</a></li>' +
        '<li class="main-menu__item"><a href="canteiros.html" class="main-menu__link">Canteiros</a></li>';
    }
    const login = document.querySelector('.topbar a[href="login.html"]');
    if (login) {
      const bloco = document.createElement("div");
      bloco.className = "perfil";
      bloco.innerHTML =
        '<img src="' + AVATAR_PADRAO + '" alt="Avatar do usuário" class="perfil__avatar" id="perfilAvatar">' +
        '<div class="perfil__menu" id="perfilMenu">' +
        '<a href="#" class="perfil__link" id="editarPerfilLink">Editar Perfil</a>' +
        '<a href="#" class="perfil__link" id="logoutLink">Sair</a></div>';
      login.replaceWith(bloco);
    }
  }

  const avatarEl = document.getElementById("perfilAvatar");
  const menuEl = document.getElementById("perfilMenu");
  const editarLink = document.getElementById("editarPerfilLink");
  const sairLink = document.getElementById("logoutLink");

  function aplicarUsuario() {
    if (!usuario) return;
    if (avatarEl) {
      avatarEl.src = usuario.avatar || AVATAR_PADRAO;
      avatarEl.title = usuario.nome || "";
    }
    document.querySelectorAll("[data-usuario-nome]").forEach(el => {
      el.textContent = (usuario.nome || "").split(" ")[0];
    });
  }
  aplicarUsuario();

  if (avatarEl && menuEl) {
    avatarEl.addEventListener("click", e => { menuEl.classList.toggle("show"); e.stopPropagation(); });
    document.addEventListener("click", e => {
      if (!menuEl.contains(e.target) && e.target !== avatarEl) menuEl.classList.remove("show");
    });
  }

  if (sairLink) {
    sairLink.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("usuarioLogado");
      window.location.href = "login.html";
    });
  }

  // ---------- modal de edição ----------
  let modal = null;
  let avatarEscolhido = "";

  function criarModal() {
    modal = document.createElement("div");
    modal.className = "perfil-modal";
    modal.innerHTML =
      '<div class="perfil-modal__content" role="dialog" aria-modal="true" aria-labelledby="perfilModalTitulo">' +
      '<button type="button" class="perfil-modal__close" aria-label="Fechar">&times;</button>' +
      '<h3 id="perfilModalTitulo">Editar perfil</h3>' +
      '<form id="formPerfil">' +
      '<div class="perfil-modal__atual"><img id="perfilPreview" alt="Avatar atual"></div>' +
      '<p class="perfil-modal__label">Escolha um avatar</p>' +
      '<div class="perfil-modal__avatares" id="perfilAvatares"></div>' +
      '<label class="perfil-modal__upload">Ou envie uma foto' +
      '<input type="file" accept="image/*" id="perfilArquivo" hidden></label>' +
      '<label class="perfil-modal__label" for="perfilNome">Nome</label>' +
      '<input type="text" id="perfilNome" class="perfil-modal__input" maxlength="60" required>' +
      '<div class="perfil-modal__acoes">' +
      '<button type="button" class="perfil-modal__btn perfil-modal__btn--sec" id="perfilCancelar">Cancelar</button>' +
      '<button type="submit" class="perfil-modal__btn">Salvar</button></div>' +
      '</form></div>';
    document.body.appendChild(modal);

    const grade = modal.querySelector("#perfilAvatares");
    [AVATAR_PADRAO].concat(AVATARES).forEach(src => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "perfil-modal__opcao";
      b.dataset.src = src;
      b.innerHTML = '<img src="' + src + '" alt="Avatar">';
      b.addEventListener("click", () => escolher(src));
      grade.appendChild(b);
    });

    modal.querySelector(".perfil-modal__close").addEventListener("click", fechar);
    modal.querySelector("#perfilCancelar").addEventListener("click", fechar);
    modal.addEventListener("click", e => { if (e.target === modal) fechar(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") fechar(); });

    modal.querySelector("#perfilArquivo").addEventListener("change", e => {
      const arquivo = e.target.files[0];
      if (!arquivo) return;
      reduzirImagem(arquivo).then(escolher).catch(() => alert("Não foi possível ler essa imagem."));
    });

    modal.querySelector("#formPerfil").addEventListener("submit", e => {
      e.preventDefault();
      salvar(modal.querySelector("#perfilNome").value.trim());
    });
  }

  function reduzirImagem(arquivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const lado = 128;
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = lado;
          const corte = Math.min(img.width, img.height);
          canvas.getContext("2d").drawImage(img, (img.width - corte) / 2, (img.height - corte) / 2, corte, corte, 0, 0, lado, lado);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(arquivo);
    });
  }

  function escolher(src) {
    avatarEscolhido = src;
    modal.querySelector("#perfilPreview").src = src;
    modal.querySelectorAll(".perfil-modal__opcao").forEach(b =>
      b.classList.toggle("perfil-modal__opcao--ativa", b.dataset.src === src));
  }

  function abrir() {
    if (!modal) criarModal();
    modal.querySelector("#perfilNome").value = usuario.nome || "";
    escolher(usuario.avatar || AVATAR_PADRAO);
    modal.classList.add("perfil-modal--aberto");
    if (menuEl) menuEl.classList.remove("show");
  }

  function fechar() {
    if (modal) modal.classList.remove("perfil-modal--aberto");
  }

  function salvar(nome) {
    if (!nome) return;
    usuario = Object.assign({}, usuario, { nome: nome, avatar: avatarEscolhido === AVATAR_PADRAO ? "" : avatarEscolhido });
    try {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      // mantém o "banco" de usuários em sincronia (a senha não é alterada)
      const lista = JSON.parse(localStorage.getItem("horta_usuarios")) || [];
      const alvo = lista.find(u => u.email && usuario.email && u.email.toLowerCase() === usuario.email.toLowerCase());
      if (alvo) {
        alvo.nome = usuario.nome;
        alvo.avatar = usuario.avatar;
        localStorage.setItem("horta_usuarios", JSON.stringify(lista));
      }
    } catch (e) {
      alert("Não foi possível salvar: o armazenamento do navegador está cheio ou bloqueado.");
      return;
    }
    aplicarUsuario();
    fechar();
  }

  if (editarLink) {
    editarLink.addEventListener("click", e => { e.preventDefault(); abrir(); });
  }
})();
