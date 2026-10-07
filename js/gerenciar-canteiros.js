document.addEventListener("DOMContentLoaded", () => {
    const canteirosContainer = document.getElementById("canteiros-container");
    const addCanteiroCard = document.getElementById("add-canteiro-card");
    const modalForm = document.getElementById("modal-form");
    const closeBtnForm = document.querySelector(".close-btn");
    const formCanteiro = document.getElementById("formCanteiro");
    const nomeCanteiroInput = document.getElementById("nomeCanteiro");
    const canteiroIdInput = document.getElementById("canteiroId");
    const modalConfirmDelete = document.getElementById("modal-confirm-delete");
    const closeBtnDelete = document.querySelector(".close-btn-delete");
    const canteiroNameToDelete = document.getElementById("canteiro-name-to-delete");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const addPlantBtn = document.getElementById("add-plant-btn");
    const plantasInputsContainer = document.getElementById("plantas-inputs-container");

    const STORAGE_KEY = "horta_canteiros";
    const MAX_PLANTAS = 6;
    const padrao = [
        { id: 1, nome: "PANCs", plantas: [{nome: "Ora-pro-nóbis", img: "src/plantas/orapronobis.png"}, {nome: "Peixinho-da-horta", img: "src/plantas/peixinho.png"}] },
        { id: 2, nome: "Temperos", plantas: [{nome: "Orégano", img: "src/plantas/oregano.jpg"}, {nome: "Manjerona", img: "src/plantas/manjerona.jpg"}] },
    ];

    let canteiros;
    try { canteiros = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { canteiros = null; }
    if (!Array.isArray(canteiros)) canteiros = padrao;

    function salvar() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(canteiros)); }
        catch (e) { mostrarAviso("Não foi possível salvar: o armazenamento do navegador está cheio ou bloqueado.", "erro"); }
    }

    function escapar(t) {
        const d = document.createElement("div");
        d.textContent = t;
        return d.innerHTML;
    }

    const listaPlantas = document.getElementById("lista-plantas");
    HortaPlantas.todas.forEach(p => {
        const o = document.createElement("option");
        o.value = p.nome;
        listaPlantas.appendChild(o);
    });

    // reduz a foto enviada para caber no localStorage
    function lerFoto(arquivo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                const img = new Image();
                img.onerror = reject;
                img.onload = () => {
                    const max = 160;
                    const escala = Math.min(1, max / Math.max(img.width, img.height));
                    const canvas = document.createElement("canvas");
                    canvas.width = Math.round(img.width * escala);
                    canvas.height = Math.round(img.height * escala);
                    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL("image/jpeg", 0.8));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(arquivo);
        });
    }

    function resumoCompat(plantas) {
        const r = HortaPlantas.analisar(plantas.map(p => p.nome));
        if (r.ruins.length) {
            return '<p class="badge badge--alerta">Atenção: ' + r.ruins.map(par => escapar(par[0]) + ' e ' + escapar(par[1])).join('; ') + ' não combinam</p>';
        }
        if (r.boas.length) return '<p class="badge badge--ok">Boa combinação</p>';
        return "";
    }

    function renderCanteiros() {
        document.querySelectorAll(".canteiro-card:not(.novo-canteiro)").forEach(card => card.remove());

        canteiros.forEach(canteiro => {
            const card = document.createElement("div");
            card.className = "canteiro-card";
            card.innerHTML = `
                <h3>${escapar(canteiro.nome)}</h3>
                <div class="plantas">
                    ${canteiro.plantas.map(p => `
                        <div class="planta">
                            <img src="${p.img || 'src/plantas/sem-foto.svg'}" alt="${escapar(p.nome)}" class="plant-img-thumb${p.img ? '' : ' plant-img-thumb--vazia'}">
                            <span>${escapar(p.nome)}</span>
                        </div>
                    `).join('')}
                </div>
                ${resumoCompat(canteiro.plantas)}
                <div class="canteiro-actions">
                    <button class="action-btn edit-btn" onclick="openEditModal(${canteiro.id})" title="Editar">&#9998;</button>
                    <button class="action-btn delete-btn" onclick="openDeleteModal(${canteiro.id})" title="Excluir">&#128465;</button>
                </div>
            `;
            canteirosContainer.insertBefore(card, addCanteiroCard);
        });
    }

    function addPlantInput(name = '', img = '') {
        if (plantasInputsContainer.children.length >= MAX_PLANTAS) {
            mostrarAviso("Limite máximo de " + MAX_PLANTAS + " plantas por canteiro atingido.", "erro");
            return;
        }
        const div = document.createElement("div");
        div.className = "plant-input-group";
        div.innerHTML = `
            <div class="plant-input-group__foto">
                <img class="plant-preview" alt="" hidden>
                <span class="plant-preview-vazio">Sem foto</span>
            </div>
            <div class="plant-input-group__campos">
                <input type="text" list="lista-plantas" placeholder="Nome da planta (busque no catálogo)" class="form-group__input plant-name-input" required>
                <input type="hidden" class="plant-img-input">
                <div class="plant-input-group__acoes">
                    <label class="link-acao">Enviar foto
                        <input type="file" accept="image/*" class="plant-file-input" hidden>
                    </label>
                    <button type="button" class="link-acao link-acao--remover remove-plant-btn">Remover</button>
                </div>
            </div>
        `;
        plantasInputsContainer.appendChild(div);

        const nomeInput = div.querySelector(".plant-name-input");
        const imgInput = div.querySelector(".plant-img-input");
        const preview = div.querySelector(".plant-preview");
        const vazio = div.querySelector(".plant-preview-vazio");
        let fotoPropria = false;

        function mostrar(url) {
            imgInput.value = url || "";
            if (url) { preview.src = url; preview.hidden = false; vazio.hidden = true; }
            else { preview.hidden = true; vazio.hidden = false; }
        }

        // foto vinda do catálogo (API) quando o nome bate com uma espécie
        function sincronizarComCatalogo() {
            if (fotoPropria) return;
            const planta = HortaPlantas.buscarPorNome(nomeInput.value);
            if (!planta) { mostrar(""); return; }
            HortaPlantas.obterImagem(planta).then(url => {
                if (!fotoPropria && HortaPlantas.buscarPorNome(nomeInput.value) === planta) mostrar(url);
            });
        }

        nomeInput.value = name;
        if (img) { fotoPropria = true; mostrar(img); }
        else if (name) sincronizarComCatalogo();

        nomeInput.addEventListener("input", sincronizarComCatalogo);
        nomeInput.addEventListener("change", sincronizarComCatalogo);

        div.querySelector(".plant-file-input").addEventListener("change", async (e) => {
            const arquivo = e.target.files[0];
            if (!arquivo) return;
            try {
                mostrar(await lerFoto(arquivo));
                fotoPropria = true;
            } catch (err) {
                mostrarAviso("Não foi possível ler essa imagem.", "erro");
            }
        });

        div.querySelector('.remove-plant-btn').addEventListener('click', () => {
            div.remove();
        });
    }

    const compatBox = document.getElementById("compat-box");
    function atualizarCompat() {
        const nomes = Array.from(document.querySelectorAll(".plant-name-input")).map(i => i.value.trim()).filter(Boolean);
        const r = HortaPlantas.analisar(nomes);
        const partes = [];
        r.ruins.forEach(par => partes.push('<p class="compat__item compat__item--alerta">' + escapar(par[0]) + ' e ' + escapar(par[1]) + ' não combinam. Prefira canteiros separados.</p>'));
        r.boas.forEach(par => partes.push('<p class="compat__item compat__item--ok">' + escapar(par[0]) + ' e ' + escapar(par[1]) + ' combinam bem.</p>'));
        // sugestões a partir da primeira planta reconhecida
        const reconhecida = nomes.map(n => HortaPlantas.buscarPorNome(n)).find(Boolean);
        if (reconhecida) {
            const sug = HortaPlantas.companheiras(reconhecida.nome).filter(n => !nomes.some(x => HortaPlantas.normalizar(x) === HortaPlantas.normalizar(n))).slice(0, 5);
            if (sug.length) partes.push('<p class="compat__dica">Combina com ' + escapar(reconhecida.nome) + ': ' + sug.map(escapar).join(", ") + '.</p>');
            const semEstacao = nomes.map(n => HortaPlantas.buscarPorNome(n)).filter(p => p && p.estacoes && !HortaPlantas.plantarEm(p, HortaPlantas.estacaoAtual()));
            if (semEstacao.length) partes.push('<p class="compat__dica">Fora de época nesta estação: ' + semEstacao.map(p => escapar(p.nome)).join(", ") + '.</p>');
        }
        compatBox.innerHTML = partes.join("");
        compatBox.hidden = partes.length === 0;
    }
    plantasInputsContainer.addEventListener("input", atualizarCompat);
    plantasInputsContainer.addEventListener("change", atualizarCompat);
    new MutationObserver(atualizarCompat).observe(plantasInputsContainer, { childList: true });

    // planejamento por estação
    (function () {
        const atual = HortaPlantas.estacaoAtual();
        const sel = document.getElementById("plan-select");
        HortaPlantas.ORDEM_ESTACOES.forEach(e => {
            const o = document.createElement("option");
            o.value = e;
            o.textContent = HortaPlantas.NOMES_ESTACAO[e] + (e === atual ? " (agora)" : "");
            sel.appendChild(o);
        });
        sel.value = atual;

        function desenhar() {
            const est = sel.value;
            const nome = HortaPlantas.NOMES_ESTACAO[est].toLowerCase();
            document.getElementById("plan-estacao").textContent = nome;
            document.getElementById("plan-estacao-dicas").textContent = nome;
            const box = document.getElementById("plan-agora");
            box.innerHTML = "";
            HortaPlantas.sugestoesDaEstacao(est, 14).forEach(p => {
                const s = document.createElement("span");
                s.className = "tag";
                s.textContent = p.nome;
                box.appendChild(s);
            });
            const lista = document.getElementById("plan-dicas");
            lista.innerHTML = "";
            HortaPlantas.DICAS_ESTACAO[est].forEach(d => {
                const li = document.createElement("li");
                li.textContent = d;
                lista.appendChild(li);
            });
        }
        sel.addEventListener("change", desenhar);
        desenhar();
    })();

    addCanteiroCard.addEventListener("click", () => {
        canteiroIdInput.value = '';
        nomeCanteiroInput.value = '';
        plantasInputsContainer.innerHTML = '';
        addPlantInput();
        modalForm.style.display = "flex";
    });

    window.openEditModal = function(id) {
        const canteiro = canteiros.find(c => c.id === id);
        if (canteiro) {
            canteiroIdInput.value = canteiro.id;
            nomeCanteiroInput.value = canteiro.nome;
            plantasInputsContainer.innerHTML = '';
            canteiro.plantas.forEach(p => addPlantInput(p.nome, p.img));
            modalForm.style.display = "flex";
        }
    }

    addPlantBtn.addEventListener("click", () => addPlantInput());

    window.openDeleteModal = function(id) {
        const c = canteiros.find(x => x.id === id);
        canteiroIdInput.value = id;
        canteiroNameToDelete.textContent = c ? c.nome : "";
        modalConfirmDelete.style.display = "flex";
    }

    confirmDeleteBtn.addEventListener("click", () => {
        const idToDelete = Number(canteiroIdInput.value);
        canteiros = canteiros.filter(c => c.id !== idToDelete);
        salvar();
        mostrarAviso("Canteiro excluído.", "sucesso");
        modalConfirmDelete.style.display = "none";
        renderCanteiros();
    });

    closeBtnForm.addEventListener("click", () => {
        modalForm.style.display = "none";
    });

    closeBtnDelete.addEventListener("click", () => {
        modalConfirmDelete.style.display = "none";
    });

    window.onclick = function(event) {
        if (event.target == modalForm) {
            modalForm.style.display = "none";
        }
        if (event.target == modalConfirmDelete) {
            modalConfirmDelete.style.display = "none";
        }
    }

    formCanteiro.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = canteiroIdInput.value;
        const nome = nomeCanteiroInput.value;
        
        const plantasData = Array.from(document.querySelectorAll('.plant-input-group')).map(g => ({
            nome: g.querySelector('.plant-name-input').value.trim(),
            img: g.querySelector('.plant-img-input').value
        }));

        if (id) {
            const canteiro = canteiros.find(c => c.id == id);
            if (canteiro) {
                canteiro.nome = nome;
                canteiro.plantas = plantasData;
                mostrarAviso("Canteiro atualizado.", "sucesso");
            }
        } else {
            const novoId = Date.now();
            canteiros.push({ id: novoId, nome: nome, plantas: plantasData });
            mostrarAviso("Canteiro adicionado.", "sucesso");
        }
        salvar();
        modalForm.style.display = "none";
        renderCanteiros();
    });

    renderCanteiros();
});