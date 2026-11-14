

export function salvarMercados(mercados){
    localStorage.setItem('cestou.mercados', JSON.stringify(mercados));
};

export function carregarMercados(){
    return JSON.parse(localStorage.getItem('cestou.mercados')) || [];
};