import { createClient } from '@supabase/supabase-js';

type HttpResponse = {
  status: (code: number) => HttpResponse;
  json: (body: unknown) => void;
  end: (chunk?: string | Buffer) => void;
  setHeader: (name: string, value: string) => void;
};

type HttpRequest = {
  method?: string;
  url?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

const PREFIX = '/api/daily-engine';

function readHeader(req: HttpRequest, name: string): string | undefined {
  const h = req.headers;
  if (!h) return undefined;
  const lower = name.toLowerCase();
  const v = h[lower] ?? h[name];
  if (Array.isArray(v)) return v[0]?.trim();
  return typeof v === 'string' ? v.trim() : undefined;
}

async function validateBearerSession(req: HttpRequest): Promise<boolean> {
  const auth = readHeader(req, 'authorization');
  if (!auth?.toLowerCase().startsWith('bearer ')) return false;
  const jwt = auth.slice(7).trim();
  if (!jwt) return false;

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const supabaseKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      ''
  ).trim();

  if (!supabaseUrl || !supabaseKey) return false;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.getUser(jwt);
  return !error && Boolean(data.user);
}

function buildUpstreamTarget(base: string, req: HttpRequest): string | null {
  const rawUrl = req.url || '/';
  let pathname: string;
  let search = '';
  try {
    const u = new URL(rawUrl, 'http://localhost');
    pathname = u.pathname;
    search = u.search;
  } catch {
    pathname = rawUrl.split('?')[0] || '/';
    const q = rawUrl.indexOf('?');
    search = q >= 0 ? rawUrl.slice(q) : '';
  }

  if (!pathname.startsWith(PREFIX)) return null;
  const tail = pathname.slice(PREFIX.length) || '/';
  return `${base.replace(/\/$/, '')}${tail}${search}`;
}

function serializeBody(body: unknown, method: string): string | Buffer | undefined {
  if (method === 'GET' || method === 'HEAD') return undefined;
  if (body == null) return undefined;
  if (typeof body === 'string') return body;
  if (Buffer.isBuffer(body)) return body;
  if (typeof body === 'object') return JSON.stringify(body);
  return String(body);
}

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
]);

export default async function handler(req: HttpRequest, res: HttpResponse): Promise<void> {
  const engineBase = String(process.env.DAILY_ENGINE_URL || '').trim().replace(/\/$/, '');
  if (!engineBase || !/^https?:\/\//i.test(engineBase)) {
    res.status(503).json({ error: 'DAILY_ENGINE_URL is not configured on Vercel' });
    return;
  }

  const method = (req.method || 'GET').toUpperCase();
  if (method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const okAuth = await validateBearerSession(req);
  if (!okAuth) {
    res.status(401).json({ error: 'Sign in required' });
    return;
  }

  const target = buildUpstreamTarget(engineBase, req);
  if (!target) {
    res.status(400).json({ error: 'Bad proxy path' });
    return;
  }

  const forwardHeaders = new Headers();
  const ct = readHeader(req, 'content-type');
  if (ct) forwardHeaders.set('content-type', ct);
  const accept = readHeader(req, 'accept');
  if (accept) forwardHeaders.set('accept', accept);

  const body = serializeBody(req.body, method);

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers: forwardHeaders,
      body,
    });
  } catch (e) {
    console.error('daily-engine proxy fetch failed', e);
    res.status(502).json({ error: 'Upstream engine unreachable' });
    return;
  }

  res.status(upstream.status);
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (HOP_BY_HOP.has(k)) return;
    if (k === 'content-encoding' || k === 'content-length') return;
    res.setHeader(key, value);
  });

  const buf = Buffer.from(await upstream.arrayBuffer());
  res.end(buf);
}
