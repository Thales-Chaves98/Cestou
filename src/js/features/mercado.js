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

    const nome = nomeMercado.value;


    const mercado = {
        id: idMercado++,
        nome
    };

    mercados.push(mercado);
    nomeMercado.value = '';
}