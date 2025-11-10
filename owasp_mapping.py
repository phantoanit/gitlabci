owasp_map = {
    # === Custom rules ===
    "js-dom-xss-append": "A03: Injection",
    "js-dom-xss-html": "A03: Injection",
    "js-dom-xss-replacewith": "A03: Injection",
    "js-dom-xss-prepend": "A03: Injection",
    "php-path-traversal-files": "A01: Broken Access Control",
    "php-path-traversal-get": "A01: Broken Access Control",
    "php-hardcoded-key": "A02: Cryptographic Failures",
    "jwt-hardcoded-secret": "A02: Cryptographic Failures",
    "php-hardcoded-password": "A02: Cryptographic Failures",
    "php-cookie-no-flags": "A05: Security Misconfiguration",
    "php-curl-insecure": "A05: Security Misconfiguration",
    "php-curl-insecure-host": "A05: Security Misconfiguration",
    "js-localstorage-sensitive": "A02: Cryptographic Failures",
    "js-sessionstorage-sensitive": "A02: Cryptographic Failures",
    "js-evil-regex": "A03: Injection",
    "js-prototype-pollution": "A04: Insecure Design",
    "html-inline-event-xss": "A03: Injection",
    "html-missing-hsts": "A05: Security Misconfiguration",

    # === Một số rule free Semgrep pack ===
    "javascript.lang.security.detect-eval-with-expression.detect-eval-with-expression":
        "A08: Software and Data Integrity Failures",
    "javascript.browser.security.detect-dom-xss.detect-dom-xss":
        "A03: Injection",
    "php.lang.security.detect-sql-injection.detect-sql-injection":
        "A03: Injection",
    "php.lang.security.insecure-crypto.insecure-crypto":
        "A02: Cryptographic Failures",
    "generic.secrets.hardcoded-credentials.hardcoded-credentials":
        "A02: Cryptographic Failures",
    "python.lang.security.insecure-hashlib.insecure-hashlib":
        "A02: Cryptographic Failures",
    "python.lang.security.insecure-deserialization.insecure-deserialization":
        "A08: Software and Data Integrity Failures",
    "java.lang.security.ssrf-vulnerability.ssrf-vulnerability":
        "A10: SSRF",
}
