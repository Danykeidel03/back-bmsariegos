# CHANGELOG

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y el proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Security hotfix for critical vulnerabilities (see SECURITY_HOTFIX_LOG.md)

### Changed
- Cloudinary credentials now loaded from environment variables
- CORS policy enforcement improved

### Fixed
- Hardcoded Cloudinary API credentials (P0 security issue)
- CORS allowing all origins instead of enforcing whitelist (P0 security issue)
- Weak JWT_SECRET vulnerability (P0 security issue)

---

## [1.0.0] - 2026-03-12

### Initial Release
- Express.js backend for BM Sariegos (handball team management)
- MongoDB integration
- JWT authentication
- Cloudinary image upload service
- Multiple endpoints for players, matches, teams, sponsors, etc.
- CORS and security headers configured
- Rate limiting implemented
- Request validation with express-validator

---

## Format Guidelines

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for security fixes and vulnerabilities

### Version Format
```
[X.Y.Z] - YYYY-MM-DD
```

Where:
- **X** = Major version (breaking changes)
- **Y** = Minor version (new features, backward compatible)
- **Z** = Patch version (bug fixes)

### Severity Levels (in commit messages)
- **P0**: Critical security issues, data loss
- **P1**: High priority bugs, auth issues, major performance problems
- **P2**: Medium priority issues, minor bugs, code quality
- **P3**: Low priority, typos, naming issues
- **P4**: Documentation, tests, nice-to-haves

---

## How to Contribute

When making changes:
1. Update this CHANGELOG.md with your changes
2. Use appropriate section (Added/Changed/Fixed/Security)
3. Include the GitHub issue number if available (#123)
4. Follow semantic versioning for releases

### Example Entry
```markdown
### Fixed
- Email validation now properly rejects invalid formats (#456)
- Fixed N+1 query issue in user list endpoint (#789)
```

---

**Last Updated:** 2026-03-12
