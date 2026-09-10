# Security Policy

## Supported Versions

Orbit Sense is a software prototype / demo. Only the latest commit on `main` receives fixes.

## Reporting a Vulnerability

Please open a private GitHub security advisory (Security → Report a vulnerability) rather
than a public issue. Reports are reviewed on a best-effort basis.

## Known Notes

- `src/convex/auth/emailOtp.ts` contains a Freebuff platform-provisioned email OTP API key
  (see README "Before publishing publicly"). Replace with your own email provider before
  running outside the Freebuff environment.
- This is a demo application — do not use it to handle real astronaut or mission data.
