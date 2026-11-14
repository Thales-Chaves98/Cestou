import {salvarMercados, carregarMercados} from '../services/storage.js';

const nomeMercado = document.getElementById('mercado-nome');
const formMercado = document.getElementById('form-mercado');
 
const mercadoVazio = document.getElementById('mercados-vazio');
const listaMercados = document.getElementById('lista-mercados');

const totalMercados = document.getElementById('total-mercados');

let mercados = carregarMercados();


formMercado.addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarMercado();
    renderizarMercados();
    console.log(mercados);
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

        nomeMercado.innerHTML = m.nome;
        nomeMercado.classList.add('market-name');

        acoesMercado.innerHTML = `<button class="market-action" data-id="${m.id}">Editar</button> <button class="market-action market-action-danger" data-id="${m.id}">Excluir</button>`;
        acoesMercado.classList.add('market-actions');
        
        mercadoLI.append(nomeMercado, acoesMercado);
        mercadosUL.append(mercadoLI);
    })
    
    listaMercados.append(mercadosUL);
}

function atualizarContador(){

    if(mercados.length === 1) {
        totalMercados.innerHTML = `${mercados.length} MERCADO`;
    } else {
        totalMercados.innerHTML = `${mercados.length} MERCADOS`;
    }
}


renderizarMercados();
atualizarContador();