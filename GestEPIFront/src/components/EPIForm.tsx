import React, { useState, useEffect, ReactNode } from "react";
import { 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  FormHelperText,
  CircularProgress,
  SelectChangeEvent
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Epi } from "gestepiinterfaces-semih";

export const EPIForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && !!id;
  
  const [epi, setEpi] = useState<Epi>({
    id: 0,
    internal_id: "",
    serial_number: "",
    model: "",
    brand: "",
    type_id: 1,
    size: "",
    color: "",
    purchase_date: new Date(),
    service_start_date: new Date(),
    manufacture_date: new Date(),
    inspection_frequency: "6m"
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [epiTypes, setEpiTypes] = useState<{ id: number; label: string }[]>([]);
  const [typesLoading, setTypesLoading] = useState(true); // Pour indiquer que les types d'EPI sont en cours de chargement
  const [typesError, setTypesError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les types d'EPI via l'API
    const fetchEpiTypes = async () => {
      try {
        const response = await fetch("http://localhost:5555/epi/types/all");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des types d'EPI.");
        }
        const data = await response.json();
        setEpiTypes(data);
      } catch (err) {
        setTypesError("Impossible de récupérer les types d'EPI.");
        console.error('Error fetching EPI types:', err);
      } finally {
        setTypesLoading(false);
      }
    };

    fetchEpiTypes();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const timer = setTimeout(() => {
        const mockEpi = {
          id: parseInt(id || "0"),
          internal_id: `EPI-00${id}`,
          serial_number: `SN12345${id}`,
          model: "Modèle Pro",
          brand: "MarqueTech",
          type_id: 1,
          size: "M",
          color: "Bleu",
          purchase_date: new Date(),
          service_start_date: new Date(),
          manufacture_date: new Date(),
          inspection_frequency: "6m"
        };
        setEpi(mockEpi);
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id, isEditMode]);

  const handleChange = (event: SelectChangeEvent<number>, child: ReactNode) => {
    const { name, value } = event.target;
    setEpi(prev => ({ ...prev, [name as string]: value }));
    
    // Clear error for this field
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!epi.internal_id) newErrors.internal_id = "L'identifiant interne est requis";
    if (!epi.brand) newErrors.brand = "La marque est requise";
    if (!epi.model) newErrors.model = "Le modèle est requis";
    if (!epi.serial_number) newErrors.serial_number = "Le numéro de série est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log("Soumission du formulaire EPI:", epi);
    
    // Redirect to list after form submission
    navigate("/epis");
  };

  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  if (loading || typesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditMode ? "Modifier un EPI" : "Ajouter un nouvel EPI"}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identifiant interne"
                name="internal_id"
                value={epi.internal_id}
                error={!!errors.internal_id}
                helperText={errors.internal_id}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type_id}>
                <InputLabel>Type d'EPI</InputLabel>
                <Select
                  name="type_id"
                  value={epi.type_id}
                  onChange={handleChange}
                  label="Type d'EPI"
                  required
                >
                  {epiTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
                  ))}
                </Select>
                {errors.type_id && <FormHelperText>{errors.type_id}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marque"
                name="brand"
                value={epi.brand}
                error={!!errors.brand}
                helperText={errors.brand}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Modèle"
                name="model"
                value={epi.model}
                error={!!errors.model}
                helperText={errors.model}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de série"
                name="serial_number"
                value={epi.serial_number}
                error={!!errors.serial_number}
                helperText={errors.serial_number}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date d'achat"
                name="purchase_date"
                value={formatDateForInput(epi.purchase_date)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.purchase_date}
                helperText={errors.purchase_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date de fabrication"
                name="manufacture_date"
                value={formatDateForInput(epi.manufacture_date)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.manufacture_date}
                helperText={errors.manufacture_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date de mise en service"
                name="service_start_date"
                value={formatDateForInput(epi.service_start_date)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.service_start_date}
                helperText={errors.service_start_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fréquence d'inspection"
                name="inspection_frequency"
                value={epi.inspection_frequency}
                placeholder="Ex: 3m, 6m, 1y"
                error={!!errors.inspection_frequency}
                helperText={errors.inspection_frequency || "Format: 3m (3 mois), 6m (6 mois), 1y (1 an)"}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Taille"
                name="size"
                value={epi.size || ""}
                error={!!errors.size}
                helperText={errors.size}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Couleur"
                name="color"
                value={epi.color || ""}
                error={!!errors.color}
                helperText={errors.color}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate("/epis")}>
                  Annuler
                </Button>
                <Button variant="contained" type="submit">
                  {isEditMode ? "Mettre à jour" : "Ajouter"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EPIForm;
