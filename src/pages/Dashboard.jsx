import { useEffect, useState } from "react";
import { LayoutDashboard, GraduationCap, Users, BookOpen, UserRoundCheck, ArrowUpRight, ArrowDownRight, Download, Plus, Sparkles, ChevronDown, MoreHorizontal, ClipboardCheck, Award, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DEMO_MODE } from "../config/api";
import { getList } from "../lib/api";
import { chartData, activities } from "../data/appData";

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
export default Dashboard;
