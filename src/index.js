/* Ponto de entrada: carregado pelo index.html via <script type="module">. */
import { app } from './core/store.js';
import { render } from './core/render.js';
import { mountShell } from './components/AppShell/AppShell.js';
import { bindEvents } from './events/index.js';
import { configurado, initFirebase } from './services/firebase.js';
import { observarLogin } from './services/auth.js';

mountShell(document.getElementById('app'));
bindEvents();
render();

if (!configurado()) {
  app.mode = 'config';
  render();
} else {
  initFirebase();
  observarLogin();
}
