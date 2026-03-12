# SECURITY HOTFIX - Critical Vulnerabilities Fixed

**Date:** 2026-03-12  
**Branch:** `hotfix/critical-security-fixes`  
**Severity:** P0 - CRITICAL

---

## Summary

Fixed 3 critical security vulnerabilities that exposed sensitive credentials and allowed unauthorized CORS access.

## Vulnerabilities Fixed

### 1. Hardcoded Cloudinary Credentials (P0)
**Location:** `src/config/cloudinary.js`

**What was wrong:**
- API credentials were hardcoded in the source code
- Exposed in the public repository
- Anyone with access to the repo could compromise the Cloudinary account

**How we fixed it:**
- Moved credentials from hardcoded values to environment variables
- Credentials now read from `process.env.CLOUDINARY_*`
- Actual secrets stored in `.env` (not committed to git)

**Commit:** `fix: move Cloudinary credentials to environment variables`

---

### 2. CORS Policy Completely Broken (P0)
**Location:** `src/app.js` (lines 22-45)

**What was wrong:**
```javascript
cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
         callback(null, true);  // ✅ Approved
       } else {
         callback(null, true);  // ❌ ALSO APPROVED! Logic error
       }
    }
})
```
- Both approved and rejected origins were calling `callback(null, true)`
- Allowed all origins, making whitelist useless
- Any malicious website could make requests to the API

**How we fixed it:**
- Changed rejection case to properly reject: `callback(new Error('...'))`
- Now only origins in `ALLOWED_ORIGINS` are accepted
- Unauthorized origins get CORS error

**Commit:** `fix: enforce CORS policy to reject unauthorized origins`

---

### 3. Weak JWT Secret (P0)
**Location:** `.env`

**What was wrong:**
- JWT_SECRET was weak, human-readable: `estoesunaclavesecretaquenadiesabrajamas`
- Weak secrets can be cracked with brute force
- Anyone who cracks it can forge valid JWT tokens

**How we fixed it:**
- Generated cryptographically secure secret using `crypto.randomBytes(32)`
- New secret: 256-bit random hex string
- Impossible to guess or brute force

**Command used:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Note:** Change was made only in `.env` (not committed), as `.env` is in `.gitignore`

---

## Testing Required

After this hotfix merges, verify:

1. **Cloudinary uploads still work:**
   ```bash
   npm test  # Or manual upload test
   ```

2. **CORS properly blocks unauthorized origins:**
   ```bash
   curl -H "Origin: https://unauthorized.com" \
     -v http://localhost:3005/health
   # Should return CORS error
   ```

3. **CORS still allows authorized origins:**
   ```bash
   curl -H "Origin: http://localhost:3000" \
     -v http://localhost:3005/health
   # Should return 200 OK
   ```

4. **JWT tokens still work** with new secret (auto-verified on next auth request)

---

## Next Steps

1. ✅ Merge this PR after verification
2. 🔄 Regenerate Cloudinary API key (optional but recommended)
3. 📋 Audit other hardcoded secrets
4. 📚 Document secret rotation procedures
5. 🔍 Run npm audit to check for vulnerable dependencies

---

## References

- CODE_AUDIT_REFERENCE.md - Section 1.1 (Security Checklist)
- CODE_AUDIT_EXAMPLES.md - Section 1 (Security Examples)
- TECHNICAL_IMPROVEMENTS.md - Problems 1, 2, 3
