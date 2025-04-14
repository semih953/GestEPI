import React, { useState, useEffect } from "react";
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
  Alert,
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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [epiTypes, setEpiTypes] = useState<{ id: number; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les types d'EPI
  useEffect(() => {
    const fetchEpiTypes = async () => {
      try {
        const response = await fetch("http://localhost:5555/epi/types/all");
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Types d'EPI récupérés:", data);
        setEpiTypes(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des types:', err);
        setError("Impossible de récupérer les types d'EPI.");
      }
    };

    fetchEpiTypes();
  }, []);

  // Récupérer les détails de l'EPI en mode édition
  useEffect(() => {
    if (isEditMode) {
      const fetchEpiDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5555/epi/getById/${id}`);
          
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Détails de l'EPI récupérés:", data);
          
          // Convertir les dates en objets Date
          const formatEpiData = {
            ...data,
            purchase_date: data.purchase_date ? new Date(data.purchase_date) : new Date(),
            service_start_date: data.service_start_date ? new Date(data.service_start_date) : new Date(),
            manufacture_date: data.manufacture_date ? new Date(data.manufacture_date) : new Date(),
          };
          
          setEpi(formatEpiData);
          setError(null);
        } catch (err) {
          console.error('Erreur lors de la récupération des détails:', err);
          setError("Impossible de récupérer les détails de l'EPI.");
        } finally {
          setLoading(false);
        }
      };

      fetchEpiDetails();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEpi(prev => ({ ...prev, [name as string]: value }));
    
    // Supprimer l'erreur pour ce champ
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: "" }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setEpi(prev => ({ ...prev, [name as string]: value }));
    
    // Supprimer l'erreur pour ce champ
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    
    try {
      const url = isEditMode 
        ? `http://localhost:5555/epi/update/${id}`
        : "http://localhost:5555/epi/add";
      
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(epi)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log(isEditMode ? "EPI mis à jour:" : "EPI créé:", result);
      
      // Redirection vers la liste
      navigate("/epi");
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      setError(isEditMode 
        ? "Impossible de mettre à jour l'EPI." 
        : "Impossible de créer l'EPI.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateForInput = (date: Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  if (loading) {
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Identifiant interne"
                name="internal_id"
                value={epi.internal_id}
                onChange={handleChange}
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
                  onChange={handleSelectChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                error={!!errors.color}
                helperText={errors.color}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate("/epi")}>
                  Annuler
                </Button>
                <Button 
                  variant="contained" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : (isEditMode ? "Mettre à jour" : "Ajouter")}
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