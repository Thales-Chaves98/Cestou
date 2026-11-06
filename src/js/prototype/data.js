/**
 * Cestou — protótipo funcional temporário, com JavaScript criado por IA.
 * Após a aprovação do protótipo, este JS será retirado para o aluno implementá-lo.
 */
export const STORAGE_KEY = "cestou.prototipo.v2";

export const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const now = () => new Date().toISOString();

const demoItem = (id, name, quantity, unit, prices = {}, tieMarketId = null, done = false) =>
  ({ id, name, quantity, unit, prices, tieMarketId, done });

export function createDemo() {
  const markets = [
    { id: "mercado-central", name: "Mercado Central" },
    { id: "mercado-bom-preco", name: "Bom Preço" },
    { id: "mercado-avenida", name: "Mercado Avenida" },
    { id: "mercado-bairro", name: "Mercado do Bairro" },
  ];
  const [a, b, c] = markets.map(market => market.id);
  return {
    version: 2,
    markets,
    purchases: [
      {
        id: "compra-novembro",
        name: "Compra de novembro",
        status: "draft",
        createdAt: now(),
        updatedAt: now(),
        marketIds: [a, b, c],
        items: [
          demoItem("arroz", "Arroz", 2, "un", { [a]: 2200, [b]: 2400, [c]: 2300 }),
          demoItem("leite", "Leite", 6, "un", { [a]: 550, [b]: 490, [c]: 530 }),
          demoItem("cafe", "Café", 1, "un", { [a]: 2000, [b]: 1900, [c]: 1800 }),
          demoItem("feijao", "Feijão", 2, "un", { [a]: 790, [b]: 790, [c]: 820 }),
          demoItem("oleo", "Óleo de soja", 2, "un", { [a]: 749, [c]: 729 }),
          demoItem("acucar", "Açúcar", 3, "un"),
        ],
      },
      {
        id: "compra-exemplo-finalizada",
        name: "Compra de exemplo — finalizada",
        status: "finished",
        createdAt: now(),
        updatedAt: now(),
        marketIds: [a, b],
        items: [
          demoItem("item-macarrao", "Macarrão", 3, "un", { [a]: 490, [b]: 520 }),
          demoItem("item-detergente", "Detergente", 2, "un", { [a]: 299, [b]: 299 }, b, true),
          demoItem("item-biscoito", "Biscoito", 2, "un", { [a]: 499, [b]: 450 }),
        ],
      },
    ],
  };
}

function validData(value) {
  return value && value.version === 2 &&
    Array.isArray(value.markets) && Array.isArray(value.purchases) &&
    value.markets.every(m => typeof m.id === "string" && typeof m.name === "string") &&
    value.purchases.every(p => typeof p.id === "string" && Array.isArray(p.marketIds) && Array.isArray(p.items));
}

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const data = JSON.parse(stored);
      if (validData(data)) return data;
    }
  } catch {
    // Em navegadores com armazenamento bloqueado, o protótipo ainda abre.
  }
  return createDemo();
}

export const store = {
  data: load(),
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      return true;
    } catch {
      return false;
    }
  },
  reset() {
    this.data = createDemo();
    return this.save();
  },
};

export function getMarket(id) {
  return store.data.markets.find(m => m.id === id);
}

export function marketName(id) {
  return getMarket(id)?.name ?? "Mercado removido";
}

export function getPurchase(id) {
  return store.data.purchases.find(p => p.id === id);
}

export function touch(purchase) {
  purchase.updatedAt = now();
}

export function cleanName(raw) {
  return String(raw ?? "").replace(/\s+/g, " ").trim();
}

export function isDuplicateMarket(name, exceptId = null) {
  return store.data.markets.some(m =>
    m.id !== exceptId && cleanName(m.name).toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"));
}

export function isDuplicateItem(purchase, name, exceptId = null) {
  return purchase.items.some(item =>
    item.id !== exceptId && cleanName(item.name).toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"));
}
