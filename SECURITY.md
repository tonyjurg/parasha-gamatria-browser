# Security Policy

## Supported Versions

Security fixes are maintained for the latest `main` branch and the current
[GitHub Pages deployment](https://tonyjurg.github.io/parasha-gamatria-browser/).
Older commits and personal copies are not maintained separately.

## Reporting a Vulnerability

Use **Report a vulnerability** on the repository's
[Security Advisories page](https://github.com/tonyjurg/parasha-gamatria-browser/security/advisories)
to send a confidential report. Private vulnerability reporting is enabled.
Do not disclose an unpatched vulnerability or credentials in a public issue.

Include affected files or URLs, reproduction steps, the browser or Python
version, and the potential impact. Keep testing non-destructive and limited
to systems you own or have permission to test. Acknowledgement and fixes are
handled on a best-effort basis; no response-time guarantee is offered.

## Security Boundaries

The deployed browser is static, has no authentication or backend, and does
not require access to private source repositories. Text is rendered as text
rather than HTML. Numeric searches accept decimal nonnegative safe integers.
SHEBANQ links use a fixed HTTPS destination and `noopener noreferrer`.

Both HTML pages carry a same-origin Content Security Policy. A meta policy
cannot enforce `frame-ancestors`, so it does not provide complete protection
against embedding or clickjacking. The `'self'` policy trusts the hosting
origin, not just this repository's project path. CSP is defense in depth,
not a substitute for safe rendering or secure repository access.

Exported data checksums are validated by tests, not at browser fetch time.
Data checksums and dependency hashes detect unexpected changes; they do not
establish that a dependency or a compromised repository is trustworthy.
