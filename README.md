# Cestou 🛒

**Projeto educacional para aprender JavaScript**, construindo um comparador de preços entre mercados com foco em uso no celular.

## Autoria e proposta de aprendizagem

> **HTML e CSS:** a estrutura visual, a identidade *Cestou Fresh* e a interface responsiva foram desenvolvidas com auxílio do **ChatGPT (inteligência artificial)**.
>
> **JavaScript:** toda a **lógica de programação e as funcionalidades da versão educacional serão implementadas pelo aluno**, como parte do estudo.

O ChatGPT participa como mentor, responsável pelo design e revisor do código do aluno. Ele **não modifica o JavaScript do aluno sem solicitação explícita**.

Antes do início dos exercícios, foi desenvolvido um **protótipo temporário completo com auxílio de IA**, incluindo JavaScript, apenas para avaliar o produto e aprovar a experiência. Após a aprovação, o JavaScript demonstrativo foi retirado da estrutura ativa da versão educacional. **A autoria daquela demonstração não deve ser atribuída ao aluno.**

## Ideia do aplicativo

O Cestou permitirá cadastrar mercados, criar compras e informar preços dos produtos. O resultado será dividido em **listas por mercado**, com cada item atribuído ao mercado com menor preço informado — não ao mercado com menor valor total da compra.

A experiência aprovada é **mobile-first**: registro de preços por mercado, comparação em cartões compactos **por produto**, até **quatro mercados por compra**, valores mais baixos em verde, tratamento de empates, confirmação de preços pendentes e possibilidade de reabrir uma compra finalizada como rascunho.

## Tecnologias

- HTML5 e CSS3 (interface preparada com auxílio de IA);
- JavaScript nativo com **ES Modules** (implementação do aluno);
- `localStorage` para armazenar os dados, quando chegarmos a essa etapa.

Sem framework ou backend no MVP.

## Como executar

Abra o projeto no VS Code com **Live Server**, ou execute:

```bash
python -m http.server 5500
```

Acesse `http://localhost:5500`. Utilize um servidor local porque o JavaScript é carregado como módulo.

## Ponto de partida educacional

A primeira tela é **Meus mercados**. O HTML e o CSS já estão preparados; `src/js/app.js` é o ponto de entrada reservado ao aluno.

Na etapa inicial, o aluno implementará o cadastro e a renderização dos mercados. A lógica ainda **não está pronta** — isso é intencional. As telas de compras, preços, comparação e listas serão retomadas incrementalmente conforme o aprendizado.

O CSS aprovado está organizado em arquivos pequenos por responsabilidade: `tokens.css`, `base.css`, `shell.css`, `components.css`, `pages.css` e `comparison.css`. O JavaScript também será separado em módulos por funcionalidades quando fizer sentido.

As regras aprovadas estão em [docs/decisoes-do-produto.md](docs/decisoes-do-produto.md). A organização visual está resumida em [docs/telas-aprovadas.md](docs/telas-aprovadas.md).

---

**Cestou — aprendizado em JavaScript com HTML/CSS criados com auxílio de IA e lógica escrita pelo aluno.**
