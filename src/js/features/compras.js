import {salvarCompras, carregarCompras} from '../services/storage.js';

const abrirNovaCompraBtn = document.getElementById("abrir-nova-compra");
const novaCompraDialog = document.getElementById("dialog-nova-compra");
const cancelarNovaCompra = document.getElementById("cancelar-nova-compra");
const fecharJanelaNovaCompra = document.getElementById("fechar-nova-compra");

const formCompra = document.getElementById("form-compra");
const nomeCompraInput = document.getElementById("compra-nome");

const comprasVazio = document.getElementById("compras-vazio");
const listaCompras = document.getElementById("lista-compras");
const totalCompras = document.getElementById("total-compras");


let compras = carregarCompras();

formCompra.addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarCompra();
    novaCompraDialog.close();
});

abrirNovaCompraBtn.addEventListener('click', (e) => {
    e.preventDefault();
    novaCompraDialog.showModal();
});

cancelarNovaCompra.addEventListener('click', (e) => {
    e.preventDefault();
    novaCompraDialog.close();
    nomeCompraInput.value = '';
});

fecharJanelaNovaCompra.addEventListener('click', (e) => {
    e.preventDefault();
    novaCompraDialog.close();
    nomeCompraInput.value = '';
});

function adicionarCompra(){

    const nome = nomeCompraInput.value.trim().toUpperCase();

    const compra = {
        id: crypto.randomUUID(),
        nome,
        status: "rascunho",
        criadaEm: new Date().toISOString()
    }

    if(nome !== ""){
        compras.push(compra);
        salvarCompras(compras);
    }

    nomeCompraInput.value = '';
    renderizarCompras();
    atualizarContador();
}

function renderizarCompras(){

    if(compras.length === 0){
        comprasVazio.style.display = "block";
        listaCompras.style.display = "none";
    } else {
        comprasVazio.style.display = "none";
        listaCompras.style.display = "block";
    }

    listaCompras.innerHTML = '';

    const CompraUL = document.createElement('ul');

    compras.forEach((c) => {
        const CompraLI = document.createElement('li');
        const nomeCompra = document.createElement('span');
        const dataCompra = document.createElement('span');

        nomeCompra.textContent = c.nome;
        dataCompra.textContent = new Date(c.criadaEm).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});
        CompraLI.appendChild(nomeCompra);
        CompraLI.appendChild(dataCompra);
        CompraUL.appendChild(CompraLI);
    });
    listaCompras.appendChild(CompraUL);
}

function atualizarContador(){
     if(compras.length === 1) {
        totalCompras.innerHTML = `${compras.length} COMPRA`;
    } else {
        totalCompras.innerHTML = `${compras.length} COMPRAS`;
    }
}

renderizarCompras();
atualizarContador();