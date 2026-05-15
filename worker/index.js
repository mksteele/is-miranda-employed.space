const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SEED = 127; // starting count so it doesn't begin at 1

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/visit') {
      const id = crypto.randomUUID();
      const countStr = await env.COUNTER_KV.get('total_count');
      const count = (countStr ? parseInt(countStr, 10) : SEED) + 1;

      await Promise.all([
        env.COUNTER_KV.put('total_count', String(count)),
        env.COUNTER_KV.put(`visitor:${id}`, String(count)),
      ]);

      return json({ count, visitorNumber: count, id });
    }

    if (request.method === 'GET' && url.pathname === '/count') {
      const countStr = await env.COUNTER_KV.get('total_count');
      const count = countStr ? parseInt(countStr, 10) : SEED;
      return json({ count });
    }

    return new Response('Not found', { status: 404, headers: CORS_HEADERS });
  },
};

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
