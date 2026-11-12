# Atlas School Admin

Atlas School Admin is a React dashboard for managing school operations. It includes a dashboard overview, searchable school directories, record forms, theme switching, and a responsive navigation layout. Use demo mode to explore the interface without a backend, or configure it to connect to a compatible API.

## Features

- Dashboard cards, enrollment chart, attendance summary, recent activity, and upcoming events
- Student, teacher, class, academic year, term, and examination directories
- Create, edit, delete, and search directory records
- Demo data for trying the interface without an API
- Redux Toolkit state for authentication, theme, login errors, and sidebar controls
- Responsive layout with light and dark themes

## Tech stack

- React 18 and Vite
- Redux Toolkit and React Redux
- React Router
- Axios
- Recharts
- Lucide React icons

## Requirements

- Node.js 18 or newer
- npm

## Getting started

```bash
npm install
```

Copy `.env.example` to `.env` and adjust the values if needed. On macOS or Linux:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (usually <http://localhost:5173>). With demo mode enabled, any email and password can sign in.

## Configuration

Vite reads these client-side settings from `.env`:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_DEMO_MODE` | `true` | Uses sample data and demo sign-in when `true`; calls the API when `false`. |
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | Base URL for the backend API. |
| `VITE_LOGIN_ENDPOINT` | `/login` | Login path, relative to the API base URL. |

Restart the Vite server after changing environment variables. Do not put secrets in `VITE_` variables; they are included in the browser bundle.

Example API configuration:

```dotenv
VITE_DEMO_MODE=false
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_LOGIN_ENDPOINT=/login
```

The API client sends a bearer token from `localStorage` and expects login responses to include `token` or `accessToken` (or a nested `data.token`). It accepts list responses that are arrays or contain `data`, `results`, `items`, or `docs`. Update `src/lib/api.js` if your backend uses a different response format.

Directory endpoints are configured in `src/config/api.js`:

| Directory | Endpoint |
| --- | --- |
| Students | `/students` |
| Teachers | `/teachers` |
| Classes | `/class-levels` |
| Academic years | `/academic-years` |
| Terms | `/academic-term` |
| Examinations | `/exams` |

The client uses `GET` to load lists, `POST` to create, `PATCH` to update, and `DELETE` to remove records. Confirm that these paths, methods, fields, CORS settings, and authentication behavior match your backend before connecting a production service. Attendance, staff, subjects, results, and settings are navigation placeholders.

In demo mode, directory changes are held in the current page state and are not sent to a backend.

## Project structure

```text
src/
  components/   Shared layout and interface components
  config/       API settings and directory definitions
  data/         Demo records and dashboard display data
  lib/          Axios client and API helpers
  pages/        Dashboard and directory pages
  App.jsx       Authentication gate and route layout
  main.jsx      React and Redux application entry point
  store.js      Redux Toolkit store and app state
  styles.css    Application styles and responsive rules
```

## Available scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## License

This project is available under the MIT License. See [LICENSE](LICENSE).
