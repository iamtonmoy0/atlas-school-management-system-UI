import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { login, logout } from "./lib/api";
import { setTheme as setThemeAction, setUser as setUserAction, setMobileOpen, toggleSidebar, setLoginError as setLoginErrorAction } from "./store";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./components/Login";
import ComingSoon from "./components/ComingSoon";
import Dashboard from "./pages/Dashboard";
import ResourcePage from "./pages/ResourcePage";

function App() {
  const dispatch = useDispatch();
  const { theme, user, mobileOpen, sidebarCollapsed: collapsed, loginError } = useSelector(state => state.app);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("atlas_theme", theme);
  }, [theme]);
  useEffect(() => {
    const handler = () => { dispatch(setUserAction(null)); navigate("/login"); };
    window.addEventListener("atlas:unauthorized", handler);
    return () => window.removeEventListener("atlas:unauthorized", handler);
  }, [dispatch, navigate]);

  const signIn = async (email, password) => {
    dispatch(setLoginErrorAction(""));
    try { const account = await login(email, password); dispatch(setUserAction(account)); navigate("/"); }
    catch (e) { dispatch(setLoginErrorAction(e.response?.data?.message || e.message || "Unable to sign in")); }
  };
  const signOut = () => { logout(); dispatch(setUserAction(null)); navigate("/login"); };
  if (!user && location.pathname !== "/login") return <Login onLogin={signIn} error={loginError} />;
  if (!user) return <Login onLogin={signIn} error={loginError} />;
  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => dispatch(setMobileOpen(false))} onCollapse={() => dispatch(toggleSidebar())} />
      <div className="main-shell">
        <Header theme={theme} setTheme={value => dispatch(setThemeAction(value))} user={user} onMenu={() => dispatch(setMobileOpen(true))} onLogout={signOut} />
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









export default App;
