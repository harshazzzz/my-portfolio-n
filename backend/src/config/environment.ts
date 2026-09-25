export function validateEnvironment(env: Record<string, unknown>) {
  const errors: string[] = [];
  const secret = typeof env.JWT_SECRET === 'string' ? env.JWT_SECRET : '';
  if (secret.trim().length < 32)
    errors.push(
      'JWT_SECRET must contain at least 32 characters. Generate a random secret in backend/.env.',
    );
  const databaseUrl =
    typeof env.DATABASE_URL === 'string' ? env.DATABASE_URL : '';
  try {
    const url = new URL(databaseUrl);
    if (
      !['postgres:', 'postgresql:'].includes(url.protocol) ||
      !url.hostname ||
      url.pathname.length < 2
    )
      throw new Error();
  } catch {
    errors.push(
      'DATABASE_URL must be a PostgreSQL connection URL with a database name.',
    );
  }
  const rawExpiry = env.JWT_EXPIRES_IN ?? '1h';
  const value =
    typeof rawExpiry === 'string' || typeof rawExpiry === 'number'
      ? String(rawExpiry).trim()
      : '';
  const match = /^(\d+)(s|m|h|d)?$/.exec(value);
  const seconds = match
    ? Number(match[1]) *
      ({ s: 1, m: 60, h: 3600, d: 86400 }[match[2] ?? 's'] ?? 0)
    : 0;
  if (!Number.isSafeInteger(seconds) || seconds < 60 || seconds > 86400)
    errors.push(
      'JWT_EXPIRES_IN must be between 60 seconds and 1 day (e.g. 3600, 60m, 1h).',
    );
  const port = Number(env.PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    errors.push('PORT must be between 1 and 65535.');
  const origins = new Set<string>(['https://www.harshaz.com']);
  if (env.NODE_ENV !== 'production') origins.add('http://localhost:3000');
  const configuredOrigins = [env.FRONTEND_URL, env.CORS_ORIGINS]
    .filter((value): value is string => typeof value === 'string')
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);
  for (const value of configuredOrigins) {
    try {
      const url = new URL(value);
      if (
        !['http:', 'https:'].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        url.pathname !== '/' ||
        (env.NODE_ENV === 'production' && url.protocol !== 'https:')
      )
        throw new Error();
      origins.add(url.origin);
    } catch {
      errors.push(
        'FRONTEND_URL and CORS_ORIGINS must contain exact HTTP(S) origins, using HTTPS in production.',
      );
    }
  }
  if (errors.length)
    throw new Error('Backend configuration error:\n' + errors.join('\n'));
  return {
    ...env,
    JWT_SECRET: secret,
    DATABASE_URL: databaseUrl,
    JWT_EXPIRES_IN: value,
    JWT_EXPIRES_SECONDS: seconds,
    PORT: port,
    CORS_ORIGINS: [...origins],
  };
}
