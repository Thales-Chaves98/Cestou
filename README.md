# Cestou 🛒

**Aplicação educacional de comparação de preços entre supermercados.**

O projeto existe para o aluno aprender JavaScript construindo uma aplicação real. A interface usa a identidade visual **Cestou Fresh** (verde, tons claros e destaque discreto para os menores preços).

## ⚠️ Fase atual: protótipo para avaliação

A branch `prototype/mvp-completo` é uma **exceção temporária** ao processo de autoria do projeto: **HTML, CSS e JavaScript foram preparados com auxílio do ChatGPT** para permitir testar o MVP inteiro e decidir seus requisitos finais.

**Após a aprovação do protótipo, o JavaScript criado pela IA será retirado e a implementação da lógica ficará com o aluno.** O arquivo `src/js/app.js` permanece reservado à futura implementação educacional. **Não apresentar o JavaScript deste protótipo como código escrito pelo aluno.**

A branch `main` permanece preservada até a avaliação.

## Funcionalidades desta demonstração

- Painel inicial com listas, mercados e economia potencial das compras finalizadas.
- Cadastro e renomeação de mercados, sem duplicação de nomes; exclusão impedida quando houver vínculo com compras.
- Criação, renomeação e exclusão de listas de compras.
- Seleção de **até quatro mercados por compra**.
- Cadastro, edição e exclusão de produtos com quantidade e unidade.
- Preços unitários por produto/mercado, com menor preço destacado visualmente em verde.
- Atribuição automática de cada produto ao mercado com menor preço informado.
- Resumo por mercado, totais por produto e estimativa de economia.
- Finalização de compras, checklist dos itens comprados e **retorno ao rascunho sem duplicação**.
- Cópia da lista agrupada por mercado e dados fictícios de demonstração.
- Persistência no **localStorage** do próprio navegador.

### Regras importantes

- Na ausência de preço, aquele mercado é ignorado para o item. Para finalizar, cada produto deve possuir pelo menos um preço informado.
- Preço zero é válido (por exemplo, item grátis).
- Em empate de preço, é escolhido o primeiro mercado na ordem de seleção da compra.
- A estimativa de economia é a soma das diferenças entre o **maior preço informado** e o menor preço de cada item, multiplicadas pelas quantidades. Não é uma garantia de economia real nem considera combustível, deslocamento ou descontos.
- Os valores demonstrativos são fictícios, não consultam preços reais.
- O protótipo funciona **sem login, backend e sincronização**; limpar os dados do navegador apaga as compras.
- Excluir uma compra apaga seus dados; restaurar a demonstração substitui todos os dados locais.

## Executar localmente

O aplicativo é feito com HTML, CSS e JavaScript vanilla (ES Modules), sem instalação de dependências.

No diretório do projeto, execute:

```bash
python -m http.server 5500
```

Acesse **http://localhost:5500**. Também é possível utilizar a extensão Live Server do VS Code. Se o navegador bloquear módulos ES ao abrir arquivos diretamente pelo sistema (`file://`), utilize o servidor local.

## Arquitetura do protótipo

```text
index.html                # Interface principal e navegação
src/css/tokens.css        # Paleta e tokens de design originais
src/css/mvp.css           # Layout completo e responsivo do protótipo
src/js/mvp.js             # Lógica TEMPORÁRIA criada para avaliação
src/js/app.js             # Reservado à futura implementação do aluno
```

## Próximos passos após avaliação

1. Revisar telas, fluxos de uso, textos e regras de negócios.
2. Congelar a interface aprovada como referência visual e funcional.
3. Remover `src/js/mvp.js` e a referência a ele no HTML.
4. Planejar exercícios graduais para o aluno implementar `src/js/app.js` e os módulos necessários.
5. Preservar a documentação do protótipo como referência de requisitos, distinguindo claramente a autoria.

---

**Finalidade pedagógica:** na versão educacional definitiva, **HTML e CSS são desenvolvidos com auxílio do ChatGPT, enquanto a lógica JavaScript é desenvolvida pelo aluno**. A versão demonstrativa completa é uma etapa excepcional de avaliação e não representa a autoria futura da lógica.
