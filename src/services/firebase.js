import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from '../../firebase-config.js';

/* Instâncias compartilhadas, preenchidas por initFirebase(). */
export const fb = { auth: null, fs: null };

export function configurado() {
  return !!(firebaseConfig && firebaseConfig.apiKey && !String(firebaseConfig.apiKey).startsWith('COLE'));
}

export function initFirebase() {
  const firebaseApp = initializeApp(firebaseConfig);
  fb.auth = getAuth(firebaseApp);
  // Cache local persistente: o app funciona offline e sincroniza ao reconectar.
  fb.fs = initializeFirestore(firebaseApp, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
  return fb;
}
