import { LayoutDashboard, GraduationCap, Users, BriefcaseBusiness, BookOpen, CalendarDays, ClipboardCheck, FileText, Award, School, CalendarCheck } from "lucide-react";
import { demoStudents, demoTeachers, demoClasses, demoYears, demoTerms, demoExams } from "./demo";

export const navGroups = [
  { title: "OVERVIEW", items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }] },
  { title: "SCHOOL", items: [
    { label: "Students", path: "/students", icon: GraduationCap },
    { label: "Teachers", path: "/teachers", icon: Users },
    { label: "Staff", path: "/staff", icon: BriefcaseBusiness },
    { label: "Classes", path: "/classes", icon: School },
    { label: "Subjects", path: "/subjects", icon: BookOpen },
  ]},
  { title: "ACADEMICS", items: [
    { label: "Academic years", path: "/academic-years", icon: CalendarDays },
    { label: "Terms", path: "/terms", icon: CalendarCheck },
    { label: "Attendance", path: "/attendance", icon: ClipboardCheck },
    { label: "Examinations", path: "/exams", icon: FileText },
    { label: "Results", path: "/results", icon: Award },
  ]},
];
export const chartData = [
  { month: "Jan", students: 320, attendance: 88 }, { month: "Feb", students: 350, attendance: 91 },
  { month: "Mar", students: 338, attendance: 86 }, { month: "Apr", students: 390, attendance: 93 },
  { month: "May", students: 410, attendance: 90 }, { month: "Jun", students: 425, attendance: 95 },
  { month: "Jul", students: 448, attendance: 92 }, { month: "Aug", students: 470, attendance: 94 },
  { month: "Sep", students: 488, attendance: 91 }, { month: "Oct", students: 510, attendance: 96 },
  { month: "Nov", students: 532, attendance: 94 }, { month: "Dec", students: 560, attendance: 97 },
];
export const activities = [
  { title: "New student enrollment", detail: "Olivia Rhye · Grade 8", time: "12 min ago", icon: GraduationCap, tone: "violet" },
  { title: "Attendance submitted", detail: "Mr. Cameron · Grade 7A", time: "38 min ago", icon: ClipboardCheck, tone: "green" },
  { title: "Exam results published", detail: "Midterm assessment · Grade 9", time: "1 hour ago", icon: Award, tone: "amber" },
  { title: "Teacher profile updated", detail: "Esther Howard · Mathematics", time: "2 hours ago", icon: Users, tone: "blue" },
];
export const demoMap = { students: demoStudents, teachers: demoTeachers, classes: demoClasses, years: demoYears, terms: demoTerms, exams: demoExams };
