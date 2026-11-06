import { store, marketName } from "../data.js";
import { analyzePurchase, formatMoney } from "../pricing.js";
import { escapeHtml as e, dateLabel, badge, empty, itemCount } from "./shared.js";

function purchaseCard(purchase) {
  const summary = analyzePurchase(purchase);
  const next = purchase.status === "finished" ? "listas" : "itens";
  return `<article class="purchase-card panel">
    <div class="purchase-card-head">
      <div class="purchase-card-main"><h3>${e(purchase.name)}</h3><p>${dateLabel(purchase.updatedAt)} · ${itemCount(purchase.items.length)} · ${purchase.marketIds.length} mercados</p></div>
      ${badge(purchase.status)}
    </div>
    <div class="purchase-progress">
      <div class="progress-top"><span>${purchase.status === "finished" ? "Comparação concluída" : "Itens com algum preço"}</span>
        <strong>${summary.pricedItems}/${purchase.items.length}</strong></div>
      <div class="progress-track"><span style="width:${purchase.items.length ? 100 * summary.pricedItems / purchase.items.length : 0}%"></span></div>
    </div>
    <div class="purchase-actions">
      <a class="button button-primary button-sm" href="#compras/${e(purchase.id)}/${next}">${purchase.status === "finished" ? "Ver listas" : "Continuar compra"} <span aria-hidden="true">→</span></a>
      <button class="button button-subtle button-sm" type="button" data-action="rename-purchase" data-id="${e(purchase.id)}">Renomear</button>
      <button class="button button-danger button-sm" type="button" data-action="delete-purchase" data-id="${e(purchase.id)}">Excluir</button>
    </div>
  </article>`;
}

export function purchasesPage() {
  const purchases = [...store.data.purchases].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const finished = purchases.filter(p => p.status === "finished").length;
  return `<div class="page-header">
    <div><p class="eyebrow">Cestou Fresh</p><h1>Minhas compras</h1>
      <p>Organize a lista, registre os preços e descubra onde comprar cada produto.</p></div>
    <button class="button button-primary" data-action="new-purchase" type="button">+ Nova compra</button>
  </div>
  <section class="overview-banner" aria-label="Resumo da aplicação">
    <div class="overview-copy"><span class="overview-kicker">Sua compra, mais econômica</span>
      <h2>Compare os preços do seu jeito.</h2>
      <p>Até quatro mercados por compra, com os itens mais baratos agrupados por mercado.</p>
    </div>
    <div class="overview-figures"><div><strong>${purchases.length}</strong><span>compras</span></div>
      <div><strong>${store.data.markets.length}</strong><span>mercados</span></div>
      <div><strong>${finished}</strong><span>finalizadas</span></div></div>
  </section>
  <div class="content-heading"><h2>Suas comparações</h2><span class="count-pill">${purchases.length}</span></div>
  <div class="purchase-list">${purchases.length ? purchases.map(purchaseCard).join("") :
    empty("Nenhuma compra cadastrada", "Crie sua primeira compra para começar a comparar.",
      '<button class="button button-primary" data-action="new-purchase">Criar compra</button>')}</div>
  <div class="sample-note"><span aria-hidden="true">ⓘ</span>
    <p>Os dados iniciais são fictícios e servem para testar o protótipo.</p>
    <button class="text-button" data-action="reset-demo" type="button">Restaurar exemplo</button>
  </div>`;
}

export function marketsPage() {
  const markets = store.data.markets;
  const usage = id => store.data.purchases.filter(p => p.marketIds.includes(id)).length;
  return `<div class="page-header"><div><p class="eyebrow">Seu cadastro</p><h1>Meus mercados</h1>
    <p>Cadastre quantos quiser. Em cada compra você poderá escolher até quatro.</p></div></div>
  <div class="market-layout">
    <section class="panel market-add"><div class="panel-heading"><h2>Adicionar mercado</h2>
      <p>Escolha um nome fácil de reconhecer.</p></div>
      <form id="market-form" class="form" novalidate>
        <label class="field"><span>Nome do mercado</span>
          <input name="name" maxlength="60" placeholder="Ex.: Mercado Central" autocomplete="off" required></label>
        <p class="form-feedback" id="market-feedback" role="alert"></p>
        <button class="button button-primary" type="submit">+ Adicionar mercado</button>
      </form>
    </section>
    <section class="panel market-collection"><div class="panel-heading panel-title-row">
      <div><h2>Mercados cadastrados</h2><p>Reutilize seus mercados em novas compras.</p></div>
      <span class="count-pill">${markets.length}</span></div>
      <div class="market-rows">${markets.length ? markets.map(market => `<div class="market-line">
        <div class="market-avatar" aria-hidden="true">▣</div>
        <div class="market-line-title"><strong>${e(market.name)}</strong><small>Em ${usage(market.id)} ${usage(market.id) === 1 ? "compra" : "compras"}</small></div>
        <div class="market-line-actions">
          <button class="icon-button" data-action="rename-market" data-id="${e(market.id)}" aria-label="Renomear ${e(market.name)}" title="Renomear" type="button">✎</button>
          <button class="icon-button icon-danger" data-action="delete-market" data-id="${e(market.id)}" aria-label="Excluir ${e(market.name)}" title="Excluir" type="button">×</button>
        </div></div>`).join("") : empty("Nenhum mercado", "Adicione um mercado para começar.")}</div>
    </section>
  </div>`;
}
