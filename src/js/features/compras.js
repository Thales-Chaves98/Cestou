import {salvarCompras, carregarCompras, salvarMercados, carregarMercados} from '../services/storage.js';


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

const editarCompraDialog = document.getElementById("dialog-editar-compra");
const fecharEdicaoCompra = document.getElementById("fechar-edicao-compra");
const cancelarEdicaoCompra = document.getElementById("cancelar-edicao-compra");
const editarCompraNome = document.getElementById("editar-compra-nome");

const listaMercadosDisponiveis = document.getElementById("mercados-disponiveis");
const contadorMercados = document.getElementById("contador-mercados-selecionados");

const formSelecionarMercados = document.getElementById("form-selecionar-mercados");


let compras = carregarCompras();

let editingCompraId = null;
let deletingCompraId = null;
let compraAtualId = null;


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

    const id = btn.dataset.id;

    if(btn.classList.contains('excluir-compra')){
        excluirCompraDialog.showModal();
        deletingCompraId = id;       
    }

    if(btn.classList.contains('editar-compra')){
        editingCompraId = id;
        abrirEditarCompra(editingCompraId);
    }

    if(btn.classList.contains('continuar-compra')){
        compraAtualId = id;
        window.location.hash = "montagem-compra";

        const nomeCompraMontagem = document.getElementById("nome-compra-montagem");
        nomeCompraMontagem.textContent = compras.find((c) => c.id === compraAtualId).nome;

        renderizarMercadosDisponiveis();
    }
});

listaMercadosDisponiveis.addEventListener('change', (e) => {

    const ids = obterMercadosSelecionados();

    if(ids.length > 4){
        e.target.checked = false;

    } else {
        contadorMercados.textContent = `${ids.length} de 4 selecionados`;
        console.log(ids);
    }

    const checkboxes = listaMercadosDisponiveis.querySelectorAll(
        '.mercado-selecao-checkbox'
    );

    checkboxes.forEach((checkbox) => {
        checkbox.disabled = ids.length >= 4 && !checkbox.checked;
    });

    const mensagem = document.getElementById('mensagem-selecao-mercados');
    mensagem.textContent = '';
    mensagem.classList.remove('feedback-sucesso');
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

fecharEdicaoCompra.addEventListener('click', (e) => {
    e.preventDefault();
    editarCompraDialog.close();
    editingCompraId = null;
});

cancelarEdicaoCompra.addEventListener('click', (e) => {
    e.preventDefault();
    editarCompraDialog.close();
    editingCompraId = null;
});


excluirCompraDialog.addEventListener('submit', (e) => {
    e.preventDefault();
    excluirCompra(deletingCompraId);
    excluirCompraDialog.close();
    deletingCompraId = null;
});

editarCompraDialog.addEventListener('submit', (e) => {
    e.preventDefault();

    const editingCompra = compras.find((c) => c.id === editingCompraId);
    
    const novoNome = editarCompraNome.value.trim().toUpperCase();

    if(novoNome !== ""){
        editingCompra.nome = novoNome;
        salvarCompras(compras);
        renderizarCompras();
        atualizarContadores();
        editarCompraDialog.close();
        editingCompraId = null;
    }
});

formSelecionarMercados.addEventListener('submit', (e) => {
    e.preventDefault();

    const idCompra = compraAtualId;

    const compra = compras.find((c) => c.id === idCompra);
    const ids = obterMercadosSelecionados();

    if(ids.length >= 1 && ids.length <= 4){
        compra.mercadosId = ids;
        salvarCompras(compras);
    }

    const mensagem = document.getElementById('mensagem-selecao-mercados');

    mensagem.classList.add('feedback-sucesso');
    mensagem.textContent = 'Mercados salvos com sucesso!';

});

function adicionarCompra(){

    const nome = nomeCompraInput.value.trim().toUpperCase();

    const compra = {
        id: crypto.randomUUID(),
        nome,
        status: "rascunho",
        criadaEm: new Date().toISOString(),
        mercadosId: []
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

        const EditarBtn = copiaTemplate.querySelector('.editar-compra');
        const ExcluirBtn = copiaTemplate.querySelector('.excluir-compra');
        const ContinuarBtn = copiaTemplate.querySelector('.continuar-compra');

        EditarBtn.dataset.id = c.id;
        ExcluirBtn.dataset.id = c.id;
        ContinuarBtn.dataset.id = c.id;

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

function excluirCompra(id){
    if(!id) return;

    compras = compras.filter((c) => c.id !== id);
    
    renderizarCompras();
    atualizarContadores();
    salvarCompras(compras);
}

function abrirEditarCompra(id){
    editingCompraId = id;
    editarCompraDialog.showModal();

    const compra = compras.find((c) => c.id === id);
    editarCompraNome.value = compra.nome;
}

//mercado

function renderizarMercadosDisponiveis() {
    let mercadosDisponiveis = carregarMercados();

    const modeloMercadosDisponiveis = document.getElementById("modelo-mercado-selecao");

    listaMercadosDisponiveis.innerHTML = '';
    contadorMercados.textContent = `0 de 4 selecionados`;

    mercadosDisponiveis.forEach((m) => {

        const copiaTemplate = modeloMercadosDisponiveis.content.cloneNode(true); 
        const nomeMercadoTemplate = copiaTemplate.querySelector('.mercado-selecao-nome');
        const checkboxMercadoTemplate = copiaTemplate.querySelector('.mercado-selecao-checkbox');

        nomeMercadoTemplate.textContent = m.nome;
        checkboxMercadoTemplate.value = m.id;
        


        listaMercadosDisponiveis.appendChild(copiaTemplate);
    });
}

function obterMercadosSelecionados(){
    const marcados = document.querySelectorAll(
    '.mercado-selecao-checkbox:checked'
    );

    const ids = Array.from(marcados).map((checkbox) => {
        return checkbox.value;
    });    

    return ids;
}

renderizarCompras();
atualizarContadores();