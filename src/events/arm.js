/* Confirmação em dois toques para ações destrutivas.
   No primeiro toque troca o texto do botão e devolve false; no segundo (em até 3,5 s) devolve true. */
export function arm(el, msg) {
  if (el.dataset.armed) return true;
  el.dataset.armed = '1';
  const old = el.textContent;
  el.textContent = msg || 'Confirmar';
  el.classList.add('armed');
  setTimeout(() => {
    if (el.isConnected) {
      delete el.dataset.armed;
      el.textContent = old;
      el.classList.remove('armed');
    }
  }, 3500);
  return false;
}
