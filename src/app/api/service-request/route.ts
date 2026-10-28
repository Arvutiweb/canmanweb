import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const form = payload as Record<string, unknown>;
  const name = typeof form.name === 'string' ? form.name.trim() : '';
  const phone = typeof form.phone === 'string' ? form.phone.trim() : '';
  const issue = form.issue === undefined
    ? ''
    : typeof form.issue === 'string'
      ? form.issue.trim()
      : null;

  if (!name || !phone || issue === null || name.length > 200 || phone.length > 80 || issue.length > 2000) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error('Service request email is not configured: set RESEND_API_KEY and RESEND_FROM_EMAIL.');
    return NextResponse.json({ error: 'email_not_configured' }, { status: 503 });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: ['canman.systems@gmail.com'],
        subject: `IT service request from ${name}`,
        text: [
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Issue: ${issue || 'Not specified'}`,
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      console.error(`Resend rejected a service request with status ${response.status}.`);
      return NextResponse.json({ error: 'email_delivery_failed' }, { status: 502 });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error('Unable to deliver service request email.', error);
    return NextResponse.json({ error: 'email_delivery_failed' }, { status: 502 });
  }
}
