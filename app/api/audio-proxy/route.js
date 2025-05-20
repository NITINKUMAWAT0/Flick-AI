export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) return new Response('Missing URL', { status: 400 });

    // Do NOT decode URL here
    // console.log('Proxying URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        // Optional: add Accept header if needed
        'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.8',
      },
    });

    if (!response.ok) {
      return new Response(`Upstream failed: ${response.status}`, { status: 502 });
    }

    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.delete('content-encoding'); // remove content-encoding to avoid encoding issues

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return new Response('Fetch error', { status: 502 });
  }
}
