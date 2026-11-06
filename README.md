# Cestou 🛒

**Projeto educacional de aprendizagem em JavaScript**, desenvolvido em etapas a partir de um aplicativo de comparação de preços entre mercados.

## Autoria e objetivo pedagógico

> **HTML e CSS:** interface visual, identidade Cestou Fresh, componentes responsivos e experiência mobile-first desenvolvidos com auxílio do **ChatGPT (IA)**.
>
> **JavaScript da versão de aprendizagem:** regras de negócio e comportamento da aplicação serão **desenvolvidos pelo aluno**. O ChatGPT atua como mentor e revisor, sem modificar o código JavaScript do aluno sem pedido explícito.

### Exceção temporária — protótipo completo para avaliação

Na branch **`prototype/mvp-completo`**, o ChatGPT desenvolveu **também um JavaScript temporário** para demonstrar todo o fluxo do MVP antes do início das atividades.

**O JavaScript desta demonstração foi escrito por IA, não pelo aluno.** Depois que o protótipo for avaliado e aprovado, os módulos da pasta `src/js/prototype/` e sua referência no HTML serão removidos, preservando a interface aprovada. Só então o aluno fará a lógica por conta própria, em exercícios progressivos.

A branch **`main`** contém a base educacional e não foi alterada por esta implementação.

## Ideia do aplicativo

O Cestou permite cadastrar mercados, criar compras, registrar os preços de produtos e gerar **listas separadas por mercado**, direcionando cada item para o menor preço encontrado entre os valores informados. **Não busca escolher um mercado único com menor total.**

A comparação será feita por produto, com até **quatro mercados por compra**, priorizando o celular.

## O que testar no protótipo

- Criar, renomear e excluir mercados e compras.
- Criar, editar e excluir itens com quantidades.
- Selecionar de 1 a 4 mercados no rascunho; pelo menos 2 são necessários para finalizar.
- Registrar preços **um mercado por vez**, com campos compactos e salvamento local.
- Comparar preços **por produto**, sem tabela: 2 mercados lado a lado; 3 em distribuição 2 + 1; 4 em grade 2 × 2.
- Ver o menor preço em verde, sem textos repetitivos.
- Deixar preços em branco e **finalizar após confirmação**; item sem nenhuma cotação fica fora das listas.
- Resolver empates escolhendo qual mercado receberá o item.
- Consultar listas finais agrupadas por mercado, subtotais e checklist.
- **Voltar a rascunho** sem duplicar compra, mantendo produtos e preços.
- Restaurar dados fictícios quando quiser reavaliar os fluxos.

Os dados ficam apenas no **`localStorage`** deste navegador. Não há login, API nem sincronização. Ao abrir pela primeira vez, o aplicativo carrega compras fictícias para avaliação; a opção **Restaurar exemplo** substitui os dados locais.

## Executar

Clone o repositório e selecione o branch da demonstração:

```bash
git switch prototype/mvp-completo
```

Abra o `index.html` com **Live Server** no VS Code, ou execute:

```bash
python -m http.server 5500
```

Depois acesse `http://localhost:5500`. Não abra o arquivo via `file://`, pois os módulos ES exigem um servidor local.

## Organização

```text
index.html
src/
  css/
    tokens.css       # identidade Cestou Fresh
    base.css         # estilos globais
    shell.css        # navegação e layout responsivo
    components.css   # componentes, formulários e diálogos
    pages.css        # compras, mercados, itens e coleta de preços
    comparison.css   # cartões por produto e listas finais
  js/
    app.js           # reservado à futura implementação do aluno
    prototype/       # JavaScript TEMPORÁRIO de avaliação, escrito por IA
      app.js
      data.js
      pricing.js
      dialog.js
      views/
        shared.js
        purchases.js
        workflow.js
docs/
  decisoes-do-produto.md
```

A especificação detalhada de regras e casos de borda está em [docs/decisoes-do-produto.md](docs/decisoes-do-produto.md).

---

**Finalidade do projeto:** aprendizado do aluno em JavaScript, com HTML/CSS preparados com auxílio de IA. A implementação completa por IA neste branch é apenas um protótipo temporário de produto e experiência visual.
