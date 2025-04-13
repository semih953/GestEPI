import React from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography
} from "@mui/material";

const Header: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          GestEPI - Gestion des Équipements de Protection Individuelle
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;