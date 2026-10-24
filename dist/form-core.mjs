import { options } from './config.mjs';

export const blankAnswers = () => ({
  fullName: '', company: '', website: '', whatsapp: '', email: '', location: '',
  revenue: '', segment: '', team: '', challenges: [], otherChallenge: '',
  problem: '', timing: '', investment: '', decision: '', consent: false, marketing: false,
});

// getRandomValues também funciona na prévia HTTP local; randomUUID requer HTTPS.
export const createRequestId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2,'0')).join('');

export function phoneDigits(value) {
  let digits = String(value).replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2);
  return digits.slice(0, 11);
}

export function formatPhone(value) {
  const d = phoneDigits(value);
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  const middle = d.length > 10 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, middle)}${d.length > middle ? '-' + d.slice(middle) : ''}`;
}

const ddds = new Set('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '));
export function validPhone(value) {
  const d = phoneDigits(value);
  return ddds.has(d.slice(0, 2)) && ((d.length === 11 && d[2] === '9') || (d.length === 10 && /[2-5]/.test(d[2])));
}

export function validateStep(step, a) {
  const errors = {};
  const choose = keys => keys.forEach(k => { if (!options[k].includes(a[k])) errors[k] = 'Selecione uma opção para continuar.'; });
  if (step === 0) {
    if (!a.fullName.trim() || a.fullName.trim().split(/\s+/).length < 2) errors.fullName = 'Informe seu nome e sobrenome.';
    if (!a.company.trim()) errors.company = 'Informe o nome da sua empresa.';
    if (!validPhone(a.whatsapp)) errors.whatsapp = 'Informe um telefone válido com DDD, como (85) 99999-9999.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a.email.trim())) errors.email = 'Informe um e-mail válido, como nome@empresa.com.br.';
    for (const key of ['fullName','company','website','email','location']) if (a[key].length > 200) errors[key] = 'Use no máximo 200 caracteres.';
  }
  if (step === 1) choose(['revenue', 'segment', 'team']);
  if (step === 2) {
    if (!Array.isArray(a.challenges) || a.challenges.length < 1 || a.challenges.length > 3 || new Set(a.challenges).size !== a.challenges.length || a.challenges.some(c => !options.challenges.includes(c))) errors.challenges = 'Escolha de um a três desafios.';
    if (a.challenges.includes('Outro') && !a.otherChallenge.trim()) errors.otherChallenge = 'Descreva o outro desafio da sua empresa.';
    if (a.otherChallenge.length > 500) errors.otherChallenge = 'Use no máximo 500 caracteres.';
    if (a.problem.length > 1500) errors.problem = 'Use no máximo 1.500 caracteres.';
  }
  if (step === 3) {
    choose(['timing', 'investment', 'decision']);
    if (a.consent !== true) errors.consent = 'Para continuar, autorize o tratamento dos dados para esta solicitação.';
  }
  return errors;
}

export function integrationReady(config) {
  return typeof config.integration.endpoint === 'string' && /^\/(?!\/)[a-zA-Z0-9/_-]+$/.test(config.integration.endpoint)
    && config.integration.privacyReady === true && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.privacy.contactEmail)
    && [config.specialist.name, config.method.name, config.specialist.biography, config.method.description, config.privacy.controller, config.privacy.document, config.privacy.retention, config.privacy.marketingRetention, config.privacy.processors].every(v => typeof v === 'string' && v.trim() && !/\[.*\]/.test(v));
}

export function buildPayload(a, policyVersion) {
  return {
    schemaVersion: 1, source: 'diagnostico-empresarial',
    contact: { fullName: a.fullName.trim(), company: a.company.trim(), website: a.website.trim() || null, whatsapp: '+55' + phoneDigits(a.whatsapp), email: a.email.trim(), location: a.location.trim() || null },
    business: { revenue: a.revenue, segment: a.segment, salesTeam: a.team },
    challenges: [...a.challenges], otherChallenge: a.challenges.includes('Outro') ? a.otherChallenge.trim() : null,
    priority90Days: a.problem.trim() || null,
    readiness: { timing: a.timing, investment: a.investment, decision: a.decision },
    consent: { diagnostic: a.consent === true, marketing: a.marketing === true, privacyVersion: policyVersion },
  };
}

export class SubmissionError extends Error { constructor(message, code = 'request') { super(message); this.code = code; } }

// Nunca chama a rede em modo de prévia. O servidor deve persistir antes de confirmar.
export async function submitDiagnostic(answers, config, requestId, fetcher = fetch) {
  if (!integrationReady(config)) throw new SubmissionError('O recebimento das respostas ainda não foi ativado. Nenhum dado foi enviado.', 'not-configured');
  for (let step = 0; step < 4; step++) if (Object.keys(validateStep(step, answers)).length) throw new SubmissionError('Revise os campos obrigatórios antes de enviar.', 'validation');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.integration.timeoutMs);
  try {
    const response = await fetcher(config.integration.endpoint, {
      method: 'POST', credentials: 'same-origin', cache: 'no-store', redirect: 'error',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Idempotency-Key': requestId },
      body: JSON.stringify(buildPayload(answers, config.privacy.version)), signal: controller.signal,
    });
    if (response.status === 429) throw new SubmissionError('Há muitas tentativas neste momento. Aguarde um pouco e tente novamente.', 'rate-limit');
    if (response.status === 400 || response.status === 422) throw new SubmissionError('O servidor não aceitou as respostas. Revise seus dados ou tente mais tarde.', 'validation');
    if (!response.ok) throw new SubmissionError('Não foi possível confirmar o recebimento. Suas respostas continuam nesta página para uma nova tentativa.', 'server');
    const result = await response.json();
    if (result.accepted !== true || typeof result.submissionId !== 'string' || !result.submissionId.trim()) throw new SubmissionError('O servidor não confirmou o recebimento. Tente novamente mais tarde.', 'unconfirmed');
    return { submissionId: result.submissionId };
  } catch (error) {
    if (error instanceof SubmissionError) throw error;
    if (error.name === 'AbortError') throw new SubmissionError('A conexão demorou mais que o esperado. Não conseguimos confirmar o recebimento. Tente novamente.', 'timeout');
    throw new SubmissionError('Não conseguimos confirmar o recebimento. Verifique sua conexão e tente novamente. Suas respostas continuam nesta página.', 'network');
  } finally { clearTimeout(timeout); }
}
