import { Buffer } from 'node:buffer';
import { NextResponse } from 'next/server';

const MAX_ATTACHMENT_SIZE = 3 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

function getBrowser(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return 'Microsoft Edge';
  if (/OPR\//i.test(userAgent)) return 'Opera';
  if (/Firefox\//i.test(userAgent)) return 'Firefox';
  if (/Chrome\//i.test(userAgent)) return 'Chrome';
  if (/Safari\//i.test(userAgent)) return 'Safari';
  return 'Unknown';
}

function getOperatingSystem(userAgent: string) {
  if (/Windows NT/i.test(userAgent)) return 'Windows';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
  if (/Mac OS X/i.test(userAgent)) return 'macOS';
  if (/CrOS/i.test(userAgent)) return 'ChromeOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  return 'Unknown';
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const nameEntry = formData.get('name');
  const phoneEntry = formData.get('phone');
  const issueEntry = formData.get('issue');
  const latitudeEntry = formData.get('latitude');
  const longitudeEntry = formData.get('longitude');
  const attachmentEntry = formData.get('attachment');

  const name = typeof nameEntry === 'string' ? nameEntry.trim() : '';
  const phone = typeof phoneEntry === 'string' ? phoneEntry.trim() : '';
  const issue = issueEntry === null ? '' : typeof issueEntry === 'string' ? issueEntry.trim() : null;

  if (!name || !phone || issue === null || name.length > 200 || phone.length > 80 || issue.length > 2000) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  let location = 'Not shared';
  if (latitudeEntry !== null || longitudeEntry !== null) {
    const latitude = typeof latitudeEntry === 'string' ? Number(latitudeEntry) : Number.NaN;
    const longitude = typeof longitudeEntry === 'string' ? Number(longitudeEntry) : Number.NaN;
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
    }
    location = `Latitude ${latitude.toFixed(5)}, longitude ${longitude.toFixed(5)}`;
  }

  let attachment: { filename: string; content: string } | undefined;
  if (attachmentEntry !== null) {
    if (
      typeof attachmentEntry === 'string' ||
      attachmentEntry.size > MAX_ATTACHMENT_SIZE ||
      !ALLOWED_ATTACHMENT_TYPES.has(attachmentEntry.type)
    ) {
      return NextResponse.json({ error: 'invalid_attachment' }, { status: 400 });
    }

    attachment = {
      filename: attachmentEntry.name.replace(/[\\/\r\n"]/g, '_'),
      content: Buffer.from(await attachmentEntry.arrayBuffer()).toString('base64'),
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error('Service request email is not configured: set RESEND_API_KEY and RESEND_FROM_EMAIL.');
    return NextResponse.json({ error: 'email_not_configured' }, { status: 503 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const ipAddress = request.headers.get('x-real-ip')?.trim()
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'Unavailable';

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
          `Name and company: ${name}`,
          `Phone: ${phone}`,
          `Issue: ${issue || 'Not specified'}`,
          '',
          'Visitor information:',
          `IP address: ${ipAddress}`,
          `Location: ${location}`,
          `Browser: ${getBrowser(userAgent)}`,
          `Operating system: ${getOperatingSystem(userAgent)}`,
        ].join('\n'),
        ...(attachment ? { attachments: [attachment] } : {}),
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
