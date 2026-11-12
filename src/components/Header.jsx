import { useState } from "react";
import { Search, Bell, Moon, Sun, Menu, ChevronRight, ChevronDown, LogOut } from "lucide-react";

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
export default Header;
