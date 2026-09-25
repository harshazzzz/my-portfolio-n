import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ResetMailService {
  constructor(private readonly config: ConfigService) {}
  settings() {
    const key = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('RESET_EMAIL_FROM');
    const origin = this.config.get<string>('FRONTEND_URL');
    if (!key || !from || !origin)
      throw new ServiceUnavailableException(
        'Password recovery email is not configured. Contact the site administrator.',
      );
    let url: URL;
    try {
      url = new URL(origin);
    } catch {
      throw new ServiceUnavailableException(
        'Password recovery URL is not configured correctly.',
      );
    }
    if (
      url.username ||
      url.password ||
      !['https:', 'http:'].includes(url.protocol) ||
      (url.protocol !== 'https:' &&
        !['localhost', '127.0.0.1'].includes(url.hostname))
    )
      throw new ServiceUnavailableException(
        'Password recovery requires a trusted HTTPS URL.',
      );
    return { key, from, origin: url.origin };
  }
  async send(email: string, token: string) {
    const { key, from, origin } = this.settings();
    // Fragment tokens stay out of HTTP access logs and Referer headers.
    const link = origin + '/admin/reset-password#token=' + token;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Reset your Harsha Portfolio admin password',
        text:
          'A password reset was requested for your admin account. Open this link to choose a new password (expires in 15 minutes):\n\n' +
          link +
          '\n\nIf you did not request this, ignore this email. Your password has not changed.',
      }),
    });
    if (!response.ok) throw new Error('Reset email delivery failed');
  }
}
