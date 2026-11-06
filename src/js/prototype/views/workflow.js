import { store, marketName } from "../data.js";
import { analyzePurchase, formatMoney, formatQuantity, priceToInput } from "../pricing.js";
import { escapeHtml as e, badge, empty, itemCount, formatItemTotal } from "./shared.js";

const stepPaths = [
  ["itens", "1. Itens"],
  ["precos", "2. Preços"],
  ["comparar", "3. Comparar"],
  ["listas", "4. Listas"],
];

function tabs(purchase, current) {
  return `<nav class="workflow-tabs" aria-label="Etapas da compra">${stepPaths.map(([key, title]) => {
    const isUnavailable = key === "listas" && purchase.status !== "finished";
    return isUnavailable
      ? `<span class="workflow-tab tab-disabled" aria-disabled="true">${title}</span>`
      : `<a class="workflow-tab ${current === key ? "tab-active" : ""}"
           href="#compras/${e(purchase.id)}/${key}" ${current === key ? 'aria-current="page"' : ""}>${title}</a>`;
  }).join("")}</nav>`;
}

function marketSelection(purchase, finished) {
  const maximum = purchase.marketIds.length >= 4;
  return `<div class="panel box-section"><div class="section-header">
    <div><h2>Mercados participantes</h2><p>Selecione entre dois e quatro para comparar.</p></div>
    <span class="count-pill">${purchase.marketIds.length}/4</span></div>
    <div class="market-selector">${store.data.markets.map(market => {
      const selected = purchase.marketIds.includes(market.id);
      return `<label class="market-option ${selected ? "option-selected" : ""} ${finished || (!selected && maximum) ? "option-disabled" : ""}">
        <input type="checkbox" data-market-option="${e(market.id)}" ${selected ? "checked" : ""}
          ${finished || (!selected && maximum) ? "disabled" : ""}>
        <span>${e(market.name)}</span></label>`;
    }).join("")}</div>
    ${!store.data.markets.length ? '<p class="help-text">Nenhum mercado cadastrado. <a href="#mercados">Cadastre um mercado.</a></p>' : ""}
    <p class="help-text">Ao desmarcar um mercado, os preços registrados nele ficam guardados caso você o selecione novamente.</p>
  </div>`;
}

function itemsStep(purchase) {
  const finished = purchase.status === "finished";
  return `<section class="steps-layout">
    ${marketSelection(purchase, finished)}
    <section class="panel box-section"><div class="section-header">
      <div><h2>Produtos da compra</h2><p>Adicione os itens e suas quantidades.</p></div>
      ${finished ? "" : '<button class="button button-primary button-sm" type="button" data-action="add-item">+ Adicionar</button>'}
    </div>
    ${purchase.items.length ? `<div class="item-list">${purchase.items.map(item => `<div class="item-line">
      <div class="item-line-main"><strong>${e(item.name)}</strong><small>${formatQuantity(item.quantity)} ${e(item.unit)}</small></div>
      ${finished ? "" : `<div class="inline-actions">
        <button class="icon-button" aria-label="Editar ${e(item.name)}" title="Editar" type="button" data-action="edit-item" data-id="${e(item.id)}">✎</button>
        <button class="icon-button icon-danger" aria-label="Excluir ${e(item.name)}" title="Excluir" type="button" data-action="delete-item" data-id="${e(item.id)}">×</button>
      </div>`}</div>`).join("")}</div>` : empty("Nenhum item cadastrado", "Adicione seu primeiro produto à lista.")}
    ${purchase.items.length && purchase.marketIds.length ? `<a class="button button-primary step-next" href="#compras/${e(purchase.id)}/precos">Registrar preços →</a>` : ""}
    </section>
  </section>`;
}

function pricesStep(purchase, summary, activeMarketId) {
  const finished = purchase.status === "finished";
  if (!purchase.marketIds.length) {
    return empty("Selecione um mercado", "Volte à etapa Itens e escolha ao menos um mercado.",
      `<a href="#compras/${e(purchase.id)}/itens" class="button button-primary">Selecionar mercados</a>`);
  }
  const activeMarket = purchase.marketIds.includes(activeMarketId) ? activeMarketId : purchase.marketIds[0];
  const filled = purchase.items.filter(item => Number.isSafeInteger(item.prices?.[activeMarket])).length;
  return `<section class="panel box-section">
    <div class="section-header"><div><h2>Registrar preços</h2>
      <p>Escolha o mercado em que está e preencha os preços por unidade.</p></div>
      <span class="count-pill">${filled}/${purchase.items.length}</span></div>
    <div class="market-switcher" role="group" aria-label="Mercado para registrar preços">
      ${purchase.marketIds.map(id => `<button class="market-switch ${activeMarket === id ? "market-switch-active" : ""}"
        type="button" data-action="select-price-market" data-id="${e(id)}"
        aria-pressed="${activeMarket === id}">${e(marketName(id))}</button>`).join("")}
    </div>
    <div class="progress-block"><div class="progress-label"><span>${e(marketName(activeMarket))}</span>
      <span>${filled} de ${purchase.items.length} registrados</span></div>
      <div class="progress-track"><span style="width:${purchase.items.length ? 100 * filled / purchase.items.length : 0}%"></span></div></div>
    <div class="price-tools">
      <label class="search-field"><span class="sr-only">Pesquisar produtos</span>
        <input id="price-search" type="search" placeholder="Buscar produto..." autocomplete="off"></label>
      <label class="compact-check"><input id="price-pending-only" type="checkbox"> Somente pendentes</label>
    </div>
    ${purchase.items.length ? `<div class="price-list" id="price-list">${purchase.items.map(item => {
      const value = item.prices?.[activeMarket];
      const hasValue = Number.isSafeInteger(value);
      return `<div class="price-line" data-price-row data-item-name="${e(item.name.toLocaleLowerCase("pt-BR"))}" data-filled="${hasValue}">
        <div class="price-product"><strong>${e(item.name)}</strong>
          <small>${formatQuantity(item.quantity)} ${e(item.unit)}</small></div>
        <label class="price-field"><span class="sr-only">Preço de ${e(item.name)} no ${e(marketName(activeMarket))}</span>
          <span aria-hidden="true">R$</span><input type="text" inputmode="decimal"
          aria-label="Preço unitário de ${e(item.name)} no ${e(marketName(activeMarket))}"
          data-price-item="${e(item.id)}" data-price-market="${e(activeMarket)}"
          value="${hasValue ? priceToInput(value) : ""}" placeholder="—" ${finished ? "disabled" : ""} /></label>
      </div>`;
    }).join("")}</div><p class="help-text" id="price-no-matches" hidden>Nenhum produto encontrado.</p>` :
      empty("Adicione produtos primeiro", "Acesse a etapa Itens para montar sua lista.")}
    <p class="help-text">Os valores são salvos ao sair de cada campo. Deixe em branco os preços que você ainda não sabe.</p>
    <div class="step-footer"><a class="button button-subtle" href="#compras/${e(purchase.id)}/itens">← Itens</a>
      <a class="button button-primary" href="#compras/${e(purchase.id)}/comparar">Comparar preços →</a></div>
  </section>`;
}

function comparisonCard(row, purchase) {
  const item = row.item;
  const threeMarkets = purchase.marketIds.length === 3;
  const options = purchase.marketIds.map((id, index) => {
    const offer = row.offers.find(value => value.marketId === id);
    const highlighted = offer && row.tiedMarketIds.includes(id);
    return `<div class="offer-tile ${highlighted ? "offer-best" : ""} ${threeMarkets && index === 2 ? "offer-wide" : ""}"
        ${highlighted ? 'aria-label="Um dos menores preços informados"' : ""}>
      <span class="offer-market">${e(marketName(id))}</span>
      <div class="offer-price"><strong>${offer ? formatMoney(offer.cents) : "—"}</strong>
        ${highlighted ? '<span aria-hidden="true" class="offer-check">✓</span>' : ""}</div>
    </div>`;
  }).join("");
  return `<article class="compare-card panel">
    <div class="compare-card-header"><strong>${e(item.name)}</strong><span>${formatQuantity(item.quantity)} ${e(item.unit)}</span></div>
    <div class="offer-grid ${purchase.marketIds.length === 1 ? "offer-one" : ""}">${options}</div>
    ${row.unresolvedTie || row.tiedMarketIds.length > 1 ? `<div class="tie-choice">
      <p><strong>Empate no menor preço.</strong> Escolha em qual mercado comprar:</p>
      <div class="tie-options">${row.tiedMarketIds.map(id => `<label><input type="radio" name="tie-${e(item.id)}"
        data-tie-item="${e(item.id)}" value="${e(id)}" ${row.choice?.marketId === id ? "checked" : ""}
        ${purchase.status === "finished" ? "disabled" : ""} />${e(marketName(id))}</label>`).join("")}</div>
    </div>` : ""}
    ${row.missingMarketIds.length ? `<p class="compare-footnote">${row.missingMarketIds.length} ${row.missingMarketIds.length === 1 ? "preço não informado" : "preços não informados"}</p>` : ""}
  </article>`;
}

function compareStep(purchase, summary) {
  return `<section>
    <div class="section-header compare-intro"><div><h2>Comparação por produto</h2>
      <p>O destaque verde indica o menor preço <strong>informado</strong> para cada item.</p></div>
      <span class="count-pill">${itemCount(purchase.items.length)}</span></div>
    ${summary.rows.length ? `<div class="compare-list">${summary.rows.map(row => comparisonCard(row, purchase)).join("")}</div>` :
      empty("Não há produtos", "Volte à etapa Itens para adicionar seus produtos.")}
    <div class="panel finalize-panel"><div><h2>${purchase.status === "finished" ? "Comparação finalizada" : "Pronto para finalizar?"}</h2>
      <p>${summary.pricedItems} de ${purchase.items.length} produtos têm algum preço · ${summary.pendingPrices} preços não informados.</p>
      ${summary.unresolvedTies ? `<p class="warning-text">Resolva ${summary.unresolvedTies} ${summary.unresolvedTies === 1 ? "empate" : "empates"} acima antes de finalizar.</p>` : ""}
      ${summary.unquotedItems ? `<p class="help-text">${summary.unquotedItems} ${summary.unquotedItems === 1 ? "item não tem" : "itens não têm"} nenhum preço e ficará fora das listas.</p>` : ""}
      ${purchase.marketIds.length < 2 ? '<p class="warning-text">Selecione pelo menos dois mercados para finalizar.</p>' : ""}
      ${purchase.status === "draft" && !summary.pricedItems ? '<p class="warning-text">Informe o preço de pelo menos um produto.</p>' : ""}
    </div><div class="finalize-actions">
      ${purchase.status === "finished"
        ? `<a class="button button-primary" href="#compras/${e(purchase.id)}/listas">Ver listas →</a>`
        : `<button class="button button-primary" data-action="finish" ${summary.canFinish ? "" : "disabled"}>Finalizar comparação</button>`}
    </div></div>
  </section>`;
}

function listsStep(purchase, summary) {
  if (purchase.status !== "finished") {
    return empty("Comparação ainda não finalizada", "Finalize na etapa Comparar para gerar suas listas.");
  }
  const populated = summary.groups.filter(group => group.rows.length > 0);
  const doneCount = purchase.items.filter(item => item.done && summary.rows.some(row => row.item.id === item.id && row.choice)).length;
  return `<section><div class="lists-summary panel">
    <div><span class="eyebrow">Sua divisão de compras</span><h2>Onde comprar cada item</h2>
      <p>${doneCount} de ${summary.assignedItems} produtos marcados como comprados.</p></div>
    <div class="total-summary"><span>Total estimado das listas</span><strong>${formatMoney(summary.total)}</strong></div>
  </div>
  ${summary.unquotedItems ? `<p class="notice">Atenção: ${summary.unquotedItems} ${summary.unquotedItems === 1 ? "produto ficou" : "produtos ficaram"} fora das listas por não ter preços informados.</p>` : ""}
  <div class="result-groups">${populated.length ? populated.map(group => `<section class="panel result-group">
    <div class="result-group-head"><div><span class="market-avatar" aria-hidden="true">▣</span>
      <div><h3>${e(marketName(group.marketId))}</h3><small>${itemCount(group.rows.length)}</small></div></div>
      <strong class="group-subtotal">${formatMoney(group.subtotal)}</strong></div>
    <div class="result-items">${group.rows.map(row => `<label class="result-item ${row.item.done ? "item-done" : ""}">
      <input type="checkbox" data-done-item="${e(row.item.id)}" ${row.item.done ? "checked" : ""}>
      <span class="result-item-info"><strong>${e(row.item.name)}</strong>
        <small>${formatQuantity(row.item.quantity)} ${e(row.item.unit)} × ${formatMoney(row.choice.cents)}</small></span>
      <span class="result-item-price">${formatItemTotal(row)}</span>
    </label>`).join("")}</div>
  </section>`).join("") : empty("Nenhum item para distribuir", "Não há preços informados para montar listas.")}</div>
  <div class="result-actions"><button class="button button-subtle" data-action="copy-list">Copiar listas</button>
    <button class="button button-primary" data-action="reopen">Voltar a rascunho</button></div>
  <p class="help-text">Voltar a rascunho preserva os itens, mercados e preços. A próxima finalização recalcula as listas.</p>
  </section>`;
}

export function workflowPage(purchase, step, activeMarketId) {
  const summary = analyzePurchase(purchase);
  const selectedStep = step === "listas" && purchase.status !== "finished" ? "comparar" : step;
  const content = selectedStep === "itens" ? itemsStep(purchase)
    : selectedStep === "precos" ? pricesStep(purchase, summary, activeMarketId)
    : selectedStep === "listas" ? listsStep(purchase, summary)
    : compareStep(purchase, summary);

  return `<a class="back-link" href="#compras">← Voltar às compras</a>
    <div class="page-header purchase-page-header">
      <div><p class="eyebrow">Sua comparação</p><h1>${e(purchase.name)}</h1>
        <p>${itemCount(purchase.items.length)} · ${purchase.marketIds.length} mercados selecionados</p></div>
      ${badge(purchase.status)}
    </div>
    ${tabs(purchase, selectedStep)}
    <div class="workflow-content">${content}</div>`;
}
