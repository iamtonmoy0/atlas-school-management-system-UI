import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, Users, BriefcaseBusiness, BookOpen, CalendarDays,
  ClipboardCheck, FileText, Award, Settings, Search, Bell, Sun, Moon, Menu, X,
  ChevronDown, ChevronRight, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Download, SlidersHorizontal, ArrowUpDown, Clock3, CheckCircle2, AlertCircle,
  LogOut, Sparkles, PanelLeftClose, School, TrendingUp, Mail, LockKeyhole,
  CalendarCheck, BookMarked, UserRoundCheck, CircleHelp, Command, Filter
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { resources, DEMO_MODE } from "./config/api";
import { api, login, logout, getList, createRecord, updateRecord, deleteRecord } from "./lib/api";
import { demoStudents, demoTeachers, demoClasses, demoYears, demoTerms, demoExams } from "./data/demo";

const navGroups = [
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
const chartData = [
  { month: "Jan", students: 320, attendance: 88 }, { month: "Feb", students: 350, attendance: 91 },
  { month: "Mar", students: 338, attendance: 86 }, { month: "Apr", students: 390, attendance: 93 },
  { month: "May", students: 410, attendance: 90 }, { month: "Jun", students: 425, attendance: 95 },
  { month: "Jul", students: 448, attendance: 92 }, { month: "Aug", students: 470, attendance: 94 },
  { month: "Sep", students: 488, attendance: 91 }, { month: "Oct", students: 510, attendance: 96 },
  { month: "Nov", students: 532, attendance: 94 }, { month: "Dec", students: 560, attendance: 97 },
];
const activities = [
  { title: "New student enrollment", detail: "Olivia Rhye · Grade 8", time: "12 min ago", icon: GraduationCap, tone: "violet" },
  { title: "Attendance submitted", detail: "Mr. Cameron · Grade 7A", time: "38 min ago", icon: ClipboardCheck, tone: "green" },
  { title: "Exam results published", detail: "Midterm assessment · Grade 9", time: "1 hour ago", icon: Award, tone: "amber" },
  { title: "Teacher profile updated", detail: "Esther Howard · Mathematics", time: "2 hours ago", icon: Users, tone: "blue" },
];
const demoMap = { students: demoStudents, teachers: demoTeachers, classes: demoClasses, years: demoYears, terms: demoTerms, exams: demoExams };
const routeMap = { "/students": "students", "/teachers": "teachers", "/classes": "classes", "/academic-years": "years", "/terms": "terms", "/exams": "exams" };

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("atlas_theme") || "light");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("atlas_user")); } catch { return null; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("atlas_theme", theme);
  }, [theme]);
  useEffect(() => {
    const handler = () => { setUser(null); navigate("/login"); };
    window.addEventListener("atlas:unauthorized", handler);
    return () => window.removeEventListener("atlas:unauthorized", handler);
  }, [navigate]);

  const signIn = async (email, password) => {
    setLoginError("");
    try { const account = await login(email, password); setUser(account); navigate("/"); }
    catch (e) { setLoginError(e.response?.data?.message || e.message || "Unable to sign in"); }
  };
  const signOut = () => { logout(); setUser(null); navigate("/login"); };
  if (!user && location.pathname !== "/login") return <Login onLogin={signIn} error={loginError} />;
  if (!user) return <Login onLogin={signIn} error={loginError} />;
  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onCollapse={() => setCollapsed(!collapsed)} />
      <div className="main-shell">
        <Header theme={theme} setTheme={setTheme} user={user} onMenu={() => setMobileOpen(true)} onLogout={signOut} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<ResourcePage resource="students" />} />
            <Route path="/teachers" element={<ResourcePage resource="teachers" />} />
            <Route path="/classes" element={<ResourcePage resource="classes" />} />
            <Route path="/academic-years" element={<ResourcePage resource="years" />} />
            <Route path="/terms" element={<ResourcePage resource="terms" />} />
            <Route path="/exams" element={<ResourcePage resource="exams" />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
          <footer className="footer"><span>© 2026 Atlas School Management</span><span>Made for better learning <span className="footer-heart">✦</span></span></footer>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ collapsed, mobileOpen, onClose, onCollapse }) {
  return <>
    {mobileOpen && <div className="mobile-backdrop" onClick={onClose} />}
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "mobile-visible" : ""}`}>
      <div className="brand-row">
        <div className="brand-mark"><School size={21} strokeWidth={2.4}/></div>
        {!collapsed && <div className="brand-copy"><strong>atlas<span>.</span></strong><small>EDUCATION MANAGEMENT</small></div>}
        <button className="icon-button sidebar-close" onClick={onClose}><X size={18}/></button>
      </div>
      <div className="workspace-switch">
        <div className="school-avatar">N</div>
        {!collapsed && <div className="workspace-copy"><strong>Northwood Academy</strong><small>Administrator workspace</small></div>}
        {!collapsed && <ChevronDown size={15} className="muted-icon"/>}
      </div>
      <nav className="side-nav">
        {navGroups.map(group => <div className="nav-group" key={group.title}>
          {!collapsed && <div className="nav-label">{group.title}</div>}
          {group.items.map(item => <NavLink key={item.path} to={item.path} end={item.path === "/"} onClick={onClose} title={collapsed ? item.label : undefined} className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
            <item.icon size={18}/>{!collapsed && <span>{item.label}</span>}{item.label === "Attendance" && !collapsed && <span className="nav-count">!</span>}
          </NavLink>)}
        </div>)}
      </nav>
      <div className="sidebar-bottom">
        <NavLink to="/settings" className="nav-item"><Settings size={18}/>{!collapsed && <span>Settings</span>}</NavLink>
        <div className="help-card">
          {!collapsed && <><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Visit our help center for guides and support.</p><button onClick={() => alert("Connect your help-center URL here.")}>Open help center <ArrowUpRight size={13}/></button></>}
          {collapsed && <CircleHelp size={18}/>}
        </div>
        <button className="collapse-button" onClick={onCollapse}><PanelLeftClose size={17}/>{!collapsed && <span>Collapse sidebar</span>}</button>
      </div>
    </aside>
  </>;
}

function Header({ theme, setTheme, user, onMenu, onLogout }) {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  return <header className="topbar">
    <div className="topbar-left"><button className="icon-button mobile-menu" onClick={onMenu}><Menu size={19}/></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>Overview</strong></div></div>
    <div className="topbar-right">
      <div className="global-search"><Search size={16}/><input placeholder="Search anything..." value={search} onChange={e=>setSearch(e.target.value)}/><kbd>⌘ K</kbd></div>
      <button className="icon-button theme-toggle" title="Toggle theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}</button>
      <button className="icon-button notification-button" title="Notifications"><Bell size={18}/><i/></button>
      <div className="profile-wrap">
        <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}><div className="profile-avatar">AM</div><div className="profile-meta"><strong>{user.name || "Administrator"}</strong><small>{user.role || "Admin"}</small></div><ChevronDown size={14}/></button>
        {profileOpen && <div className="profile-menu"><div className="profile-menu-user"><strong>{user.name}</strong><small>{user.email}</small></div><button onClick={onLogout}><LogOut size={15}/> Sign out</button></div>}
      </div>
    </div>
  </header>;
}

function Dashboard() {
  const [stats, setStats] = useState({ students: 1248, teachers: 84, classes: 32, attendance: 94.6 });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (DEMO_MODE) return;
    let alive = true;
    const load = async () => {
      setLoading(true);
      try {
        const [students, teachers, classes] = await Promise.allSettled([
          getList("/students"), getList("/teachers"), getList("/class-levels")
        ]);
        if (!alive) return;
        setStats(s => ({
          ...s,
          students: students.status === "fulfilled" ? students.value.length : s.students,
          teachers: teachers.status === "fulfilled" ? teachers.value.length : s.teachers,
          classes: classes.status === "fulfilled" ? classes.value.length : s.classes
        }));
      } finally { if (alive) setLoading(false); }
    };
    load(); return () => { alive = false; };
  }, []);
  const cards = [
    { label: "Total students", value: stats.students.toLocaleString(), change: "+12.8%", trend: "up", icon: GraduationCap, color: "purple", note: "vs. last academic year" },
    { label: "Teaching staff", value: stats.teachers, change: "+4.3%", trend: "up", icon: Users, color: "blue", note: "vs. last academic year" },
    { label: "Active classes", value: stats.classes, change: "+2 new", trend: "up", icon: BookOpen, color: "orange", note: "this semester" },
    { label: "Avg. attendance", value: `${stats.attendance}%`, change: "-1.2%", trend: "down", icon: UserRoundCheck, color: "green", note: "vs. previous month" },
  ];
  return <div className="page-stack">
    <div className="page-heading">
      <div><div className="eyebrow">THURSDAY, NOVEMBER 12, 2026 <span className="eyebrow-dot"/></div><h1>Good morning, Alex <span className="wave">✦</span></h1><p>Here’s what’s happening across your school today.</p></div>
      <div className="heading-actions"><button className="button button-secondary"><Download size={16}/> Export report</button><button className="button button-primary" onClick={() => window.location.href="/students"}><Plus size={17}/> Add student</button></div>
    </div>
    <div className="welcome-strip"><div className="welcome-icon"><Sparkles size={19}/></div><div><strong>Your school is looking great!</strong><span>Attendance is up 3.2% this week. Keep the momentum going.</span></div><button onClick={() => window.location.href="/attendance"}>View attendance <ArrowUpRight size={14}/></button></div>
    <section className="stat-grid">
      {cards.map((c,i)=><div className="stat-card" key={c.label}><div className="stat-top"><span>{c.label}</span><div className={`stat-icon ${c.color}`}><c.icon size={19}/></div></div><div className="stat-value">{c.value}</div><div className="stat-bottom"><span className={`trend ${c.trend}`}>{c.trend==="up"?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>} {c.change}</span><span>{c.note}</span></div></div>)}
    </section>
    <section className="dashboard-grid">
      <div className="panel enrollment-panel">
        <div className="panel-heading"><div><h2>Student overview</h2><p>Enrollment growth throughout the year</p></div><button className="select-button">This year <ChevronDown size={14}/></button></div>
        <div className="chart-legend"><span><i className="legend-dot purple-dot"/> Total students</span><span><i className="legend-dot pale-dot"/> Enrollment trend</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:12,right:8,left:-22,bottom:0}}><defs><linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7666e8" stopOpacity={0.2}/><stop offset="100%" stopColor="#7666e8" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="var(--line)" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:11}} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:11}}/><Tooltip contentStyle={{background:"var(--surface)",border:"1px solid var(--line)",borderRadius:12,color:"var(--text)"}}/><Area type="monotone" dataKey="students" stroke="#7869e8" strokeWidth={2.5} fill="url(#studentsFill)" activeDot={{r:5}}/></AreaChart></ResponsiveContainer></div>
      </div>
      <div className="panel attendance-panel">
        <div className="panel-heading"><div><h2>Attendance rate</h2><p>Daily school attendance</p></div><button className="more-button"><MoreHorizontal size={19}/></button></div>
        <div className="attendance-score"><div><strong>94.6<span>%</span></strong><small><span className="positive-mini">+3.2%</span> vs last week</small></div><div className="attendance-ring"><div className="ring-inner"><strong>94.6%</strong><small>Present</small></div></div></div>
        <div className="attendance-breakdown"><div><span><i className="legend-dot purple-dot"/> Present</span><strong>1,181</strong></div><div><span><i className="legend-dot amber-dot"/> Absent</span><strong>42</strong></div><div><span><i className="legend-dot gray-dot"/> Late</span><strong>25</strong></div></div>
        <button className="text-link" onClick={() => window.location.href="/attendance"}>View attendance report <ArrowUpRight size={14}/></button>
      </div>
    </section>
    <section className="bottom-grid">
      <div className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates from your school</p></div><button className="text-link">View all <ArrowUpRight size={14}/></button></div>
        <div className="activity-list">{activities.map((a,i)=><div className="activity-item" key={i}><div className={`activity-icon ${a.tone}`}><a.icon size={17}/></div><div className="activity-copy"><strong>{a.title}</strong><span>{a.detail}</span></div><time>{a.time}</time></div>)}</div>
      </div>
      <div className="panel calendar-panel"><div className="panel-heading"><div><h2>Upcoming events</h2><p>Mark your calendar</p></div><button className="more-button"><MoreHorizontal size={19}/></button></div>
        <div className="event-list"><div className="event-item"><div className="event-date"><strong>18</strong><span>NOV</span></div><div className="event-info"><strong>Midterm assessment</strong><span>All grades · 9:00 AM</span></div><span className="event-tag purple-tag">Exam</span></div><div className="event-item"><div className="event-date"><strong>21</strong><span>NOV</span></div><div className="event-info"><strong>Parent-teacher meeting</strong><span>Main auditorium · 10:30 AM</span></div><span className="event-tag blue-tag">Meeting</span></div><div className="event-item"><div className="event-date"><strong>25</strong><span>NOV</span></div><div className="event-info"><strong>Annual sports day</strong><span>School ground · 8:00 AM</span></div><span className="event-tag green-tag">Event</span></div></div>
      </div>
    </section>
    {DEMO_MODE && <div className="demo-notice"><AlertCircle size={15}/> Demo mode is enabled. Dashboard metrics use sample data until you configure your API connection.</div>}
  </div>;
}

function ResourcePage({ resource }) {
  const config = resources[resource];
  const [rows, setRows] = useState(DEMO_MODE ? (demoMap[resource] || []) : []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    if (DEMO_MODE) { setRows(demoMap[resource] || []); return; }
    let active = true;
    setBusy(true); setError("");
    getList(config.endpoint).then(data => { if (active) setRows(data); })
      .catch(e => { if (active) setError(e.response?.data?.message || `Could not load ${config.label.toLowerCase()}. Check the API route and authorization.`); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [resource, refresh]);
  const filtered = useMemo(() => rows.filter(r => Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const openCreate = () => { setEditing(null); setForm({}); setModal(true); };
  const openEdit = row => { setEditing(row); setForm(Object.fromEntries(config.fields.map(f => [f, row[f] || ""]))); setModal(true); };
  const save = async e => {
    e.preventDefault();
    try {
      if (DEMO_MODE) {
        if (editing) setRows(old => old.map(r => r._id === editing._id ? {...r,...form} : r));
        else setRows(old => [{_id:`NEW-${Date.now()}`,...form,status:"Active"},...old]);
      } else if (editing) await updateRecord(config.endpoint, editing._id, form);
      else await createRecord(config.endpoint, form);
      if (!DEMO_MODE) setRefresh(v => v+1);
      setModal(false);
    } catch (e) { setError(e.response?.data?.message || "Save failed. Check the payload expected by your API."); }
  };
  const remove = async row => {
    if (!window.confirm(`Delete this ${config.label.toLowerCase().slice(0,-1)}?`)) return;
    try {
      if (DEMO_MODE) setRows(old => old.filter(r => r._id !== row._id));
      else await deleteRecord(config.endpoint, row._id);
      if (!DEMO_MODE) setRefresh(v => v+1);
    } catch (e) { setError(e.response?.data?.message || "Delete failed."); }
  };
  const columns = config.fields;
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">SCHOOL DIRECTORY</div><h1>{config.label}</h1><p>Manage and organize your school's {config.label.toLowerCase()}.</p></div><button className="button button-primary" onClick={openCreate}><Plus size={17}/> Add {config.label.slice(0,-1).toLowerCase()}</button></div>
    <div className="resource-summary"><div><span className="summary-icon"><Users size={18}/></span><div><small>Total {config.label.toLowerCase()}</small><strong>{rows.length}</strong></div></div><div><span className="summary-icon green-summary"><CheckCircle2 size={18}/></span><div><small>Showing records</small><strong>{filtered.length}</strong></div></div><div className="resource-summary-note"><span className="live-dot"/> {DEMO_MODE ? "Demo data" : "Connected to API"}</div></div>
    <div className="panel table-panel">
      <div className="table-toolbar"><div className="table-search"><Search size={16}/><input placeholder={`Search ${config.label.toLowerCase()}...`} value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="toolbar-actions"><button className="button button-secondary button-small"><SlidersHorizontal size={15}/> Filter</button><button className="button button-secondary button-small"><Download size={15}/> Export</button></div></div>
      {error && <div className="inline-error"><AlertCircle size={16}/>{error}<button onClick={()=>setError("")}>Dismiss</button></div>}
      <div className="table-scroll"><table><thead><tr><th><input type="checkbox" aria-label="Select all"/></th><th>RECORD</th>{columns.slice(1).map(c=><th key={c}>{c.replace(/([A-Z])/g," $1").toUpperCase()}</th>)}<th>STATUS</th><th/></tr></thead><tbody>
        {busy ? <tr><td colSpan={columns.length+3} className="empty-cell">Loading records…</td></tr> : filtered.length ? filtered.map((row,i)=><tr key={row._id || i}><td><input type="checkbox" aria-label={`Select row ${i+1}`}/></td><td><div className="record-cell"><div className={`record-avatar ${["lavender","peach","mint","blue","pink"][i%5]}`}>{(row.name || row[columns[0]] || row._id || "R").toString().split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}</div><div><strong>{row.name || row[columns[0]] || "Untitled record"}</strong><small>{row.email || row._id}</small></div></div></td>{columns.slice(1).map(c=><td key={c}>{formatValue(row[c])}</td>)}<td><span className={`status-pill ${(row.status || "Active").toLowerCase()}`}>{row.status || "Active"}</span></td><td><div className="row-actions"><button title="Edit" onClick={()=>openEdit(row)}><Settings size={15}/></button><button title="Delete" onClick={()=>remove(row)}><MoreHorizontal size={17}/></button></div></td></tr>) : <tr><td colSpan={columns.length+3} className="empty-cell"><div className="empty-state"><Search size={22}/><strong>No records found</strong><span>Try a different search or add a new record.</span></div></td></tr>}
      </tbody></table></div>
      <div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{rows.length}</strong> records</span><div><button disabled>Previous</button><button className="page-number">1</button><button disabled>Next</button></div></div>
    </div>
    {DEMO_MODE && <div className="demo-notice"><AlertCircle size={15}/> Demo mode: changes stay in this browser session and are not sent to your backend.</div>}
    {modal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}><form className="record-modal" onSubmit={save}><div className="modal-heading"><div><h2>{editing ? "Edit record" : `Add ${config.label.slice(0,-1).toLowerCase()}`}</h2><p>Enter the information below to continue.</p></div><button type="button" className="icon-button" onClick={()=>setModal(false)}><X size={18}/></button></div>{config.fields.map(field=><label className="form-field" key={field}><span>{field.replace(/([A-Z])/g," $1").replace(/^./,s=>s.toUpperCase())}</span><input value={form[field] || ""} onChange={e=>setForm({...form,[field]:e.target.value})} placeholder={`Enter ${field.replace(/[A-Z]/g," $&").toLowerCase()}`} required={field===config.fields[0]}/></label>)}<div className="modal-actions"><button type="button" className="button button-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="button button-primary" type="submit">{editing ? "Save changes" : "Create record"}</button></div></form></div>}
  </div>;
}
function formatValue(value) { if (!value) return "—"; if (typeof value === "object") return value.name || value.title || "—"; return String(value); }
function ComingSoon() { return <div className="coming-soon panel"><div className="coming-icon"><Command size={25}/></div><h2>Coming soon</h2><p>This module is part of the navigation blueprint and will be connected when its API endpoints are finalized.</p><button className="button button-secondary" onClick={()=>window.history.back()}>Go back</button></div>; }

function Login({ onLogin, error }) {
  const [email,setEmail]=useState("admin@atlas.edu");
  const [password,setPassword]=useState("password");
  const [show,setShow]=useState(false);
  const submit=e=>{e.preventDefault();onLogin(email,password);};
  return <div className="login-shell"><div className="login-art"><div className="login-brand"><div className="brand-mark"><School size={22}/></div><strong>atlas<span>.</span></strong></div><div className="login-art-content"><div className="art-kicker"><Sparkles size={15}/> THE SCHOOL OPERATING SYSTEM</div><h1>Make every school day <em>count.</em></h1><p>One thoughtful workspace for the people, progress, and possibilities that make your school extraordinary.</p><div className="login-art-stats"><div><strong>1,248</strong><span>Students</span></div><div><strong>94.6%</strong><span>Attendance</span></div><div><strong>84</strong><span>Educators</span></div></div></div><div className="art-footer">Designed for modern education <span>✦</span></div></div><div className="login-form-side"><div className="login-form-wrap"><div className="mobile-login-brand"><div className="brand-mark"><School size={21}/></div><strong>atlas<span>.</span></strong></div><div className="login-welcome"><div className="eyebrow">WELCOME BACK</div><h2>Sign in to Atlas</h2><p>Enter your details to access your school workspace.</p></div><form onSubmit={submit} className="login-form"><label className="form-field"><span>Email address</span><div className="input-with-icon"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@school.edu" required/></div></label><label className="form-field"><span>Password</span><div className="input-with-icon"><LockKeyhole size={17}/><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div></label><div className="login-options"><label><input type="checkbox" defaultChecked/> Remember me</label><a href="#forgot" onClick={e=>{e.preventDefault();alert("Connect your password reset flow here.");}}>Forgot password?</a></div>{error && <div className="inline-error"><AlertCircle size={15}/>{error}</div>}<button className="button button-primary login-submit" type="submit">Sign in <ArrowUpRight size={16}/></button></form><div className="login-footnote">{DEMO_MODE ? "Demo mode is active — any email and password will sign in." : "Your account is protected with secure authentication."}</div><div className="login-copyright">© 2026 Atlas School Management · Privacy · Terms</div></div></div></div>;
}
export default App;