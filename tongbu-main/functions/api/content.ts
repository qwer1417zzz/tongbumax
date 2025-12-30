export const onRequestGet = async ({ env }) => {
  const data = await env.CONTENT_KV.get("site_content", "json");
  return new Response(JSON.stringify(data ?? {}), {
    headers: { "Content-Type": "application/json" },
  });
};

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json();
    
    // 简单校验数据结构
    if (!body || typeof body !== 'object') {
      return new Response(JSON.stringify({ success: false, error: 'Invalid data format' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    await env.CONTENT_KV.put("site_content", JSON.stringify(body));
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to process request' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};