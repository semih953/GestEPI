import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

// Pages
import {Dashboard} from "./pages/Dashboard";
import {EPIList} from "./pages/EPIPages";
import {ControlList} from "./pages/ControlPages";
import {ControlForm} from "./components/ControlForm";
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
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;