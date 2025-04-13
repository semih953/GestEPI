// import React from "react";
// import { Outlet } from "react-router-dom";
// import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
// import { Dashboard as DashboardIcon, Security, FactCheck, People } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// const drawerWidth = 240;

// export const Layout = () => {
//   const navigate = useNavigate();

//   const menuItems = [
//     { text: "Tableau de bord", icon: <DashboardIcon />, path: "/" },
//     { text: "Gestion des EPI", icon: <Security />, path: "/epi" },
//     { text: "Contrôles", icon: <FactCheck />, path: "/control" },
//     { text: "Utilisateurs", icon: <People />, path: "/users" }, // Nouvelle entrée pour les utilisateurs
//   ];

//   return (
//     <Box sx={{ display: "flex" }}>
//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <Typography variant="h6" noWrap component="div">
//             GestEPI - Gestion des Équipements de Protection Individuelle
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
//         }}
//       >
//         <Toolbar />
//         <Box sx={{ overflow: "auto" }}>
//           <List>
//             {menuItems.map((item) => (
//               <ListItem 
//                 button 
//                 key={item.text} 
//                 onClick={() => navigate(item.path)}
//               >
//                 <ListItemIcon>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.text} />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Drawer>
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default Layout;


import React from "react";
import { Outlet } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import { Dashboard as DashboardIcon, Security, FactCheck, People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export const Layout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Tableau de bord", icon: <DashboardIcon />, path: "/" },
    { text: "Gestion des EPI", icon: <Security />, path: "/epi" },
    { text: "Contrôles", icon: <FactCheck />, path: "/control" },
    { text: "Utilisateurs", icon: <People />, path: "/users" }, // Nouvelle entrée pour les utilisateurs
  ];

  const handleLogout = () => {
    // Supprimer l'utilisateur de localStorage
    localStorage.removeItem("user");
    // Rediriger vers la page de login
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            GestEPI - Gestion des Équipements de Protection Individuelle
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ marginLeft: "auto" }}
          >
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
