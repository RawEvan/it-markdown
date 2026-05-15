# Security policy

## Supported versions

Security fixes are applied to the **latest minor** release line on the default branch (`main`). Older tags may not receive backports unless agreed in the issue tracker.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for undisclosed security problems.

- Email or DM the repository maintainers if contact details are listed on the GitHub org or profile, **or**
- Open a **private security advisory** via GitHub (Repository → Security → Advisories) if enabled for this repository.

Include: affected version, reproduction steps, and impact (e.g. XSS via rendered HTML, unsafe script execution).

## Design notes

The default HTML renderer is intended **not** to execute user-supplied JavaScript from document sources (`safeMode: true` by default). If you discover a path where untrusted Markdown leads to executable script in output without opting into unsafe modes, treat that as a security issue.
