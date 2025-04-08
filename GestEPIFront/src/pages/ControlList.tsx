// import React, { useState, useEffect } from "react";
// import { 
//   Typography, 
//   Paper, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Button, 
//   Chip,
//   Box,
//   IconButton 
// } from "@mui/material";
// import { Add, Edit, Visibility } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { Control, ControlStatus } from "gestepiinterfaces-semih";

// export const ControlList = () => {
//   const [controls, setControls] = useState<Control[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchControls = async () => {
//       try {
//         const response = await fetch("http://localhost:5500/api/controls");
//         const data = await response.json();
//         setControls(data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des contrôles:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchControls();
//   }, []);

//   const getStatusColor = (status: ControlStatus) => {
//     switch (status) {
//       case ControlStatus.OPERATIONNEL:
//         return "success";
//       case ControlStatus.A_REPARER:
//         return "warning";
//       case ControlStatus.MIS_AU_REBUT:
//         return "error";
//       default:
//         return "default";
//     }
//   };

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString("fr-FR");
//   };

//   return (
//     <div>
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Liste des Contrôles
//         </Typography>
//         <Button 
//           variant="contained" 
//           startIcon={<Add />}
//           onClick={() => navigate("/controls/new")}
//         >
//           Ajouter un contrôle
//         </Button>
//       </Box>

//       {loading ? (
//         <Typography>Chargement des contrôles...</Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="Liste des contrôles">
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>EPI</TableCell>
//                 <TableCell>Date du contrôle</TableCell>
//                 <TableCell>Gestionnaire</TableCell>
//                 <TableCell>Statut</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {controls.map((control) => (
//                 <TableRow key={control.id}>
//                   <TableCell>{control.id}</TableCell>
//                   <TableCell>{control.epiId}</TableCell>
//                   <TableCell>{formatDate(control.controlDate)}</TableCell>
//                   <TableCell>{control.manager}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={control.status} 
//                       color={getStatusColor(control.status) as any}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => navigate(`/controls/${control.id}`)}>
//                       <Visibility />
//                     </IconButton>
//                     <IconButton onClick={() => navigate(`/controls/${control.id}/edit`)}>
//                       <Edit />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </div>
//   );
// };

// export default ControlList;



export const ControlList = () => { 
    return (
        <div>test ControlList</div>
    )
}