const nomeMercado = document.getElementById('mercado-nome');
const formMercado = document.getElementById('form-mercado');
 

let mercados = [];

let idMercado = 0;


formMercado.addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarMercado();
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

    }

}