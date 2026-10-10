let timer;

/* Mensagem curta no rodapé, some sozinha em 2,6 s. */
export function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(timer);
  timer = setTimeout(() => (t.hidden = true), 2600);
}
