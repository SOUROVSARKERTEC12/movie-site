# CineBlack Ops - Admin API Endpoints (Version 1)

As a senior developer analyzing the current state of the Admin Panel (based on the routing structure and data models in `/data`), I have mapped out the required RESTful API endpoints necessary to transition this frontend from mock data to a production-ready backend. 

*Double-checked against V1 simplifications (focusing on strict necessities while preserving the existing pages).*

---

## 1. Authentication & Admin Profile (`/settings`)
Endpoints to handle admin sessions and the simplified profile management.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate admin and return JWT/Session. |
| `POST` | `/api/v1/auth/logout` | Terminate current session. |
| `GET`  | `/api/v1/admin/profile` | Retrieve the authenticated admin's profile data. |
| `PUT`  | `/api/v1/admin/profile` | Update admin profile (Name, Email, Password). |

---

## 2. Storage & Disk Management (`/settings`, Dashboard)
Endpoints to manage local disk paths and retrieve telemetry for the Dashboard.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/v1/storage/paths` | List all configured disk paths and their max limits. |
| `POST` | `/api/v1/storage/paths` | Add a new local disk path with a quota. |
| `PUT`  | `/api/v1/storage/paths/:id` | Update an existing disk path (change limit or directory). |
| `DELETE`| `/api/v1/storage/paths/:id` | Remove a disk path from the configuration. |
| `GET`  | `/api/v1/storage/metrics` | Retrieve real-time used/remaining GB across all paths for the dashboard. |

---

## 3. Catalog Management (`/movies`)
Endpoints to manage the core video assets.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/v1/movies` | List movies (Supports `?page=`, `?limit=`, `?search=`, `?category=`). |
| `GET`  | `/api/v1/movies/:id` | Get full details for a specific movie. |
| `POST` | `/api/v1/movies` | Create a new movie entry (metadata only). |
| `PUT`  | `/api/v1/movies/:id` | Update movie metadata. |
| `DELETE`| `/api/v1/movies/:id`| Delete a movie and purge its associated files. |
| `POST` | `/api/v1/movies/:id/media` | Upload media files (Poster, Backdrop, or Video chunking). |

---

## 4. User Management (`/users`)
Endpoints to manage viewer accounts and subscriptions.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/v1/users` | List registered users (Supports `?page=`, `?search=`, `?status=`). |
| `GET`  | `/api/v1/users/:id` | Get details for a specific user. |
| `PUT`  | `/api/v1/users/:id` | Update user status (e.g., Suspend, Activate, Grant VIP). |
| `DELETE`| `/api/v1/users/:id`| Permanently delete a user account. |

---

## 5. Categories & Rails (`/categories`)
Endpoints to manage how content is grouped and displayed to end-users.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/v1/categories` | List all categories and custom rails. |
| `POST` | `/api/v1/categories` | Create a new category. |
| `PUT`  | `/api/v1/categories/:id` | Update category details (name, slug). |
| `DELETE`| `/api/v1/categories/:id`| Delete a category. |

---

## 6. Telemetry & Analytics (Dashboard & `/devices`)
High-level analytical endpoints.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/v1/analytics/overview` | Dashboard summary (Total Users, Active Sessions, Total Watch Time). |
| `GET`  | `/api/v1/analytics/devices` | Aggregated stats for browsers, OS, and device types. |

---

## 7. Logs & Auditing (`/logs`, `/user-activity`)
Endpoints for tracking system changes and user behavior.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/v1/logs/user-activity` | Paginated stream of user events (Logins, Playback Starts, etc.). |
| `GET`  | `/api/v1/logs/user-activity/stream` | SSE or WebSocket feed for real-time Live Telemetry. |
| `GET`  | `/api/v1/logs/user-activity/export` | Download a bulk JSON/CSV export of user activities. |
| `POST` | `/api/v1/logs/user-activity/reset` | Reset telemetry events to default system baseline (Admin only). |
| `GET`  | `/api/v1/logs/audit` | Paginated system audit logs (Admin actions, settings changes). |
| `GET`  | `/api/v1/logs/audit/export` | Download a bulk JSON/CSV export of audit logs. |
| `POST` | `/api/v1/logs/audit/reset` | Reset administrative audit trail back to baseline (Superadmin only). |

---

### **Summary of Analysis**
*   **Total Endpoints Required:** ~31 Core Endpoints
*   **Implementation Note:** To fully support the V1 dashboard, `/api/v1/storage/metrics` should be highly optimized, potentially utilizing a lightweight background worker (like a cron job) on the backend to periodically `statfs` the disks rather than calculating the size synchronously on every HTTP request.
