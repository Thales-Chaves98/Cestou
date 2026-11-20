

export function salvarMercados(mercados){
    localStorage.setItem('cestou.mercados', JSON.stringify(mercados));
};

export function carregarMercados(){
    return JSON.parse(localStorage.getItem('cestou.mercados')) || [];
};

export function salvarCompras(compras){
    localStorage.setItem('cestou.compras', JSON.stringify(compras));
};

export function carregarCompras(){
    return JSON.parse(localStorage.getItem('cestou.compras')) || [];
};