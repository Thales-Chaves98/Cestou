import { escapeHtml as e } from "./views/shared.js";

const root = document.getElementById("dialog-root");
const toastElement = document.getElementById("toast");
let activeHandler = null;
let previouslyFocused = null;
let toastTimer = null;

export function openDialog({ title, body, submitLabel = "Salvar", onSubmit, danger = false }) {
  previouslyFocused = document.activeElement;
  activeHandler = onSubmit;
  root.innerHTML = `<div class="modal-backdrop" data-dialog-backdrop>
    <section class="modal panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div class="modal-heading"><h2 id="dialog-title">${e(title)}</h2>
        <button class="icon-button" type="button" data-close-dialog aria-label="Fechar janela">×</button></div>
      <form id="dialog-form">
        <div class="dialog-body">${body}</div>
        <div class="dialog-actions">
          <button class="button button-subtle" type="button" data-close-dialog>Cancelar</button>
          <button class="button ${danger ? "button-danger-solid" : "button-primary"}" type="submit">${e(submitLabel)}</button>
        </div>
      </form>
    </section></div>`;
  document.body.classList.add("dialog-open");
  root.querySelector("input,select,textarea,button")?.focus();
}

export function confirmDialog(title, message, onConfirm, confirmLabel = "Confirmar") {
  openDialog({
    title,
    body: `<p class="dialog-copy">${e(message)}</p>`,
    submitLabel: confirmLabel,
    danger: /excluir|substituir|restaurar/i.test(confirmLabel),
    onSubmit: () => onConfirm(),
  });
}

export function submitDialog(form) {
  activeHandler?.(form);
}

export function closeDialog() {
  root.innerHTML = "";
  activeHandler = null;
  document.body.classList.remove("dialog-open");
  if (previouslyFocused?.isConnected) previouslyFocused.focus();
  previouslyFocused = null;
}

export function isDialogOpen() {
  return Boolean(root.firstElementChild);
}

export function dialogTabTrap(event) {
  const focusable = [...root.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])")];
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

export function toast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("toast-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastElement.classList.remove("toast-visible"), 3600);
}
