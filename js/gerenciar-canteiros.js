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

    let canteiros = [
        { id: 1, nome: "PANCs", plantas: [{nome: "Ora pro nobis", img: "src/plantas/orapronobis.png"}, {nome: "Peixinho da horta", img: "src/plantas/peixinho.png"}] },
        { id: 2, nome: "Temperos", plantas: [{nome: "Orégano", img: "src/plantas/oregano.jpg"}, {nome: "Manjerona", img: "src/plantas/manjerona.jpg"}] },
    ];

    function renderCanteiros() {
        document.querySelectorAll(".canteiro-card:not(.novo-canteiro)").forEach(card => card.remove());

        canteiros.forEach(canteiro => {
            const card = document.createElement("div");
            card.className = "canteiro-card";
            card.innerHTML = `
                <h3>■ ${canteiro.nome}</h3>
                <div class="plantas">
                    ${canteiro.plantas.map(p => `
                        <div class="planta">
                            <img src="${p.img}" alt="${p.nome}" class="plant-img-thumb">
                            <span>${p.nome}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="canteiro-actions">
                    <button class="action-btn edit-btn" onclick="openEditModal(${canteiro.id})" title="Editar">&#9998;</button>
                    <button class="action-btn delete-btn" onclick="openDeleteModal(${canteiro.id}, '${canteiro.nome}')" title="Excluir">&#128465;</button>
                </div>
            `;
            canteirosContainer.insertBefore(card, addCanteiroCard);
        });
    }

    function addPlantInput(name = '', img = '') {
        if (plantasInputsContainer.children.length >= 2) {
            alert("Limite máximo de 2 plantas por canteiro atingido.");
            return;
        }
        const div = document.createElement("div");
        div.className = "form-group plant-input-group";
        div.innerHTML = `
            <label class="form-group__label">Planta ${plantasInputsContainer.children.length + 1}</label>
            <input type="text" placeholder="Nome da planta" value="${name}" class="form-group__input plant-name-input" required>
            <button type="button" class="btn-action remove-plant-btn">Remover</button>
        `;
        plantasInputsContainer.appendChild(div);
        
        div.querySelector('.remove-plant-btn').addEventListener('click', () => {
            div.remove();
        });
    }

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

    addPlantBtn.addEventListener("click", addPlantInput);

    window.openDeleteModal = function(id, name) {
        canteiroIdInput.value = id;
        canteiroNameToDelete.textContent = name;
        modalConfirmDelete.style.display = "flex";
    }

    confirmDeleteBtn.addEventListener("click", () => {
        const idToDelete = Number(canteiroIdInput.value);
        canteiros = canteiros.filter(c => c.id !== idToDelete);
        alert("Canteiro excluído com sucesso!");
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
        
        const plantasNomes = Array.from(document.querySelectorAll('.plant-name-input')).map(input => input.value);
        const plantasImgs = Array.from(document.querySelectorAll('.plant-img-input')).map(input => input.value);
        const plantasData = plantasNomes.map((name, index) => ({ nome: name, img: plantasImgs[index] }));

        if (id) {
            const canteiro = canteiros.find(c => c.id == id);
            if (canteiro) {
                canteiro.nome = nome;
                canteiro.plantas = plantasData;
                alert("Canteiro editado com sucesso!");
            }
        } else {
            const novoId = Date.now();
            canteiros.push({ id: novoId, nome: nome, plantas: plantasData });
            alert("Canteiro adicionado com sucesso!");
        }
        modalForm.style.display = "none";
        renderCanteiros();
    });

    renderCanteiros();
});