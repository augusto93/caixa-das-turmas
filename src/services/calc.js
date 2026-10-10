/* Consultas e cálculos sobre os dados (sem HTML). */
import { S } from '../core/store.js';
import { byNome } from '../utils/format.js';

/* Margem para comparar valores em reais sem erro de arredondamento. */
export const EPS = 0.004;

export const turma = id => S.turmas.find(t => t.id === id);
export const topico = id => S.topicos.find(t => t.id === id);
export const aluno = id => S.alunos.find(a => a.id === id);
export const despesa = id => S.despesas.find(d => d.id === id);

export const turmasOrdenadas = () => S.turmas.slice().sort(byNome);
export const topicosDe = tid => S.topicos.filter(t => t.turmaId === tid).sort((a, b) => (a.prazo || '9').localeCompare(b.prazo || '9') || byNome(a, b));
export const alunosDe = tid => S.alunos.filter(a => a.turmaId === tid).sort(byNome);

export function pago(alunoId, topId) {
  let s = 0;
  for (const p of S.pagamentos) if (p.alunoId === alunoId && p.topicoId === topId) s += Number(p.valor) || 0;
  return Math.round(s * 100) / 100;
}

/* Quanto o aluno ainda deve no tópico. */
export const faltaNoTopico = (alunoId, t) => Math.max(0, (Number(t?.teto) || 0) - pago(alunoId, t?.id));

export function statsTop(t) {
  const al = S.alunos.filter(a => a.turmaId === t.turmaId && (a.topicos || []).includes(t.id));
  const teto = Number(t.teto) || 0;
  let arrec = 0, falta = 0, quit = 0, zero = 0;
  const pend = [];
  for (const a of al) {
    const p = pago(a.id, t.id);
    const f = Math.max(0, teto - p);
    falta += f;
    if (f <= EPS) quit++;
    else pend.push({ a, p, f });
    if (p === 0) zero++;
  }
  // Arrecadado conta todos os pagamentos do tópico, inclusive de alunos que saíram dele.
  for (const p of S.pagamentos) if (p.topicoId === t.id) arrec += Number(p.valor) || 0;
  pend.sort((x, y) => y.f - x.f);
  return { n: al.length, teto, meta: al.length * teto, arrec, falta, quit, zero, pend };
}

export function statsTurma(tid) {
  let meta = 0, arrec = 0, falta = 0;
  for (const t of topicosDe(tid)) {
    const s = statsTop(t);
    meta += s.meta;
    falta += s.falta;
  }
  for (const p of S.pagamentos) if (p.turmaId === tid) arrec += Number(p.valor) || 0;
  return { meta, arrec, falta };
}

export function alunoQuitado(a) {
  const ts = a.topicos || [];
  if (!ts.length) return false;
  return ts.every(id => {
    const t = topico(id);
    return !t || pago(a.id, id) >= (Number(t.teto) || 0) - EPS;
  });
}
