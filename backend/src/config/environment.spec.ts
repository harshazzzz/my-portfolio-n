import { validateEnvironment } from './environment.js';
const base = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  JWT_SECRET: 'a'.repeat(48),
};
describe('backend environment validation', () => {
  it('restricts production CORS to exact HTTPS origins', () => {
    const result = validateEnvironment({
      ...base,
      NODE_ENV: 'production',
      FRONTEND_URL: 'https://harsha-portfolio.vercel.app',
    });
    expect(result.CORS_ORIGINS).toContain('https://www.harshaz.com');
    expect(result.CORS_ORIGINS).toContain(
      'https://harsha-portfolio.vercel.app',
    );
    expect(result.CORS_ORIGINS).not.toContain('http://localhost:3000');
    expect(validateEnvironment(base).CORS_ORIGINS).toContain(
      'http://localhost:3000',
    );
    for (const origin of [
      '*',
      'https://example.com/path',
      'https://user:password@example.com',
      'http://localhost:3000',
    ]) {
      expect(() =>
        validateEnvironment({
          ...base,
          NODE_ENV: 'production',
          CORS_ORIGINS: origin,
        }),
      ).toThrow('exact HTTP(S) origins');
    }
  });
  it('accepts a secret and parses configurable token lifetimes', () => {
    expect(
      validateEnvironment({ ...base, JWT_EXPIRES_IN: '30m' })
        .JWT_EXPIRES_SECONDS,
    ).toBe(1800);
    expect(
      validateEnvironment({ ...base, JWT_EXPIRES_IN: '7200' })
        .JWT_EXPIRES_SECONDS,
    ).toBe(7200);
    expect(validateEnvironment(base).PORT).toBe(3001);
  });
  it('rejects missing or short secrets without exposing them', () => {
    expect(() =>
      validateEnvironment({ ...base, JWT_SECRET: 'secret' }),
    ).toThrow('at least 32');
    expect(() =>
      validateEnvironment({ ...base, JWT_SECRET: undefined }),
    ).toThrow('at least 32');
  });
  it('rejects invalid database URLs, expiry and ports', () => {
    expect(() =>
      validateEnvironment({ ...base, DATABASE_URL: 'https://example.com' }),
    ).toThrow('PostgreSQL');
    for (const value of ['0', '7d', 'abc', '1.5h'])
      expect(() =>
        validateEnvironment({ ...base, JWT_EXPIRES_IN: value }),
      ).toThrow('JWT_EXPIRES_IN');
    expect(() => validateEnvironment({ ...base, PORT: 'bad' })).toThrow('PORT');
  });
});
