import { formatMoney } from "../pricing.js";

export const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

export const dateLabel = iso => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

export function badge(status) {
  const finished = status === "finished";
  return `<span class="status-badge ${finished ? "status-finished" : "status-draft"}">${finished ? "Finalizada" : "Rascunho"}</span>`;
}

export function empty(title, message, action = "") {
  return `<div class="empty-state"><div class="empty-icon" aria-hidden="true">▤</div>
    <strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>${action}</div>`;
}

export function sectionHeading(title, description = "") {
  return `<div class="section-heading"><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ""}</div>`;
}

export function formatItemTotal(row) {
  return formatMoney(Math.round(row.choice.cents * row.item.quantity));
}

export function itemCount(n) {
  return `${n} ${n === 1 ? "item" : "itens"}`;
}
