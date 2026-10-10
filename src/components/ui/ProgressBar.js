/* Barra de progresso. `ok` pinta de verde (meta concluída). */
export const ProgressBar = (percent, ok = false) =>
  `<div class="bar${ok ? ' ok' : ''}"><i style="width:${percent}%"></i></div>`;
