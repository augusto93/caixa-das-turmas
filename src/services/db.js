/* Camada de dados (Firebase Firestore).
   As gravações não são aguardadas: o Firestore aplica no cache local na hora
   (a tela atualiza imediatamente, mesmo offline) e sincroniza quando houver conexão. */
import { collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { fb } from './firebase.js';
import { COLS, S, app, ui } from '../core/store.js';
import { render, scheduleRender } from '../core/render.js';
import { toast } from '../components/Toast/Toast.js';

let unsubs = [];

export function clean(o) {
  const r = { ...o };
  delete r.id;
  return r;
}

export function falhaEscrita(e) {
  console.error(e);
  if (e && e.code === 'permission-denied') toast('Sua conta não tem permissão para alterar os dados.');
  else toast('Não foi possível salvar. Verifique a conexão.');
}

/* Caixa compartilhado: todos os e-mails liberados em firestore.rules veem os mesmos dados em {colecao}/{id}. */
const ref = (col, id) => doc(fb.fs, col, id);
const refCol = col => collection(fb.fs, col);

export async function put(col, id, data) {
  const body = { ...clean(data), atualizadoEm: Date.now(), por: app.me?.email || '' };
  setDoc(ref(col, id), body).catch(falhaEscrita);
}

export async function del(col, id) {
  deleteDoc(ref(col, id)).catch(falhaEscrita);
}

/* Grava vários documentos em blocos (o limite de um batch do Firestore é 500 operações). */
export async function emLote(ops) {
  for (let i = 0; i < ops.length; i += 400) {
    const b = writeBatch(fb.fs);
    ops.slice(i, i + 400).forEach(o => (o.del ? b.delete(ref(o.col, o.id)) : b.set(ref(o.col, o.id), o.data)));
    await b.commit();
  }
}

export async function apagarTudo() {
  const ops = [];
  for (const c of COLS) for (const row of S[c]) ops.push({ col: c, id: row.id, del: true });
  try {
    await emLote(ops);
    ui.turma = null;
    toast('Todos os dados foram apagados.');
  } catch (e) {
    falhaEscrita(e);
  }
}

/* Executa uma ação de gravação e mostra a mensagem de sucesso ou o erro. */
export async function run(fn, ok) {
  try {
    await fn();
    if (ok) toast(ok);
  } catch (e) {
    falhaEscrita(e);
    render();
  }
}

export function cancelarAssinaturas() {
  unsubs.forEach(u => u());
  unsubs = [];
}

/* Escuta todas as coleções do usuário e re-renderiza a cada mudança. */
export function assinar() {
  cancelarAssinaturas();
  const vistos = new Set();
  COLS.forEach(c => {
    unsubs.push(onSnapshot(refCol(c), { includeMetadataChanges: false }, snap => {
      S[c] = snap.docs.map(x => ({ id: x.id, ...x.data() }));
      vistos.add(c);
      if (vistos.size === COLS.length && app.mode === 'loading') app.mode = 'sync';
      scheduleRender();
    }, err => {
      console.error(err);
      if (err.code === 'permission-denied') {
        app.mode = 'negado';
        render();
      } else toast('A sincronização parou. Recarregue a página.');
    }));
  });
}
