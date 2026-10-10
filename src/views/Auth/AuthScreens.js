import { app } from '../../core/store.js';
import { esc } from '../../utils/format.js';

/* Telas exibidas fora do app logado: configuração, login, acesso negado e carregamento. */

export const ConfigScreen = () =>
  `<div class="login"><h1>Falta configurar</h1><p class="muted">Preencha o arquivo <b>firebase-config.js</b> com os dados do seu projeto Firebase (veja o README).</p></div>`;

export const LoginScreen = () =>
  `<div class="login"><div class="brand-mark" style="width:56px;height:56px;font-size:1.3rem;border-radius:16px">R$</div><h1>Caixa das Turmas</h1><p class="muted">Controle de pagamentos por turma, saldo e estimativas. Entre com sua conta Google: cada pessoa tem o seu próprio caixa, e só você vê os seus dados.</p><button class="btn primary block" data-act="entrar">Entrar com Google</button></div>`;

export const NegadoScreen = () =>
  `<div class="login"><h1>Acesso não liberado</h1><p class="muted">A conta <b>${esc(app.me?.email || '')}</b> não tem permissão. Saia e entre novamente. Se continuar, avise o responsável pelo app.</p><button class="btn block" data-act="sair">Entrar com outra conta</button></div>`;

export const LoadingScreen = () => '<div class="loading">Carregando dados…</div>';
