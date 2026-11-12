import { configureStore, createSlice } from "@reduxjs/toolkit";

const readUser = () => {
  try { return JSON.parse(localStorage.getItem("atlas_user")) || null; }
  catch { return null; }
};

const appSlice = createSlice({
  name: "app",
  initialState: {
    theme: localStorage.getItem("atlas_theme") || "light",
    user: readUser(),
    mobileOpen: false,
    sidebarCollapsed: false,
    loginError: "",
  },
  reducers: {
    setTheme(state, action) { state.theme = action.payload; },
    setUser(state, action) { state.user = action.payload; },
    setMobileOpen(state, action) { state.mobileOpen = action.payload; },
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setLoginError(state, action) { state.loginError = action.payload; },
  },
});

export const { setTheme, setUser, setMobileOpen, toggleSidebar, setLoginError } = appSlice.actions;
export const store = configureStore({ reducer: { app: appSlice.reducer } });
