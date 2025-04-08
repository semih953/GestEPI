// import React, { useState, useEffect } from "react";
// import { 
//   Typography, 
//   Grid, 
//   Paper, 
//   Box, 
//   List, 
//   ListItem, 
//   ListItemText, 
//   Divider,
//   Chip 
// } from "@mui/material";
// import { Warning } from "@mui/icons-material";
// import { ControlAlert } from "gestepiinterfaces-semih";

// export const Dashboard = () => {
//   const [alerts, setAlerts] = useState<ControlAlert[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalEpis: 0,
//     totalControls: 0,
//     pendingControls: 0
//   });

// //   useEffect(() => {
// //     const fetchAlerts = async () => {
// //       try {
// //         const response = await fetch("http://localhost:5500/api/epis/alerts?days=30");
// //         const data = await response.json();
// //         setAlerts(data);
// //       } catch (error) {
// //         console.error("Erreur lors de la récupération des alertes:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

//     const fetchStats = async () => {
//       // Dans une application réelle, vous auriez une route API pour cela
//       // Simulation pour l'exemple
//       setStats({
//         totalEpis: 24,
//         totalControls: 86,
//         pendingControls: 5
//       });
//     };

//     fetchAlerts();
//     fetchStats();
//   }, []);

//   return (
//     <div>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Tableau de bord
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Statistiques */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
//             <Typography variant="h6">Total EPI</Typography>
//             <Typography variant="h3">{stats.totalEpis}</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
//             <Typography variant="h6">Contrôles effectués</Typography>
//             <Typography variant="h3">{stats.totalControls}</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
//             <Typography variant="h6">Contrôles à faire</Typography>
//             <Typography variant="h3">{stats.pendingControls}</Typography>
//           </Paper>
//         </Grid>

//         {/* Alertes */}
//         <Grid item xs={12}>
//           <Paper sx={{ p: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <Warning color="warning" sx={{ mr: 1 }} />
//               <Typography variant="h6">
//                 Alertes de contrôle à venir
//               </Typography>
//             </Box>
//             {loading ? (
//               <Typography>Chargement des alertes...</Typography>
//             ) : alerts.length === 0 ? (
//               <Typography>Aucune alerte pour les 30 prochains jours</Typography>
//             ) : (
//               <List>
//                 {alerts.map((alert, index) => (
//                   <React.Fragment key={alert.epi.id}>
//                     {index > 0 && <Divider />}
//                     <ListItem>
//                       <ListItemText
//                         primary={`${alert.epi.customId} - ${alert.epi.brand} ${alert.epi.model}`}
//                         secondary={`Dernier contrôle: ${alert.lastControl ? new Date(alert.lastControl.controlDate).toLocaleDateString("fr-FR") : "Jamais contrôlé"}`}
//                       />
//                       <Chip 
//                         label={`Contrôle dans ${alert.daysUntilNextControl} jours`}
//                         color={alert.daysUntilNextControl <= 7 ? "error" : "warning"}
//                       />
//                     </ListItem>
//                   </React.Fragment>
//                 ))}
//               </List>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default Dashboard;


export const Dashboard = () => { 
    return (
        <div>test dashboard</div>
    )
}
