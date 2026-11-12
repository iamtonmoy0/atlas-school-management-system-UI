# Atlas School Admin

Premium enterprise-style React + Vite admin dashboard for the Node/Express school management API.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

## Backend integration

Set `VITE_API_BASE_URL` to your Express API origin including `/api/v1`.
The Express app mounts route modules at `/api/v1`.

Confirmed from the public backend repository:
- `GET/POST /class-levels`, `GET/PATCH/DELETE /class-levels/:id`
- `GET/POST /academic-years`, `GET/PATCH/DELETE /academic-years/:id`
- `GET/POST /academic-term`, `GET/PATCH/DELETE /academic-term/:id`
- `GET/POST /exams`, `GET/PATCH /exams/:examId`

Student and teacher route paths and authentication payload/response need to be verified against your current local backend before production use. Adjust `src/config/api.js` and `src/lib/api.js` accordingly.

The API client sends `Authorization: Bearer <token>`. Login endpoint is configurable through `VITE_LOGIN_ENDPOINT`; map the token/user response in `src/lib/api.js` if your API uses another response shape.

## Demo mode

`VITE_DEMO_MODE=true` uses sample data so you can explore the UI without a running backend. Set it to `false` to use the API. Demo changes are local only.

## Notes

- This is a frontend project; it does not modify your backend.
- Attendance, staff, subjects, results and settings are currently navigation placeholders because the public backend route contract was not fully verified.
- Before production, verify route paths, request body fields, response envelopes, CORS origin, auth role claims and error response shape.
