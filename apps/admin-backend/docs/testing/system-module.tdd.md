# System Module TDD Report

## 1. Source Plan
Phase 4 of `backend_implementation_plan.md` (Storage Telemetry - Synchronous).

## 2. User Journeys
1. As an admin, I want to fetch the system storage telemetry so that I know how much disk space is remaining for movie uploads.
2. As an unauthenticated user, I should be rejected with a 401 Unauthorized status when attempting to access storage telemetry.

## 3. Task Report
- **Implementation Summary:** Implemented `SystemModule` with a single endpoint `GET /api/v1/system/storage`. Used Node.js `fs/promises.statfs` to securely query the underlying OS file system for `bsize`, `blocks`, and `bfree` statistics to calculate total, used, and free space in bytes. Secured the endpoint behind the `AuthGuard('jwt')`.
- **Validation Command:** `npm run test:e2e`
- **Results:**
  - **RED (Before implementation):** `Failed Tests 2` (Routes returned 404 instead of 401/200).
  - **GREEN (After implementation):** `Test Files  3 passed (3) | Tests  7 passed (7)`

## 4. Test Specification

| # | What is guaranteed | Test file or command | Test type | Result | Evidence |
|---|--------------------|----------------------|-----------|--------|----------|
| 1 | Unauthenticated requests are rejected with 401 | `test/system.e2e-spec.ts` | E2E | PASS | `npm run test:e2e` |
| 2 | Authenticated requests return total, free, and used telemetry | `test/system.e2e-spec.ts` | E2E | PASS | `npm run test:e2e` |

## 5. Coverage and Known Gaps
- Tested happy paths and authentication guard logic.
- Real underlying filesystem `statfs` is tested natively in the CI/local environment since it simply measures the current working directory's disk partition.
