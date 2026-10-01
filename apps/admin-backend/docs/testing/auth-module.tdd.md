# Authentication Module TDD Report

## 1. Source Plan
Phase 3 of `backend_implementation_plan.md` (Authentication & Admin Profile).

## 2. User Journeys
1. As an admin, I want to log in with my email and password so that I receive a JWT token.
2. As an authenticated admin, I want to fetch my profile using my JWT token so that I can see my details.
3. As an admin, I want to be rejected with a 400 Bad Request if I provide an invalid email format.

## 3. Task Report
- **Implementation Summary:** Implemented `AuthModule` with `@nestjs/jwt`, `@nestjs/passport`, and Zod validation. The `/api/v1/auth/login` endpoint returns a signed JWT. The `/api/v1/admin/profile` endpoint uses a Passport JWT strategy to extract the user from the Bearer token and returns their profile without the password hash.
- **Validation Command:** `npm run test:e2e`
- **Results:**
  - **RED (Before implementation):** `Failed Tests 4` (Routes returned 404 instead of 401/400/200).
  - **GREEN (After implementation):** `Test Files  2 passed (2) | Tests  5 passed (5)`

## 4. Test Specification

| # | What is guaranteed | Test file or command | Test type | Result | Evidence |
|---|--------------------|----------------------|-----------|--------|----------|
| 1 | Invalid credentials rejected with 401 | `test/auth.e2e-spec.ts` | E2E | PASS | `npm run test:e2e` |
| 2 | Valid credentials return a JWT token | `test/auth.e2e-spec.ts` | E2E | PASS | `npm run test:e2e` |
| 3 | Invalid email payload rejected with 400 | `test/auth.e2e-spec.ts` | E2E | PASS | `npm run test:e2e` |
| 4 | Fetching profile without JWT rejected with 401 | `test/auth.e2e-spec.ts` | E2E | PASS | `npm run test:e2e` |

## 5. Coverage and Known Gaps
We mocked a database return within `AuthService` when testing the "admin@cineblack.com" seeded user since our actual local SQLite database is currently empty. Next steps involve building full Database seeders so the tests can pull from real DB rows rather than hardcoded mock blocks.
