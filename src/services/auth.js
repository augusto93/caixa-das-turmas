import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { fb } from './firebase.js';
import { assinar, cancelarAssinaturas } from './db.js';
import { app, ui, limparDados } from '../core/store.js';
import { render } from '../core/render.js';
import { toast } from '../components/Toast/Toast.js';

export async function entrar() {
  const prov = new GoogleAuthProvider();
  prov.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(fb.auth, prov);
  } catch (e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') await signInWithRedirect(fb.auth, prov);
    else if (e.code === 'auth/unauthorized-domain') toast('Domínio não autorizado no Firebase. Veja o README.');
    else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') toast('Não foi possível entrar: ' + e.code);
  }
}

export function sair() {
  signOut(fb.auth);
}

/* Reage a login/logout: assina os dados do usuário ou volta para a tela de login. */
export function observarLogin() {
  getRedirectResult(fb.auth).catch(() => {});
  onAuthStateChanged(fb.auth, u => {
    app.me = u;
    cancelarAssinaturas();
    if (!u) {
      limparDados();
      ui.sheet = null;
      app.mode = 'login';
      render();
      return;
    }
    app.mode = 'loading';
    render();
    assinar();
  });
}
