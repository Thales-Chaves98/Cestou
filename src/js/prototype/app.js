/**
 * Cestou — controlador temporário do MVP de avaliação.
 * Este JavaScript foi escrito por IA e será removido após a aprovação da interface.
 */
import {
  store, newId, getPurchase, getMarket, marketName, touch,
  cleanName, isDuplicateMarket, isDuplicateItem,
} from "./data.js";
import {
  parsePrice, priceToInput, analyzePurchase, analyzeItem,
  formatMoney, formatQuantity,
} from "./pricing.js";
import { escapeHtml as e } from "./views/shared.js";
import { purchasesPage, marketsPage } from "./views/purchases.js";
import { workflowPage } from "./views/workflow.js";
import { openDialog, confirmDialog, submitDialog, closeDialog,
  isDialogOpen, dialogTabTrap, toast } from "./dialog.js";

const app = document.getElementById("app");
const activePriceMarket = new Map();

function locationParts() {
  const parts = (location.hash.slice(1) || "compras").split("/");
  return {
    page: parts[0],
    purchaseId: parts[0] === "compras" ? parts[1] : null,
    step: ["itens", "precos", "comparar", "listas"].includes(parts[2]) ? parts[2] : "itens",
  };
}

function currentPurchase() {
  const { purchaseId } = locationParts();
  return purchaseId ? getPurchase(purchaseId) : null;
}

function navigateToPurchase(purchase, step = "itens") {
  location.hash = `compras/${purchase.id}/${step}`;
  render();
}

function saveAndRender(purchase = null, keepScroll = false) {
  if (purchase) touch(purchase);
  if (!store.save()) toast("Não foi possível salvar no navegador. Verifique o armazenamento.");
  const scrollY = keepScroll ? window.scrollY : null;
  render();
  if (scrollY !== null) window.scrollTo(0, scrollY);
}

function render() {
  const { page, purchaseId, step } = locationParts();
  if (page === "mercados") {
    app.innerHTML = marketsPage();
    document.title = "Mercados | Cestou";
  } else if (page === "compras" && purchaseId) {
    const purchase = getPurchase(purchaseId);
    if (!purchase) {
      location.hash = "compras";
      app.innerHTML = purchasesPage();
    } else {
      const marketId = activePriceMarket.get(purchase.id) ?? purchase.marketIds[0];
      app.innerHTML = workflowPage(purchase, step, marketId);
      document.title = `${purchase.name} | Cestou`;
    }
  } else {
    app.innerHTML = purchasesPage();
    document.title = "Minhas compras | Cestou";
  }
  document.querySelectorAll("[data-main-nav]").forEach(link => {
    const active = link.dataset.mainNav === (page === "mercados" ? "mercados" : "compras");
    link.classList.toggle("nav-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function newPurchase() {
  openDialog({
    title: "Nova compra",
    body: `<label class="field"><span>Nome da compra</span>
      <input name="name" maxlength="70" placeholder="Ex.: Compra da semana" required autofocus /></label>
      <p class="help-text">Depois você escolherá os mercados e adicionará seus produtos.</p>`,
    submitLabel: "Criar compra",
    onSubmit(form) {
      const name = cleanName(new FormData(form).get("name"));
      if (!name) return toast("Informe um nome para a compra.");
      const now = new Date().toISOString();
      const purchase = { id: newId(), name, status: "draft", createdAt: now,
        updatedAt: now, marketIds: [], items: [] };
      store.data.purchases.push(purchase);
      store.save();
      closeDialog();
      navigateToPurchase(purchase);
      toast("Compra criada.");
    },
  });
}

function renamePurchase(purchaseId) {
  const purchase = getPurchase(purchaseId);
  if (!purchase) return;
  openDialog({
    title: "Renomear compra",
    body: `<label class="field"><span>Nome da compra</span>
      <input name="name" maxlength="70" value="${e(purchase.name)}" required /></label>`,
    onSubmit(form) {
      const name = cleanName(new FormData(form).get("name"));
      if (!name) return toast("Informe o nome da compra.");
      purchase.name = name;
      closeDialog();
      saveAndRender(purchase);
      toast("Compra renomeada.");
    },
  });
}

function deletePurchase(purchaseId) {
  const purchase = getPurchase(purchaseId);
  if (!purchase) return;
  confirmDialog("Excluir compra",
    `A compra “${purchase.name}” e todos os seus preços serão excluídos. Esta ação não pode ser desfeita.`, () => {
      store.data.purchases = store.data.purchases.filter(item => item.id !== purchaseId);
      closeDialog();
      saveAndRender();
      toast("Compra excluída.");
    }, "Excluir compra");
}

function renameMarket(marketId) {
  const market = getMarket(marketId);
  if (!market) return;
  openDialog({
    title: "Renomear mercado",
    body: `<label class="field"><span>Nome do mercado</span>
      <input name="name" maxlength="60" value="${e(market.name)}" required /></label>`,
    onSubmit(form) {
      const name = cleanName(new FormData(form).get("name"));
      if (!name) return toast("Informe o nome do mercado.");
      if (isDuplicateMarket(name, market.id)) return toast("Já existe um mercado com esse nome.");
      market.name = name;
      closeDialog();
      saveAndRender();
      toast("Mercado renomeado.");
    },
  });
}

function deleteMarket(marketId) {
  const market = getMarket(marketId);
  if (!market) return;
  const isUsed = store.data.purchases.some(p => p.marketIds.includes(marketId) ||
    p.items.some(item => Object.hasOwn(item.prices ?? {}, marketId)));
  if (isUsed) {
    toast("Mercado já utilizado em uma compra. Remova seus vínculos antes de excluir.");
    return;
  }
  confirmDialog("Excluir mercado", `Deseja excluir “${market.name}”?`, () => {
    store.data.markets = store.data.markets.filter(item => item.id !== marketId);
    closeDialog();
    saveAndRender();
    toast("Mercado excluído.");
  }, "Excluir mercado");
}

function editItem(itemId = null) {
  const purchase = currentPurchase();
  if (!purchase || purchase.status !== "draft") return;
  const item = itemId ? purchase.items.find(record => record.id === itemId) : null;
  const units = ["un", "kg", "g", "L", "ml", "pacote"];
  openDialog({
    title: item ? "Editar produto" : "Adicionar produto",
    body: `<label class="field"><span>Nome do produto</span>
      <input name="name" maxlength="90" placeholder="Ex.: Arroz" value="${e(item?.name ?? "")}" required /></label>
      <div class="fields-two">
        <label class="field"><span>Quantidade</span><input name="quantity" type="number"
          min="0.01" step="any" inputmode="decimal" value="${item?.quantity ?? 1}" required></label>
        <label class="field"><span>Unidade</span><select name="unit">${units.map(unit =>
          `<option value="${unit}" ${item?.unit === unit ? "selected" : ""}>${unit}</option>`).join("")}</select></label>
      </div><p class="help-text">Os preços serão informados por unidade do produto.</p>`,
    submitLabel: item ? "Salvar alterações" : "Adicionar produto",
    onSubmit(form) {
      const data = new FormData(form);
      const name = cleanName(data.get("name"));
      const quantity = Number(data.get("quantity"));
      const unit = String(data.get("unit"));
      if (!name || !Number.isFinite(quantity) || quantity <= 0 || quantity > 9999) {
        return toast("Informe um produto e uma quantidade válida.");
      }
      if (isDuplicateItem(purchase, name, item?.id)) {
        return toast("Esse produto já está na compra.");
      }
      if (item) {
        item.name = name;
        item.quantity = quantity;
        item.unit = unit;
      } else {
        purchase.items.push({ id: newId(), name, quantity, unit, prices: {},
          tieMarketId: null, done: false });
      }
      closeDialog();
      saveAndRender(purchase);
      toast(item ? "Produto atualizado." : "Produto adicionado.");
    },
  });
}

function deleteItem(itemId) {
  const purchase = currentPurchase();
  if (!purchase || purchase.status !== "draft") return;
  const item = purchase.items.find(record => record.id === itemId);
  if (!item) return;
  const hasPrices = Object.keys(item.prices ?? {}).length > 0;
  confirmDialog("Excluir produto",
    hasPrices
      ? `Excluir “${item.name}”? Os preços registrados para ele serão perdidos.`
      : `Excluir “${item.name}” desta compra?`, () => {
      purchase.items = purchase.items.filter(record => record.id !== itemId);
      closeDialog();
      saveAndRender(purchase);
      toast("Produto excluído.");
    }, "Excluir produto");
}

function finishPurchase() {
  const purchase = currentPurchase();
  if (!purchase || purchase.status !== "draft") return;
  const summary = analyzePurchase(purchase);
  if (!summary.canFinish) {
    toast("Selecione 2 mercados, registre algum preço e resolva os empates.");
    return;
  }
  const finish = () => {
    purchase.status = "finished";
    closeDialog();
    saveAndRender(purchase);
    navigateToPurchase(purchase, "listas");
    toast("Comparação finalizada. Suas listas estão prontas!");
  };
  if (summary.pendingPrices || summary.unquotedItems) {
    const lines = [
      `${summary.pendingPrices} ${summary.pendingPrices === 1 ? "preço não informado" : "preços não informados"}.`,
      summary.unquotedItems
        ? `${summary.unquotedItems} ${summary.unquotedItems === 1 ? "produto ficará" : "produtos ficarão"} fora das listas, pois não têm nenhum preço.`
        : "Os menores preços serão escolhidos somente entre os valores preenchidos.",
    ];
    confirmDialog("Finalizar com preços pendentes?", lines.join(" "),
      finish, "Finalizar assim mesmo");
  } else finish();
}

function reopenPurchase() {
  const purchase = currentPurchase();
  if (!purchase || purchase.status !== "finished") return;
  purchase.status = "draft";
  saveAndRender(purchase);
  navigateToPurchase(purchase, "itens");
  toast("Compra reaberta como rascunho.");
}

async function copyList() {
  const purchase = currentPurchase();
  if (!purchase || purchase.status !== "finished") return;
  const summary = analyzePurchase(purchase);
  const lines = [`CESTOU — ${purchase.name}`];
  for (const group of summary.groups) {
    if (!group.rows.length) continue;
    lines.push("", marketName(group.marketId));
    for (const row of group.rows) {
      lines.push(`• ${formatQuantity(row.item.quantity)} ${row.item.unit} de ${row.item.name} — ${formatMoney(Math.round(row.choice.cents * row.item.quantity))}`);
    }
    lines.push(`Subtotal: ${formatMoney(group.subtotal)}`);
  }
  lines.push("", `Total estimado: ${formatMoney(summary.total)}`);
  const text = lines.join("\n");
  try {
    await navigator.clipboard.writeText(text);
    toast("Listas copiadas.");
  } catch {
    openDialog({
      title: "Copiar listas",
      body: `<label class="field"><span>Selecione o texto e copie:</span>
        <textarea rows="12" readonly>${e(text)}</textarea></label>`,
      submitLabel: "Fechar",
      onSubmit: closeDialog,
    });
  }
}

function resetDemo() {
  confirmDialog("Restaurar exemplo",
    "Isso substituirá todas as suas compras e mercados deste navegador pelos dados fictícios de demonstração. Deseja continuar?",
    () => {
      activePriceMarket.clear();
      store.reset();
      closeDialog();
      location.hash = "compras";
      render();
      toast("Demonstração restaurada.");
    }, "Restaurar dados");
}

function filterPrices() {
  const search = document.getElementById("price-search");
  const pendingOnly = document.getElementById("price-pending-only");
  if (!search) return;
  const query = search.value.trim().toLocaleLowerCase("pt-BR");
  let visible = 0;
  document.querySelectorAll("[data-price-row]").forEach(row => {
    const matches = row.dataset.itemName.includes(query) &&
      (!pendingOnly.checked || row.dataset.filled !== "true");
    row.hidden = !matches;
    if (matches) visible += 1;
  });
  const noResults = document.getElementById("price-no-matches");
  if (noResults) noResults.hidden = visible > 0;
}

document.addEventListener("submit", event => {
  if (event.target.id === "dialog-form") {
    event.preventDefault();
    submitDialog(event.target);
  }
  if (event.target.id === "market-form") {
    event.preventDefault();
    const input = event.target.elements.name;
    const feedback = document.getElementById("market-feedback");
    const name = cleanName(input.value);
    if (!name) { feedback.textContent = "Informe o nome do mercado."; return; }
    if (isDuplicateMarket(name)) { feedback.textContent = "Esse mercado já foi cadastrado."; return; }
    store.data.markets.push({ id: newId(), name });
    feedback.textContent = "";
    saveAndRender();
    toast("Mercado cadastrado.");
  }
});

document.addEventListener("click", event => {
  if (event.target.matches("[data-dialog-backdrop], [data-close-dialog]")) {
    closeDialog();
    return;
  }
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const action = trigger.dataset.action;
  const id = trigger.dataset.id;
  if (action === "new-purchase") newPurchase();
  if (action === "rename-purchase") renamePurchase(id);
  if (action === "delete-purchase") deletePurchase(id);
  if (action === "rename-market") renameMarket(id);
  if (action === "delete-market") deleteMarket(id);
  if (action === "add-item") editItem();
  if (action === "edit-item") editItem(id);
  if (action === "delete-item") deleteItem(id);
  if (action === "finish") finishPurchase();
  if (action === "reopen") reopenPurchase();
  if (action === "copy-list") copyList();
  if (action === "reset-demo") resetDemo();
  if (action === "select-price-market") {
    const purchase = currentPurchase();
    if (!purchase || !purchase.marketIds.includes(id)) return;
    activePriceMarket.set(purchase.id, id);
    render();
  }
});

document.addEventListener("change", event => {
  const purchase = currentPurchase();
  if (!purchase) return;
  const field = event.target;
  if (field.matches("[data-market-option]") && purchase.status === "draft") {
    const marketId = field.dataset.marketOption;
    if (field.checked && purchase.marketIds.length >= 4) {
      field.checked = false;
      toast("Cada compra pode comparar no máximo quatro mercados.");
      return;
    }
    if (field.checked && !purchase.marketIds.includes(marketId)) purchase.marketIds.push(marketId);
    if (!field.checked) purchase.marketIds = purchase.marketIds.filter(id => id !== marketId);
    saveAndRender(purchase, true);
  }
  if (field.matches("[data-price-item]") && purchase.status === "draft") {
    const item = purchase.items.find(row => row.id === field.dataset.priceItem);
    const marketId = field.dataset.priceMarket;
    if (!item || !purchase.marketIds.includes(marketId)) return;
    const raw = field.value.trim();
    if (raw === "") delete item.prices[marketId];
    else {
      const cents = parsePrice(raw);
      if (cents === null) {
        toast("Preço inválido. Use, por exemplo, 12,90.");
        field.value = priceToInput(item.prices?.[marketId]);
        return;
      }
      item.prices[marketId] = cents;
    }
    saveAndRender(purchase, true);
  }
  if (field.matches("[data-tie-item]") && purchase.status === "draft") {
    const item = purchase.items.find(row => row.id === field.dataset.tieItem);
    if (!item) return;
    const row = analyzeItem(item, purchase);
    if (!row.tiedMarketIds.includes(field.value)) return;
    item.tieMarketId = field.value;
    saveAndRender(purchase, true);
  }
  if (field.matches("[data-done-item]") && purchase.status === "finished") {
    const item = purchase.items.find(row => row.id === field.dataset.doneItem);
    if (!item) return;
    item.done = field.checked;
    saveAndRender(purchase, true);
  }
});

document.addEventListener("input", event => {
  if (event.target.id === "price-search") filterPrices();
});

document.addEventListener("change", event => {
  if (event.target.id === "price-pending-only") filterPrices();
});

document.addEventListener("keydown", event => {
  if (isDialogOpen()) {
    if (event.key === "Escape") { closeDialog(); event.preventDefault(); }
    else if (event.key === "Tab") dialogTabTrap(event);
  }
  if (event.key === "Enter" && event.target.matches("[data-price-item]")) {
    event.preventDefault();
    const inputs = [...document.querySelectorAll("[data-price-item]:not([disabled])")];
    const next = inputs[inputs.indexOf(event.target) + 1];
    if (next) next.focus();
    else event.target.blur();
  }
});

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
});

store.save();
render();
