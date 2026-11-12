import { NavLink } from "react-router-dom";
import { School, X, ChevronDown, CircleHelp, ArrowUpRight, Settings, PanelLeftClose } from "lucide-react";
import { navGroups } from "../data/appData";

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
export default Sidebar;
