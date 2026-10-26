import { options, site } from '../dist/config.mjs';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasKeys = (value, keys) => isRecord(value)
  && Object.keys(value).length === keys.length
  && keys.every(key => Object.hasOwn(value, key));
const isText = (value, max, min = 0) => typeof value === 'string'
  && value.length <= max && value.trim().length >= min;
const isNullableText = (value, max) => value === null || isText(value, max);

function validPayload(payload) {
  if (!hasKeys(payload, ['schemaVersion', 'source', 'contact', 'business', 'challenges', 'otherChallenge', 'priority90Days', 'readiness', 'consent'])) return false;
  if (payload.schemaVersion !== 1 || payload.source !== 'diagnostico-empresarial') return false;

  const { contact, business, challenges, otherChallenge, priority90Days, readiness, consent } = payload;
  if (!hasKeys(contact, ['fullName', 'company', 'website', 'whatsapp', 'email', 'location'])) return false;
  if (!isText(contact.fullName, 200, 3) || contact.fullName.trim().split(/\s+/).length < 2) return false;
  if (!isText(contact.company, 200, 1) || !isNullableText(contact.website, 200) || !isNullableText(contact.location, 200)) return false;
  if (!/^\+55\d{10,11}$/.test(contact.whatsapp)) return false;
  if (!isText(contact.email, 254, 3) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email)) return false;

  if (!hasKeys(business, ['revenue', 'segment', 'salesTeam'])) return false;
  if (!options.revenue.includes(business.revenue) || !options.segment.includes(business.segment) || !options.team.includes(business.salesTeam)) return false;
  if (!Array.isArray(challenges) || challenges.length < 1 || challenges.length > 3
    || new Set(challenges).size !== challenges.length || challenges.some(item => !options.challenges.includes(item))) return false;
  if (challenges.includes('Outro') ? !isText(otherChallenge, 500, 1) : otherChallenge !== null) return false;
  if (!isNullableText(priority90Days, 1500)) return false;

  if (!hasKeys(readiness, ['timing', 'investment', 'decision'])) return false;
  if (!options.timing.includes(readiness.timing) || !options.investment.includes(readiness.investment)
    || !options.decision.includes(readiness.decision)) return false;
  if (!hasKeys(consent, ['diagnostic', 'marketing', 'privacyVersion']) || consent.diagnostic !== true
    || typeof consent.marketing !== 'boolean' || consent.privacyVersion !== site.privacy.version) return false;
  return true;
}

export async function POST(request) {
  if (process.env.DIAGNOSTICS_ENABLED !== 'true') return json({ error: 'receiving_disabled' }, 503);

  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return json({ error: 'receiving_unconfigured' }, 503);
  let parsedWebhook;
  try { parsedWebhook = new URL(webhookUrl); } catch { return json({ error: 'receiving_unconfigured' }, 503); }
  if (parsedWebhook.protocol !== 'https:' || parsedWebhook.username || parsedWebhook.password) return json({ error: 'receiving_unconfigured' }, 503);

  const requestOrigin = request.headers.get('origin');
  let expectedOrigin;
  try { expectedOrigin = new URL(request.url).origin; } catch { return json({ error: 'invalid_request' }, 400); }
  if (!requestOrigin || requestOrigin !== expectedOrigin) return json({ error: 'invalid_origin' }, 403);
  if ((request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase() !== 'application/json') return json({ error: 'invalid_content_type' }, 415);

  const idempotencyKey = request.headers.get('idempotency-key') || '';
  if (!/^[a-f0-9]{32}$/i.test(idempotencyKey)) return json({ error: 'invalid_idempotency_key' }, 400);

  let body;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 16_384) return json({ error: 'payload_too_large' }, 413);
    body = JSON.parse(raw);
  } catch { return json({ error: 'invalid_json' }, 400); }
  if (!validPayload(body)) return json({ error: 'invalid_payload' }, 422);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7_000);
  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(body),
      cache: 'no-store',
      redirect: 'error',
      signal: controller.signal,
    });
    if (upstream.status === 429) return json({ error: 'receiver_rate_limited' }, 429);
    if (!upstream.ok) return json({ error: 'receiver_failed' }, 502);
    // Qualquer resposta HTTP 2xx do webhook significa que ele aceitou a requisição.
    // Não exigimos um corpo JSON proprietário; a chave idempotente identifica o envio.
    return json({ accepted: true, submissionId: idempotencyKey });
  } catch {
    return json({ error: 'receiver_unavailable' }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
