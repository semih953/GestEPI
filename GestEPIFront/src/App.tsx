import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

// Pages
import {Dashboard} from "./pages/Dashboard";
import {EPIList} from "./pages/EPIList";
import {ControlList} from "./pages/ControlList";
import {ControlForm} from "./pages/ControlForm";
import {Layout} from "./components/Layout";
 
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="epis" element={<EPIList />} />
             <Route path="controls" element={<ControlList />} />
             <Route path="controls/new" element={<ControlForm />} />
            <Route path="controls/:id" element={<ControlForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;