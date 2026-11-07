# Cestou — Interface aprovada

A versão de referência foi avaliada e aprovada no protótipo completo. Este arquivo descreve o layout que será reconstruído progressivamente nas etapas educacionais. **Não implica que todas as funcionalidades já estejam implementadas.**

## Identidade visual
- **Cestou Fresh:** verde `#16765C`, creme `#F8F9F4`, superfícies brancas e Manrope.
- Cartões arredondados, espaçamento contido, destaque discreto para preços e botões apropriados para toque.
- Layout **mobile-first** com navegação principal simples: Compras e Mercados.

## Telas e fluxos

### 1. Minhas compras
- Listagem de compras com estado Rascunho/Finalizada, informação resumida e opção de criar uma compra.
- Acesso rápido para continuar a compra ou abrir as listas de uma compra finalizada.

### 2. Meus mercados
- Formulário para cadastrar mercados, listagem e ações para renomear e excluir.
- Sem limite de mercados no cadastro geral; limite de **quatro participantes por compra**.

### 3. Montagem da compra
- Nome da compra, seleção dos mercados e itens com nome, quantidade e unidade.
- Dados preservados ao alterar uma compra em rascunho.

### 4. Registrar preços
- Preços **um mercado por vez**, alternando entre os mercados selecionados.
- Linhas compactas com nome do item, quantidade e campo de preço em R$; pesquisa e filtro de pendentes.
- Preços válidos salvos no navegador e relacionados por ID à compra, item e mercado.

### 5. Comparar preços
- **Um cartão por produto**, sem tabela horizontal.
- 2 mercados: dois blocos lado a lado; 3 mercados: dois + um bloco expandido; 4 mercados: grade 2 × 2; nenhum espaço vazio.
- Menor preço informado destacado por cor verde, borda e pequeno ícone, **sem repetir texto "menor preço"** em cada bloco.
- Valor não informado aparece como `—`; empates exigem escolha de mercado.

### 6. Finalização e listas
- Avisar sobre preços pendentes, mas permitir concluir após confirmação.
- Gerar listas separadas por mercado, com itens atribuídos aos menores preços informados.
- Não mostrar seção vazia para mercado sem itens vencedores.
- Checkbox de itens comprados, subtotal por mercado e total estimado.
- Compra finalizada pode voltar a **rascunho**, preservando os dados.

## Plano de construção
Implementar primeiro o cadastro de mercados; depois compras e produtos; preços; comparação; finalização e listas. A interface é responsabilidade da IA e a lógica JavaScript será desenvolvida pelo aluno.
