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
//   FormHelperText 
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import { Epi, EpiTypes, EPICategory } from "gestepiinterfaces-semih";

// const EPIForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = id !== "new";
  
//   const [epi, setEpi] = useState<Epi>({
//     customId: "",
//     type: "",
//     category: EPICategory.TEXTILE,
//     brand: "",
//     model: "",
//     serialNumber: "",
//     purchaseDate: new Date(),
//     manufacturingDate: new Date(),
//     commissioningDate: new Date(),
//     controlFrequency: 90, // Default 90 days
//     size: "",
//     color: ""
//   });
  
//   const [loading, setLoading] = useState(isEditMode);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchEPI = async () => {
//         try {
//           const response = await fetch(`http://localhost:5500/api/epis/${id}`);
//           if (!response.ok) throw new Error("Epi non trouvé");
//           const data = await response.json();
//           setEpi(data);
//         } catch (error) {
//           console.error("Erreur lors de la récupération de l'Epi:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
      
//       fetchEPI();
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
//     const { name, value } = e.target;
//     setEpi(prev => ({ ...prev, [name as string]: value }));
    
//     // Clear error for this field
//     if (errors[name as string]) {
//       setErrors(prev => ({ ...prev, [name as string]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
    
//     if (!epi.customId) newErrors.customId = "L'identifiant personnalisé est requis";
//     if (!epi.brand) newErrors.brand = "La marque est requise";
//     if (!epi.model) newErrors.model = "Le modèle est requis";
//     if (!epi.serialNumber) newErrors.serialNumber = "Le numéro de série est requis";
//     if (epi.controlFrequency <= 0) newErrors.controlFrequency = "La fréquence de contrôle doit être positive";
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     const method = isEditMode ? "PUT" : "POST";
//     const url = isEditMode ? `http://localhost:5500/api/epis/${id}` : "http://localhost:5500/api/epis";
    
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(epi)
//       });
      
//       if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
      
//       navigate("/epis");
//     } catch (error) {
//       console.error("Erreur lors de l'enregistrement de l'Epi:", error);
//     }
//   };

//   const formatDateForInput = (date: Date) => {
//     const d = new Date(date);
//     return d.toISOString().split('T')[0];
//   };

//   if (loading) {
//     return <Typography>Chargement de l'Epi...</Typography>;
//   }

//   return (
//     <Box>
//       <Typography variant="h4" component="h1" gutterBottom>
//         {isEditMode ? "Modifier un Epi" : "Ajouter un nouvel Epi"}
//       </Typography>

//       <Paper sx={{ p: 3, mt: 2 }}>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Identifiant personnalisé"
//                 name="customId"
//                 value={epi.customId}
//                 onChange={handleChange}
//                 error={!!errors.customId}
//                 helperText={errors.customId}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.type}>
//                 <InputLabel>Type d'Epi</InputLabel>
//                 <Select
//                   name="type"
//                   value={epi.type}
//                 //   onChange={handleChange}
//                   label="Type d'Epi"
//                 >
//                   {Object.values(EpiTypes).map(type => (
//                     <MenuItem key={type} value={type}>{type}</MenuItem>
//                   ))}
//                 </Select>
//                 {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth error={!!errors.category}>
//                 <InputLabel>Catégorie</InputLabel>
//                 <Select
//                   name="category"
//                   value={epi.category}
//                 //   onChange={handleChange}
//                   label="Catégorie"
//                 >
//                   {Object.values(EPICategory).map(category => (
//                     <MenuItem key={category} value={category}>{category}</MenuItem>
//                   ))}
//                 </Select>
//                 {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Marque"
//                 name="brand"
//                 value={epi.brand}
//                 onChange={handleChange}
//                 error={!!errors.brand}
//                 helperText={errors.brand}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Modèle"
//                 name="model"
//                 value={epi.model}
//                 onChange={handleChange}
//                 error={!!errors.model}
//                 helperText={errors.model}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Numéro de série"
//                 name="serialNumber"
//                 value={epi.serialNumber}
//                 onChange={handleChange}
//                 error={!!errors.serialNumber}
//                 helperText={errors.serialNumber}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Date d'achat"
//                 name="purchaseDate"
//                 value={formatDateForInput(epi.purchaseDate)}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 error={!!errors.purchaseDate}
//                 helperText={errors.purchaseDate}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Date de fabrication"
//                 name="manufacturingDate"
//                 value={formatDateForInput(epi.manufacturingDate)}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 error={!!errors.manufacturingDate}
//                 helperText={errors.manufacturingDate}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 type="date"
//                 label="Date de mise en service"
//                 name="commissioningDate"
//                 value={formatDateForInput(epi.commissioningDate)}
//                 onChange={handleChange}
//                 InputLabelProps={{ shrink: true }}
//                 error={!!errors.commissioningDate}
//                 helperText={errors.commissioningDate}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="Fréquence de contrôle (jours)"
//                 name="controlFrequency"
//                 value={epi.controlFrequency}
//                 onChange={handleChange}
//                 error={!!errors.controlFrequency}
//                 helperText={errors.controlFrequency}
//                 required
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Taille"
//                 name="size"
//                 value={epi.size || ""}
//                 onChange={handleChange}
//                 error={!!errors.size}
//                 helperText={errors.size}
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Couleur"
//                 name="color"
//                 value={epi.color || ""}
//                 onChange={handleChange}
//                 error={!!errors.color}
//                 helperText={errors.color}
//               />
//             </Grid>
            
//             <Grid item xs={12}>
//               <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
//                 <Button variant="outlined" onClick={() => navigate("/epis")}>
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

// export default EPIForm;




export const EpiForm = () => { 
  return (
    <div></div>
  )
}
