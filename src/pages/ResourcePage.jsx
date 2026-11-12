import { useEffect, useMemo, useState } from "react";
import { Plus, Users, CheckCircle2, Search, SlidersHorizontal, Download, AlertCircle, Settings, MoreHorizontal, X } from "lucide-react";
import { resources, DEMO_MODE } from "../config/api";
import { getList, createRecord, updateRecord, deleteRecord } from "../lib/api";
import { demoMap } from "../data/appData";

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
export default ResourcePage;
