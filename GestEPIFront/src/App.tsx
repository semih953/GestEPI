import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

// Pages
import {Dashboard} from "./pages/Dashboard";
import {EPIList} from "./pages/EPIPages";
import {ControlList} from "./pages/ControlPages";
import {UsersList} from "./pages/UserPages";
import {ControlForm} from "./components/ControlForm";
import {UserForm} from "./components/UserForm";
import {UserDetail} from "./components/UserDetail";
import {Layout} from "./components/Layout";
 
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="epi" element={<EPIList />} />
            <Route path="control" element={<ControlList />} />
            {/* Routes pour les utilisateurs */}
            <Route path="users" element={<UsersList />} />
            <Route path="users/new" element={<UserForm />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="users/:id/edit" element={<UserForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;