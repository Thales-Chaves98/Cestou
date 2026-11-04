# Cestou — Decisões de produto e cenários de borda

Documento de referência para implementar o MVP em incrementos. **Não significa que todos os recursos já existam no código.**

## 1. Mercado, compra e cotação

- A lista geral de mercados não tem limite. A seleção para cada compra é limitada a **4**.
- Rascunho pode ter um mercado; para comparar e finalizar, é necessário ter **pelo menos 2**.
- Preços são relacionados a **(compra, item, mercado)** por ID, não salvos como atributo universal do mercado ou do produto.
- Renomear o mercado não deve destruir os vínculos. Não excluir permanentemente um mercado usado em compras; considerar arquivamento quando essa funcionalidade for feita.
- Se o usuário retirar um mercado de um rascunho, suas cotações anteriores poderão ser mantidas, mas não entram no cálculo enquanto estiver desmarcado.

## 2. Visualização no celular

- Preenchimento de preços: **um mercado por vez**.
- Comparação: **um produto por cartão**, preços lado a lado, sem tabela horizontal no MVP.
- 2 mercados: 2 cartões; 3: 2 + 1 cartão expandido; 4: grade 2 × 2. **Sem cartões vazios.**
- Nomes compridos e preços devem quebrar/encaixar sem cortar a informação; componentes responsivos e alvos de toque confortáveis.
- O resultado final apresenta **listas agrupadas por mercado**. Um mercado sem itens mais baratos não recebe uma lista vazia.

## 3. Cálculo dos preços

- Comparar apenas preços **informados e válidos**. Valor em branco não equivale a R$ 0.
- Se houver preços ausentes, mostrar aviso antes de finalizar e pedir confirmação. Mesmo assim, é possível finalizar.
- Se um item não tiver nenhuma cotação, ficará fora das listas finais; sinalizar a ausência de preço ao finalizar.
- Destaque no cartão significa **menor preço informado**.
- Empate no mínimo: selecionar manualmente **um único mercado** para receber o item. Evitar listas duplicadas.
- Preço digitado corresponde a uma unidade comercial do item. Quantidade multiplica o subtotal. Não há comparação de marca/embalagem nem conversão de unidade.
- Calcular moeda com cuidado: usar centavos inteiros é preferível a somar números decimais diretamente.

## 4. Estados e edição

- Compra em **rascunho**: pode receber itens, mercados e preços.
- Compra **finalizada**: listas consolidadas, preços sem edição enquanto finalizada; pode-se marcar itens comprados.
- Ação **Voltar a rascunho**: reabilitar edição, manter dados existentes e recalcular listas na próxima finalização; **não duplicar compra**.
- Editar nome ou quantidade de um item mantém seus preços vinculados ao ID. Excluir item cotado exige confirmação, para evitar perda acidental.
- Uma edição de rascunho deve ser salva no localStorage após mudança válida. Entradas monetárias parcialmente digitadas não podem virar cotações válidas automaticamente.

## 5. Escopo e prioridades

- Este é um projeto **educacional, para uso próprio**; não há obrigação de criar autenticação, backup, integração com mercados, serviço externo, servidor ou banco de dados no MVP.
- Primeiro obter um fluxo completo mínimo; depois adicionar refinamentos, histórico e melhorias de UX.
- O armazenamento inicial é local ao navegador. A perda do armazenamento não será tratada como problema de sincronização nesta fase.
- Revisar cenários: 0/1/2/3/4/5 mercados selecionados; preços totalmente vazios e parcialmente informados; empate; nome longo; quantidade maior que 1; mudança de mercado; exclusão de item cotado; reabrir compra finalizada.
