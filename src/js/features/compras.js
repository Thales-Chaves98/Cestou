import {salvarCompras, carregarCompras} from '../services/storage.js';

const abrirNovaCompraBtn = document.getElementById("abrir-nova-compra");
const novaCompraDialog = document.getElementById("dialog-nova-compra");
const cancelarNovaCompra = document.getElementById("cancelar-nova-compra");
const fecharJanelaNovaCompra = document.getElementById("fechar-nova-compra");

const formCompra = document.getElementById("form-compra");
const nomeCompraInput = document.getElementById("compra-nome");

const listaCompras = document.getElementById("lista-compras");
const comprasVazio = document.getElementById("compras-vazio");
const totalCompras = document.getElementById("total-compras");

const resumoCompras = document.getElementById("resumo-compras");
const resumoRascunho = document.getElementById("resumo-rascunhos");
const resumoFinalizadas = document.getElementById("resumo-finalizadas");

const excluirCompraDialog = document.getElementById("dialog-excluir-compra");
const fecharExclusaoCompra = document.getElementById("fechar-exclusao-compra");
const cancelarExclusaoCompra = document.getElementById("cancelar-exclusao-compra");

let compras = carregarCompras();

let editingCompraId = null;
let deletingCompraId = null;


formCompra.addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarCompra();
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

listaCompras.addEventListener('click', (e) => {
    const btn = e.target.closest('button');

    if(!btn) return;
    if(btn.classList.contains('excluir-compra')){
        excluirCompraDialog.showModal();
        console.log('ID da compra a ser excluída:', deletingCompraId);
    }
});

fecharExclusaoCompra.addEventListener('click', (e) => {
    e.preventDefault();
    excluirCompraDialog.close();
    deletingCompraId = null;
});

cancelarExclusaoCompra.addEventListener('click', (e) => {
    e.preventDefault();
    excluirCompraDialog.close();
    deletingCompraId = null;
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
        novaCompraDialog.close();
    }

    nomeCompraInput.value = '';
    renderizarCompras();
    atualizarContadores();
    
}

function renderizarCompras(){

    if(compras.length === 0){
        comprasVazio.style.display = "";
        listaCompras.style.display = "none";
    } else {
        comprasVazio.style.display = "none";
        listaCompras.style.display = "";
    }

    listaCompras.innerHTML = '';

    const modeloCompra = document.getElementById("modelo-compra");

    compras.forEach((c) => {
        const copiaTemplate = modeloCompra.content.cloneNode(true); 
        const tituloTemplate = copiaTemplate.querySelector('.compra-nome');
        const dataTemplate = copiaTemplate.querySelector('.compra-data');

        tituloTemplate.textContent = c.nome;
        dataTemplate.textContent = new Date(c.criadaEm).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'});
        listaCompras.appendChild(copiaTemplate);
    });
}

function atualizarContadores(){
     if(compras.length === 1) {
        totalCompras.innerHTML = `${compras.length} COMPRA`;
    } else {
        totalCompras.innerHTML = `${compras.length} COMPRAS`;
    }

    const rascunhoCount = compras.filter((c) => c.status === "rascunho").length;
    const finalizadasCount = compras.filter((c) => c.status === "finalizada").length;

    resumoRascunho.innerHTML = rascunhoCount;
    resumoFinalizadas.innerHTML = finalizadasCount;
    resumoCompras.innerHTML = compras.length;
}


renderizarCompras();
atualizarContadores();