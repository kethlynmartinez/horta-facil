(function () {
  const TAM_PAGINA = 24;
  const todas = HortaPlantas.todas;
  const grid = document.getElementById("catalogo-grid");
  const busca = document.getElementById("catalogo-busca");
  const filtros = document.getElementById("catalogo-filtros");
  const contagem = document.getElementById("catalogo-contagem");
  const btnMais = document.getElementById("catalogo-mais");

  const PLACEHOLDER = "src/plantas/sem-foto.svg";

  const selEstacao = document.getElementById("catalogo-estacao");
  const estacaoAtual = HortaPlantas.estacaoAtual();
  [["todas", "Todas as estações"]].concat(HortaPlantas.ORDEM_ESTACOES.map(e =>
    [e, HortaPlantas.NOMES_ESTACAO[e] + (e === estacaoAtual ? " (agora)" : "")]
  )).forEach(([valor, texto]) => {
    const o = document.createElement("option");
    o.value = valor;
    o.textContent = texto;
    selEstacao.appendChild(o);
  });

  let categoria = "Todas";
  let termo = "";
  let visiveis = TAM_PAGINA;

  function montarFiltros() {
    ["Todas"].concat(HortaPlantas.categorias).forEach(cat => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (cat === categoria ? " chip--ativo" : "");
      b.textContent = cat;
      b.addEventListener("click", () => {
        categoria = cat;
        visiveis = TAM_PAGINA;
        filtros.querySelectorAll(".chip").forEach(c => c.classList.toggle("chip--ativo", c === b));
        render();
      });
      filtros.appendChild(b);
    });
  }

  function filtrar() {
    const t = HortaPlantas.normalizar(termo);
    return todas.filter(p =>
      (categoria === "Todas" || p.categoria === categoria) &&
      (selEstacao.value === "todas" || HortaPlantas.plantarEm(p, selEstacao.value)) &&
      (!t || HortaPlantas.normalizar(p.nome).includes(t) || HortaPlantas.normalizar(p.cientifico).includes(t))
    );
  }

  function criarSelo(e, ativo) {
    const s = document.createElement("span");
    s.className = "selo" + (ativo ? " selo--ativo" : "");
    s.textContent = HortaPlantas.NOMES_ESTACAO[e];
    s.title = HortaPlantas.NOMES_ESTACAO[e] + (ativo ? ": época indicada" : ": fora de época");
    return s;
  }

  // ---------- detalhe da planta ----------
  const modal = document.getElementById("planta-modal");

  function preencherTags(id, nomes, vazio) {
    const box = document.getElementById(id);
    box.innerHTML = "";
    if (!nomes.length) {
      const s = document.createElement("span");
      s.className = "tags__vazio";
      s.textContent = vazio;
      box.appendChild(s);
      return;
    }
    nomes.forEach(n => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tag";
      b.textContent = n;
      b.addEventListener("click", () => {
        const alvo = HortaPlantas.buscarPorNome(n);
        if (alvo) abrirDetalhe(alvo, "");
      });
      box.appendChild(b);
    });
  }

  function abrirDetalhe(p, src) {
    const img = document.getElementById("planta-modal-img");
    img.alt = p.nome;
    img.src = src || PLACEHOLDER;
    if (!src || src.endsWith(PLACEHOLDER)) {
      HortaPlantas.obterImagem(p).then(url => { if (url) img.src = url; });
    }
    document.getElementById("planta-modal-titulo").textContent = p.nome;
    document.getElementById("planta-modal-sci").textContent = p.cientifico;
    document.getElementById("planta-modal-info").textContent = p.categoria + " • " + p.sol + " • Rega " + p.rega.toLowerCase();
    const est = document.getElementById("planta-modal-estacoes");
    est.innerHTML = "";
    HortaPlantas.ORDEM_ESTACOES.forEach(e => est.appendChild(criarSelo(e, (p.estacoes || []).includes(e))));
    preencherTags("planta-modal-boas", HortaPlantas.companheiras(p.nome), "Sem combinações registradas para esta planta.");
    preencherTags("planta-modal-ruins", HortaPlantas.evitarPerto(p.nome), "Nenhuma restrição registrada.");
    modal.hidden = false;
  }

  function fecharDetalhe() { modal.hidden = true; }
  document.getElementById("planta-modal-fechar").addEventListener("click", fecharDetalhe);
  modal.addEventListener("click", e => { if (e.target === modal) fecharDetalhe(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") fecharDetalhe(); });
  selEstacao.addEventListener("change", () => { visiveis = TAM_PAGINA; render(); });

  function criarCard(p) {
    const card = document.createElement("div");
    card.className = "card plant-card";
    const img = document.createElement("img");
    img.className = "plant-card__img plant-card__img--carregando";
    img.alt = p.nome;
    img.loading = "lazy";
    img.src = PLACEHOLDER;
    const titulo = document.createElement("h3");
    titulo.className = "plant-card__title";
    titulo.textContent = p.nome;
    const cient = document.createElement("p");
    cient.className = "plant-card__sci";
    cient.textContent = p.cientifico;
    const info = document.createElement("p");
    info.className = "plant-card__info";
    info.textContent = p.sol + " • Rega " + p.rega.toLowerCase();
    const tag = document.createElement("span");
    tag.className = "plant-card__tag";
    tag.textContent = p.categoria;
    card.append(img, titulo, cient, info, tag);
    if (p.estacoes) {
      const sel = document.createElement("div");
      sel.className = "estacoes estacoes--mini";
      HortaPlantas.ORDEM_ESTACOES.forEach(e => sel.appendChild(criarSelo(e, p.estacoes.includes(e))));
      card.appendChild(sel);
    }
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.addEventListener("click", () => abrirDetalhe(p, img.src));
    card.addEventListener("keydown", e => { if (e.key === "Enter") abrirDetalhe(p, img.src); });

    HortaPlantas.obterImagem(p).then(url => {
      if (url) {
        img.onerror = () => { img.src = PLACEHOLDER; img.classList.add("plant-card__img--vazia"); };
        img.src = url;
      } else {
        img.classList.add("plant-card__img--vazia");
      }
      img.classList.remove("plant-card__img--carregando");
    });
    return card;
  }

  function render() {
    const lista = filtrar();
    grid.innerHTML = "";
    lista.slice(0, visiveis).forEach(p => grid.appendChild(criarCard(p)));
    contagem.textContent = lista.length + (lista.length === 1 ? " planta encontrada" : " plantas encontradas");
    btnMais.style.display = lista.length > visiveis ? "inline-block" : "none";
    if (!lista.length) grid.innerHTML = '<p class="catalog-vazio">Nenhuma planta encontrada para essa busca.</p>';
  }

  busca.addEventListener("input", () => { termo = busca.value; visiveis = TAM_PAGINA; render(); });
  btnMais.addEventListener("click", () => { visiveis += TAM_PAGINA; render(); });

  montarFiltros();
  render();
})();
