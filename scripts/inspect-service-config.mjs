// Explicitly invoked read-only account checks. No mail/content reads or Redis writes.
// Only allowlisted results reach stdout; credentials and raw responses never do.
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env.local')) loadEnvFile('.env.local');
const result = { checkedAt: new Date().toISOString(),
  localConfiguration: {
    originMatches: process.env.NEXT_PUBLIC_SITE_URL === 'https://posiblo.com',
    senderMatches: process.env.CONTACT_FROM_EMAIL === 'website@posiblo.com',
    productionFormOptIn: process.env.CONTACT_FORM_ENABLED === 'true',
    trustedProxyOptIn: process.env.CONTACT_TRUST_PROXY === 'true',
    rateLimitSecretLengthSufficient: (process.env.CONTACT_RATE_LIMIT_SECRET || '').length >= 32,
    vercelTokenAvailable: Boolean(process.env.VERCEL_TOKEN),
  },
};
async function read(url, options) {
  try {
    const response = await fetch(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(10000) });
    if (!response.ok) return { status: response.status };
    return { status: response.status, body: await response.json() };
  } catch (error) {
    const code = error?.cause?.code;
    return { status: 'network_unavailable', ...(new Set(['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY']).has(code) ? { errorCode: code } : {}) };
  }
}
if (process.env.RESEND_API_KEY?.trim()) {
  const response = await read('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}` },
  });
  const domain = response.body?.data?.find(item => item.name === 'posiblo.com');
  const knownRegions = ['us-east-1', 'eu-west-1', 'sa-east-1', 'ap-northeast-1'];
  result.resend = { status: response.status, ...(response.errorCode ? { errorCode: response.errorCode } : {}),
    ...(response.body ? { posibloDomainFound: Boolean(domain) } : {}),
    ...(domain ? { verified: domain.status === 'verified',
      sendingRegion: knownRegions.includes(domain.region) ? domain.region : 'unverified' } : {}) };
} else result.resend = { status: 'credential_unavailable' };

let redisUrl;
try {
  const url = new URL(process.env.UPSTASH_REDIS_REST_URL || '');
  if (url.protocol === 'https:' && url.hostname.endsWith('.upstash.io') && !url.username && !url.password &&
      !url.port && url.pathname === '/' && !url.search && !url.hash) redisUrl = url.origin;
} catch { /* Invalid or absent endpoint; never print it. */ }
if (redisUrl && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()) {
  // PING is read-only: no keys, counters, TTLs or existing enquiries are touched.
  const response = await read(redisUrl, { method: 'POST',
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN.trim()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['PING']),
  });
  result.upstash = { status: response.status, ...(response.errorCode ? { errorCode: response.errorCode } : {}),
    ...(response.body ? { authenticatedPing: response.body.result === 'PONG' } : {}),
    managementSettingsVerified: false };
} else result.upstash = { status: 'credential_or_valid_endpoint_unavailable' };
console.log(JSON.stringify(result, null, 2));
