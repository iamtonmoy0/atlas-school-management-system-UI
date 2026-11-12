// Confirmed route paths are based on the public Express repository.
// Student / teacher route names and the login route should be verified against your local backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
export const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT || "/login";
export const DEMO_MODE = String(import.meta.env.VITE_DEMO_MODE ?? "true") === "true";

export const resources = {
  students: { label: "Students", endpoint: "/students", idKey: "_id", fields: ["name", "email", "class"] },
  teachers: { label: "Teachers", endpoint: "/teachers", idKey: "_id", fields: ["name", "email", "subject"] },
  classes: { label: "Classes", endpoint: "/class-levels", idKey: "_id", fields: ["name", "description"] },
  years: { label: "Academic years", endpoint: "/academic-years", idKey: "_id", fields: ["year", "startDate", "endDate"] },
  terms: { label: "Academic terms", endpoint: "/academic-term", idKey: "_id", fields: ["name", "startDate", "endDate"] },
  exams: { label: "Examinations", endpoint: "/exams", idKey: "_id", fields: ["name", "date", "class"] },
};