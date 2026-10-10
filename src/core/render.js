import { app, ui } from './store.js';
import { $ } from '../utils/dom.js';
import { turma, topico } from '../services/calc.js';
import { updateHeader } from '../components/Header/Header.js';
import { updateTabBar } from '../components/TabBar/TabBar.js';
import { renderSheet } from '../components/Sheet/Sheet.js';
import { ConfigScreen, LoginScreen, NegadoScreen, LoadingScreen } from '../views/Auth/AuthScreens.js';
import { TurmasView } from '../views/Turmas/TurmasView.js';
import { SaldoView } from '../views/Saldo/SaldoView.js';
import { EstimativasView } from '../views/Estimativas/EstimativasView.js';

/* Uma view por aba (ids definidos em components/TabBar). */
const VIEWS = { turmas: TurmasView, saldo: SaldoView, est: EstimativasView };

/* Telas por modo, antes de os dados estarem sincronizados. */
const SCREENS = { config: ConfigScreen, login: LoginScreen, negado: NegadoScreen, loading: LoadingScreen };

let raf = 0;
/* Junta várias mudanças seguidas (ex.: snapshots das 5 coleções) em um único render. */
export function scheduleRender() {
  if (raf) return;
  raf = requestAnimationFrame(() => { raf = 0; render(); });
}

export function render() {
  updateHeader();
  updateTabBar();
  const m = $('#main');
  if (SCREENS[app.mode]) { m.innerHTML = SCREENS[app.mode](); return; }
  if (ui.filtro && !turma(ui.filtro)) ui.filtro = '';
  if (ui.filtroTop && !topico(ui.filtroTop)) ui.filtroTop = '';
  m.innerHTML = (VIEWS[ui.tab] || TurmasView)();
  renderSheet(false);
}
