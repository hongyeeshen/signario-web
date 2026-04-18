import type { APIRoute } from 'astro';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json().catch(() => null);
  const email = typeof json?.email === 'string' ? json.email.trim() : '';

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.BREVO_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ ok: false, error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Signario Waitlist', email: 'hongyeeshen@gmail.com' },
      to: [{ email: 'hongyeeshen@gmail.com' }],
      replyTo: { email },
      subject: 'New Signario Waitlist Signup',
      htmlContent: `<p>New waitlist signup from <strong>${escapeHtml(email)}</strong></p>`,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};