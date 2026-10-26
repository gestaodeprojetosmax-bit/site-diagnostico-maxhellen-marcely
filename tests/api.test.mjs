import test from 'node:test';
import assert from 'node:assert/strict';
import { site, options } from '../dist/config.mjs';
import { blankAnswers, buildPayload } from '../dist/form-core.mjs';
import { POST } from '../api/diagnosticos.js';

const samplePayload = () => {
  const answers = {
    ...blankAnswers(),
    fullName: 'Pessoa de Teste',
    company: 'Empresa de Exemplo',
    whatsapp: '(85) 99999-1234',
    email: 'qa@example.com',
    revenue: options.revenue[1],
    segment: options.segment[4],
    team: options.team[1],
    challenges: [options.challenges[0]],
    timing: options.timing[0],
    investment: options.investment[1],
    decision: options.decision[0],
    consent: true,
  };
  return buildPayload(answers, site.privacy.version);
};

const makeRequest = (body, extraHeaders = {}) => new Request('https://site.example/api/diagnosticos', {
  method: 'POST',
  headers: {
    Origin: 'https://site.example',
    'Content-Type': 'application/json',
    'Idempotency-Key': 'a'.repeat(32),
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

async function withEnv(values, run) {
  const previous = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  for (const [key, value] of Object.entries(values)) {
    if (value === null) delete process.env[key];
    else process.env[key] = value;
  }
  try { await run(); }
  finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

const webhookEnv = {
  DIAGNOSTICS_ENABLED: 'true',
  WEBHOOK_URL: 'https://n8n.example/webhook/test-token',
};

test('endpoint permanece desligado por padrão e não chama o webhook', async () => {
  await withEnv({ DIAGNOSTICS_ENABLED: null, WEBHOOK_URL: null }, async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error('não deveria chamar a rede'); };
    try {
      const response = await POST(makeRequest(samplePayload()));
      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), { error: 'receiving_disabled' });
    } finally { globalThis.fetch = originalFetch; }
  });
});

test('rejeita origem diferente sem encaminhar dados', async () => {
  await withEnv(webhookEnv, async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error('não deveria chamar a rede'); };
    try {
      const response = await POST(makeRequest(samplePayload(), { Origin: 'https://attacker.example' }));
      assert.equal(response.status, 403);
    } finally { globalThis.fetch = originalFetch; }
  });
});

test('valida o payload no servidor antes de encaminhar', async () => {
  await withEnv(webhookEnv, async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error('não deveria chamar a rede'); };
    try {
      const invalid = samplePayload();
      invalid.business.revenue = 'valor inventado';
      const response = await POST(makeRequest(invalid));
      assert.equal(response.status, 422);
    } finally { globalThis.fetch = originalFetch; }
  });
});

test('encaminha todos os campos e a chave de idempotência ao n8n', async () => {
  await withEnv(webhookEnv, async () => {
    const originalFetch = globalThis.fetch;
    const payload = samplePayload();
    let captured;
    globalThis.fetch = async (url, init) => {
      captured = { url, init };
      return new Response(null, { status: 204 });
    };
    try {
      const response = await POST(makeRequest(payload));
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { accepted: true, submissionId: 'a'.repeat(32) });
      assert.equal(captured.url, webhookEnv.WEBHOOK_URL);
      const forwardedPayload = JSON.parse(captured.init.body);
      const { submittedAt, ...forwardedAnswers } = forwardedPayload;
      assert.deepEqual(forwardedAnswers, payload);
      assert.match(submittedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      assert.ok(Number.isFinite(Date.parse(submittedAt)));
      assert.equal(captured.init.headers['Idempotency-Key'], 'a'.repeat(32));
      assert.equal(captured.init.redirect, 'error');
    } finally { globalThis.fetch = originalFetch; }
  });
});

test('aceita resposta HTTP 2xx simples do n8n sem JSON personalizado', async () => {
  await withEnv(webhookEnv, async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response('workflow started', { status: 200 });
    try {
      const response = await POST(makeRequest(samplePayload()));
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { accepted: true, submissionId: 'a'.repeat(32) });
    } finally { globalThis.fetch = originalFetch; }
  });
});

test('resposta HTTP não 2xx do n8n continua sendo reportada como falha', async () => {
  await withEnv(webhookEnv, async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response('workflow failed', { status: 500 });
    try {
      const response = await POST(makeRequest(samplePayload()));
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json(), { error: 'receiver_failed' });
    } finally { globalThis.fetch = originalFetch; }
  });
});
