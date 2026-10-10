import { Header } from '../Header/Header.js';
import { TabBar } from '../TabBar/TabBar.js';

/* Estrutura fixa da página, montada dentro de #app do index.html. As telas são desenhadas dentro de #main e as sheets em #sheet-root. */
export function mountShell(root) {
  root.innerHTML = `${Header()}
<main id="main"><div class="loading">Carregando dados…</div></main>
${TabBar()}
<div id="sheet-root"></div>`;
}
