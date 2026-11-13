const nomeMercado = document.getElementById('mercado-nome');
const formMercado = document.getElementById('form-mercado');
 
const mercadoVazio = document.getElementById('mercados-vazio');
const listaMercados = document.getElementById('lista-mercados');

const totalMercados = document.getElementById('total-mercados');

let mercados = [];

let idMercado = 0;


formMercado.addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarMercado();
    renderizarMercados();
    console.log(mercados);
});


function adicionarMercado() {
    const nome = nomeMercado.value.trim().toUpperCase();

    const mercado = {
        id: proximoId(mercados),
        nome
    };

    mercados.push(mercado);
    nomeMercado.value = '';
    atualizarContador();
}

function proximoId(array) {
    let maiorId = 0;

    for(let i = 0; i < array.length; i++) {
        if(maiorId < array[i].id){
            maiorId = array[i].id;
        }
    }

    return maiorId + 1;
} //provisorio        !!!!!!

function renderizarMercados() {

    if(mercados.length > 0) {
        mercadoVazio.style.display = 'none';
    } else {
        mercadoVazio.style.display = 'block';
    }
}

function atualizarContador(){
    if(mercados.length === 1) {
        totalMercados.innerHTML = `${mercados.length} MERCADO`;
    } else {
        totalMercados.innerHTML = `${mercados.length} MERCADOS`;
    }
}

renderizarMercados();