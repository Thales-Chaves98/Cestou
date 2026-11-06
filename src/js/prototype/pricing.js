/**
 * Regras puras de cotação: trabalhar em centavos inteiros evita
 * imprecisões nas somas de valores monetários.
 */
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatMoney = cents => brl.format(cents / 100);
export const formatQuantity = quantity => Number(quantity).toLocaleString("pt-BR");

export function priceToInput(cents) {
  return Number.isSafeInteger(cents) ? (cents / 100).toFixed(2).replace(".", ",") : "";
}

export function parsePrice(raw) {
  const value = String(raw ?? "").trim().replace(/\s/g, "");
  if (!/^\d{1,8}(?:[.,]\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

export function analyzeItem(item, purchase) {
  const offers = purchase.marketIds
    .filter(id => Number.isSafeInteger(item.prices?.[id]) && item.prices[id] >= 0)
    .map(id => ({ marketId: id, cents: item.prices[id] }));
  const missingMarketIds = purchase.marketIds.filter(id => !offers.some(offer => offer.marketId === id));

  if (!offers.length) {
    return { item, offers, missingMarketIds, tiedMarketIds: [], choice: null, unresolvedTie: false };
  }

  const minimum = Math.min(...offers.map(offer => offer.cents));
  const tiedMarketIds = offers.filter(offer => offer.cents === minimum).map(offer => offer.marketId);
  const marketId = tiedMarketIds.length === 1
    ? tiedMarketIds[0]
    : (tiedMarketIds.includes(item.tieMarketId) ? item.tieMarketId : null);
  const choice = marketId ? { marketId, cents: minimum } : null;

  return { item, offers, missingMarketIds, tiedMarketIds, choice,
    unresolvedTie: tiedMarketIds.length > 1 && !choice };
}

export function analyzePurchase(purchase) {
  const rows = purchase.items.map(item => analyzeItem(item, purchase));
  const pendingPrices = rows.reduce((sum, row) => sum + row.missingMarketIds.length, 0);
  const unquotedItems = rows.filter(row => row.offers.length === 0).length;
  const unresolvedTies = rows.filter(row => row.unresolvedTie).length;
  const pricedItems = rows.filter(row => row.offers.length > 0).length;
  const assignedItems = rows.filter(row => row.choice).length;
  const groups = purchase.marketIds.map(id => {
    const assigned = rows.filter(row => row.choice?.marketId === id);
    return {
      marketId: id,
      rows: assigned,
      subtotal: assigned.reduce((sum, row) => sum + Math.round(row.choice.cents * row.item.quantity), 0),
    };
  });
  const total = groups.reduce((sum, group) => sum + group.subtotal, 0);
  return {
    rows, pendingPrices, unquotedItems, unresolvedTies, pricedItems, assignedItems,
    groups, total,
    canFinish: purchase.marketIds.length >= 2 && purchase.items.length > 0 &&
      pricedItems > 0 && unresolvedTies === 0,
  };
}
