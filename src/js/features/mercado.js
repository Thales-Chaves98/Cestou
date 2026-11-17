import {salvarMercados, carregarMercados} from '../services/storage.js';

const nomeMercado = document.getElementById('mercado-nome');
const formMercado = document.getElementById('form-mercado');
 
const mercadoVazio = document.getElementById('mercados-vazio');
const listaMercados = document.getElementById('lista-mercados');

const totalMercados = document.getElementById('total-mercados');

const editarMercadoDialog = document.getElementById('dialog-editar-mercado');
const editarMercadoNome = document.getElementById('editar-mercado-nome');
const fecharEdicaoMercado = document.getElementById('fechar-edicao-mercado');
const cancelarEdicaoMercado = document.getElementById('cancelar-edicao-mercado');

const excluirMercadoDialog = document.getElementById('dialog-excluir-mercado');
const cancelarExclusaoMercado = document.getElementById('cancelar-exclusao-mercado');
const fecharExclusaoMercado = document.getElementById('fechar-exclusao-mercado');
const confirmarExclusaoMercado = document.getElementById('confirmar-exclusao-mercado');

let mercados = carregarMercados();

let editingMercadoId = null;
let deletingMercadoId = null;

formMercado.addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarMercado();
    renderizarMercados();
    console.log(mercados);
});

listaMercados.addEventListener('click', (e) => {
    const target = e.target;

    if(target.classList.contains('market-action')) {
        const id = target.dataset.id;

        if(target.classList.contains('editar-mercado')) {
            abrirEditarMercado(id);
        }
        if(target.classList.contains('excluir-mercado')) {
            abrirExcluirMercado(id);
        }
    }
});


editarMercadoDialog.addEventListener('submit', (e) => {
    e.preventDefault();

    const editingMercado = mercados.find((m) => m.id === editingMercadoId);

    const novoNome = editarMercadoNome.value.trim().toUpperCase();

    if(novoNome !== '') {
        editingMercado.nome = novoNome;
        salvarMercados(mercados);
        renderizarMercados();
        editarMercadoDialog.close();

        editingMercadoId = null;
        editarMercadoNome.value = '';
    };

});

cancelarEdicaoMercado.addEventListener('click', (e) => {
    e.preventDefault();

    editarMercadoDialog.close();
    editingMercadoId = null;
    editarMercadoNome.value = '';
});

fecharEdicaoMercado.addEventListener('click', (e) => {
    e.preventDefault();

    editarMercadoDialog.close();
    editingMercadoId = null;
    editarMercadoNome.value = '';
});

cancelarExclusaoMercado.addEventListener('click', (e) => {
    e.preventDefault();

    excluirMercadoDialog.close();
    deletingMercadoId = null;
});

fecharExclusaoMercado.addEventListener('click', (e) => {
    e.preventDefault();

    excluirMercadoDialog.close();
    deletingMercadoId = null;
});


confirmarExclusaoMercado.addEventListener('click', (e) => {
    e.preventDefault();

    mercados = mercados.filter((m) => m.id !== deletingMercadoId);
    salvarMercados(mercados);
    renderizarMercados();
    atualizarContador();

    deletingMercadoId = null;
    excluirMercadoDialog.close();
});

function adicionarMercado() {
    const nome = nomeMercado.value.trim().toUpperCase();

    const mercado = {
        id: crypto.randomUUID(),
        nome
    };

    if(nome !== '') {
        mercados.push(mercado);
        salvarMercados(mercados);
    }
    nomeMercado.value = '';
    atualizarContador();
}

function renderizarMercados() {

    if(mercados.length > 0) {
        mercadoVazio.style.display = 'none';
    } else {
        mercadoVazio.style.display = 'block';
    }

    listaMercados.innerHTML = '';

    const mercadosUL = document.createElement('ul');
    
    mercados.forEach((m) => {
        const mercadoLI = document.createElement('li');
        const nomeMercado = document.createElement('span');
        const acoesMercado = document.createElement('span');

        nomeMercado.textContent = m.nome;
        nomeMercado.classList.add('market-name');

        acoesMercado.innerHTML = `<button class="market-action editar-mercado" data-id="${m.id}">Editar</button> <button class="market-action market-action-danger excluir-mercado" data-id="${m.id}">Excluir</button>`;
        acoesMercado.classList.add('market-actions');
        
        mercadoLI.append(nomeMercado, acoesMercado);
        mercadosUL.append(mercadoLI);
    });
    
    listaMercados.append(mercadosUL);
}

function atualizarContador(){

    if(mercados.length === 1) {
        totalMercados.innerHTML = `${mercados.length} MERCADO`;
    } else {
        totalMercados.innerHTML = `${mercados.length} MERCADOS`;
    }
}

function abrirEditarMercado(id) {
    editingMercadoId = id;
    editarMercadoDialog.showModal();

    editarMercadoNome.value = mercados.find((m) => m.id === id).nome;
}

function abrirExcluirMercado(id) {
    deletingMercadoId = id;
    excluirMercadoDialog.showModal();
}

renderizarMercados();
atualizarContador();