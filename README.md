# Cestou 🛒

**Comparador de preços por produto**, desenvolvido como projeto educacional com HTML, CSS e JavaScript nativos e experiência **mobile-first**.

> **Estado atual:** estrutura visual do MVP pronta para a primeira tarefa de JavaScript. As funcionalidades serão construídas gradualmente pelo estudante — a tela inicial ainda não cadastra mercados.

## Objetivo

O usuário cadastra mercados, cria uma compra, adiciona itens e registra os preços em cada mercado participante. Ao finalizar, o sistema gera **listas separadas por mercado**, colocando cada item no mercado que apresentou o menor preço informado.

**Importante:** não procuramos escolher um único mercado com a compra total mais barata. A comparação é **item a item**.

## Fluxo do MVP

1. Cadastrar mercados (sem limite total no cadastro geral).
2. Criar uma compra, adicionar itens/quantidades e escolher de **2 a 4 mercados** participantes.
3. Registrar preços **um mercado por vez** — operação pensada para o celular.
4. Conferir a comparação em cartões **por produto**, com preços lado a lado e destaque para o menor preço informado.
5. Finalizar a comparação (com aviso e confirmação se houver preços não informados).
6. Consultar as listas por mercado e marcar itens comprados.
7. Se necessário, retornar uma compra finalizada para **rascunho**, editar e finalizar novamente.

A primeira versão será para **aprendizado e uso pessoal**, sem login, backend, API, banco de dados remoto ou preparação para uso comercial.

## Regras essenciais aprovadas

- Uma compra admite **até 4 mercados selecionados**. A compra pode existir em rascunho com apenas um mercado; a finalização da comparação exige ao menos dois.
- A comparação do MVP usa apenas **produto e preço**. Não haverá comparação automática por marca, tamanho, embalagem ou conversão de unidades.
- A visualização de comparação é **por produto**, não uma tabela horizontal. **Nunca haverá caixas vazias:** 2 mercados = 2 cartões; 3 mercados = 2 na primeira linha e o terceiro expandido; 4 mercados = grade 2 × 2.
- **Preço em branco** não participa da comparação. O sistema avisa quantos preços estão pendentes, mas permite finalizar após confirmação. Um item sem preço em nenhum mercado fica fora das listas finais.
- O destaque significa **menor preço informado**, não necessariamente menor preço em todos os mercados quando há lacunas.
- Se dois mercados empatarem no menor preço de um item, o usuário escolhe **um** destino para ele; o item não deve aparecer em duas listas.
- Quantidade do item determina o total da linha. Preços informados serão tratados como unitários; não comparar embalagens automaticamente.
- Compras finalizadas podem ser **reabertas como rascunho**; não é necessário duplicá-las. Ao finalizar de novo, as listas devem ser recalculadas.
- Dados de mercado, compra, item e cotação devem ter **IDs estáveis** e responsabilidades separadas.
- No MVP, o armazenamento será **localStorage**, sem sincronização entre navegadores ou dispositivos.

A especificação de comportamentos de borda está em [docs/decisoes-do-produto.md](docs/decisoes-do-produto.md).

## Arquitetura e qualidade

Sem frameworks e sem arquivos monolíticos. Usaremos **ES Modules** para dividir funções e responsabilidades conforme o projeto crescer.

```text
Cestou/
├── index.html
├── src/
│   ├── css/
│   │   ├── tokens.css       # variáveis visuais
│   │   ├── base.css         # base e estilos globais
│   │   ├── layout.css       # layout e responsividade
│   │   └── components.css   # componentes e formulários
│   └── js/
│       └── app.js           # entrada JS — estudante
├── docs/
│   └── decisoes-do-produto.md
├── README.md
└── .gitignore
```

Quando surgirem funcionalidades, criaremos módulos de acordo com a necessidade (exemplos: `features/mercados.js`, `features/compras.js`, `features/cotacoes.js`, `features/comparacao.js`, `services/storage.js`). **Não criaremos arquivos vazios só para simular uma arquitetura maior.**

Diretrizes:

- Funções pequenas e nomes claros; evitar arquivos com centenas ou milhares de linhas.
- Separar regras de negócio, manipulação do DOM e persistência.
- Não usar posições em arrays como identificadores de mercados e produtos.
- Usar HTML semântico, validação nativa de formulários quando apropriado e feedback visível.
- Priorizar visualização e interação mobile; respeitar nomes longos, cartões dinâmicos e espaços estreitos.
- Evitar erros de ponto flutuante no cálculo monetário (preferir valores em centavos inteiros na lógica).
- Construir e testar **um incremento de cada vez**, partindo do MVP.

## Autoria e divisão de responsabilidades

**A lógica JavaScript é de autoria do estudante.** O ChatGPT atua como mentor, revisor de código, lead de design e responsável pelo HTML/CSS. A estrutura visual e os estilos foram **desenvolvidos com auxílio de inteligência artificial**; há também uma indicação disso no cabeçalho do CSS e no rodapé do HTML.

Nosso processo:

1. O mentor prepara o HTML/CSS necessário para a próxima funcionalidade.
2. O estudante implementa o JavaScript, sem receber a solução completa antecipadamente.
3. O mentor lê o código publicado no GitHub, aponta problemas concretos e orienta ajustes.
4. Prosseguimos após revisão, preservando o trabalho autoral do estudante.

O mentor **não modifica o JavaScript do estudante sem pedido explícito**. As mudanças devem ser versionadas com Git/GitHub, e a interface deve estar pronta antes de tarefas que dependam dela.

## Executando localmente

Abra a pasta no VS Code e utilize **Live Server** (ou outro servidor HTTP local). Como `index.html` usa `type="module"`, não abra o projeto por `file://`.

Alternativa com Python instalado:

```bash
python -m http.server 5500
```

Acesse `http://localhost:5500`.

## Etapa atual: 01 — Cadastro de mercados

O HTML já possui os elementos que o estudante usará:

| Elemento | ID |
| --- | --- |
| Formulário | `form-mercado` |
| Campo nome | `mercado-nome` |
| Lista | `lista-mercados` |
| Estado vazio | `mercados-vazio` |
| Contador | `total-mercados` |
| Feedback | `mensagem-mercado` |

**Primeira tarefa JavaScript:** capturar o submit, impedir a navegação, validar nome, inserir `{ id, nome }` no array de mercados e renderizar a lista, atualizando contador/estado vazio. **Ainda não é necessário implementar localStorage, edição ou exclusão.**
