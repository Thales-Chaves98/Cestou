import './services/storage.js';

const nomeMercado = document.getElementById('mercado-nome');
const formMercado = document.getElementById('form-mercado');
 
const mercadoVazio = document.getElementById('mercados-vazio');
const listaMercados = document.getElementById('lista-mercados');

const totalMercados = document.getElementById('total-mercados');

let mercados = [];


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
    }
    nomeMercado.value = '';
    atualizarContador();
    salvarMercados(mercados);
}


function renderizarMercados() {
    carregarMercados();

    if(mercados.length > 0) {
        mercadoVazio.style.display = 'none';
    } else {
        mercadoVazio.style.display = 'block';
    }

    listaMercados.innerHTML = '';

    const mercadosUL = document.createElement('ul');
    
    mercados.forEach((mercado) => {
        const mercadoLI = document.createElement('li');
        mercadoLI.textContent = mercado.nome;

        mercadosUL.append(mercadoLI);
    })
    
    listaMercados.append(mercadosUL);
}

function atualizarContador(){
    carregarMercados();

    if(mercados.length === 1) {
        totalMercados.innerHTML = `${mercados.length} MERCADO`;
    } else {
        totalMercados.innerHTML = `${mercados.length} MERCADOS`;
    }
}

renderizarMercados();