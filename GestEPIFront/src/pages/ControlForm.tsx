// import React, { useState, useEffect } from "react";
// import { 
//   Typography, 
//   Paper, 
//   Box, 
//   TextField, 
//   Button, 
//   FormControl, 
//   InputLabel, 
//   Select, 
//   MenuItem, 
//   Grid, 
//   FormHelperText,
//   Autocomplete
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import { EpiCheck, CheckStatus, Epi } from "gestepiinterfaces-semih";

// export const ControlForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = !!id && id !== "new";

//   const [control, setControl] = useState<EpiCheck>({
//     id: 1,
//     internal_id: "",
//     check_date: new Date(),
//     status_id: 1,
//     user_id: 1
//   });
  
//   const [epis, setEpis] = useState<Epi[]>([]);
//   const [loading, setLoading] = useState(isEditMode);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     // Fetch EPIs list for dropdown
//     const fetchEPIs = async () => {
//       try {
//         const response = await fetch("http://localhost:5500/api/epis");
//         const data = await response.json();
//         setEpis(data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des Epi:", error);
//       }
//     };
    
//     fetchEPIs();
    
//     // If editing, fetch control data
//     if (isEditMode) {
//       const fetchControl = async () => {
//         try {
//           const response = await fetch(`http://localhost:5500/api/controls/${id}`);
//           if (!response.ok) throw new Error("Contrôle non trouvé");
//           const data = await response.json();
//           setControl(data);
//         } catch (error) {
//           console.error("Erreur lors de la récupération du contrôle:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
      
//       fetchControl();
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
//     const { name, value } = e.target;
//     setControl(prev => ({ ...prev, [name as string]: value }));
    
//     // Clear error for this field
//     if (errors[name as string]) {
//       setErrors(prev => ({ ...prev, [name as string]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!control.epiId) newErrors.epiId = "L'Epi est requis";
//     if (!control.manager) newErrors.manager = "Le gestionnaire est requis";
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     const method = isEditMode ? "PUT" : "POST";
//     const url = isEditMode 
//       ? `http://localhost:5500/api/controls/${id}` 
//       : "http://localhost:5500/api/controls";
    
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(control)
//       });
      
//       if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
      
//       navigate("/controls");
//     } catch (error) {
//       console.error("Erreur lors de l'enregistrement du contrôle:", error);
//     }
//   };

//   const formatDateForInput = (date: Date) => {
//     const d = new Date(date);
//     return d.toISOString().split('T')[0];
//   };

//   if (loading) {
//     return <Typography>Chargement du contrôle...</Typography>;
//   }

//   return (
//     <Box>
//       <Typography variant="h4" component="h1" gutterBottom>
//         {isEditMode ? "Modifier un contrôle" : "Ajouter un nouveau contrôle"}
//       </Typography>

//       <Paper sx={{ p: 3, mt: 2 }}>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.epiId}>
//                 <InputLabel>Epi</InputLabel>
//                 <Select
//                   name="epiId"
//                   value={control.epiId}
//                 //   onChange={handleChange}
//                   label="Epi"
//                   required
//                 >
//                   {epis.map((epi) => (
//                     <MenuItem key={epi.id} value={epi.id}>
//                       {epi.customId} - {epi.brand} {epi.model}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.epiId && <FormHelperText>{errors.epiId}</FormHelperText>}
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Date du contrôle"
//                 name="controlDate"
//                 value={formatDateForInput(control.controlDate)}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 error={!!errors.controlDate}
//                 helperText={errors.controlDate}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Gestionnaire"
//                 name="manager"
//                 value={control.manager}
//                 onChange={handleChange}
//                 error={!!errors.manager}
//                 helperText={errors.manager}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.status}>
//                 <InputLabel>Statut</InputLabel>
//                 <Select
//                   name="status"
//                   value={control.status}
//                 //   onChange={handleChange}
//                   label="Statut"
//                   required
//                 >
//                   {Object.values(CheckStatus).map(status => (
//                     <MenuItem key={status} value={status}>{status}</MenuItem>
//                   ))}
//                 </Select>
//                 {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarques"
//                 name="remarks"
//                 value={control.remarks || ""}
//                 onChange={handleChange}
//                 multiline
//                 rows={4}
//                 error={!!errors.remarks}
//                 helperText={errors.remarks}
//               />
//             </Grid>
            
//             <Grid item xs={12}>
//               <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
//                 <Button variant="outlined" onClick={() => navigate("/controls")}>
//                   Annuler
//                 </Button>
//                 <Button variant="contained" type="submit">
//                   {isEditMode ? "Mettre à jour" : "Ajouter"}
//                 </Button>
//               </Box>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Box>
//   );
// };



export const ControlForm = () => { 
  return (
    <div></div>
  )
}
