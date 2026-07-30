export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'Missing html in request body' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CX Gazette <gazette@YOUR_VERIFIED_DOMAIN>',
        to: 'YOUR_TEST_EMAIL_ADDRESS',
        subject: 'CX Gazette — test send',
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Resend API error' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
