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
  Autocomplete
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Epi, EpiCheck } from "gestepiinterfaces-semih";


// Mock data
const mockEpis: Epi[] = [
  {
    id: 1,
    internal_id: "EPI-001",
    serial_number: "SN123456",
    model: "Casque Pro",
    brand: "SafetyFirst",
    type_id: 1,
    size: "L",
    color: "Rouge",
    purchase_date: new Date("2023-01-15"),
    service_start_date: new Date("2023-01-20"),
    manufacture_date: new Date("2022-10-05"),
    inspection_frequency: "6m"
  },
  {
    id: 2,
    internal_id: "EPI-002",
    serial_number: "SN789012",
    model: "Harnais Secure",
    brand: "AlpineEquip",
    type_id: 2,
    size: "M",
    color: "Noir",
    purchase_date: new Date("2023-03-10"),
    service_start_date: new Date("2023-03-15"),
    manufacture_date: new Date("2023-01-20"),
    inspection_frequency: "3m"
  },
  {
    id: 3,
    internal_id: "EPI-003",
    serial_number: "SN345678",
    model: "Corde Dynamic",
    brand: "RopesMaster",
    type_id: 3,
    size: "50m",
    color: "Bleu",
    purchase_date: new Date("2022-11-05"),
    service_start_date: new Date("2022-11-10"),
    manufacture_date: new Date("2022-09-15"),
    inspection_frequency: "3m"
  }
];

const mockStatuses = [
  { id: 1, label: "Opérationnel" },
  { id: 2, label: "À réparer" },
  { id: 3, label: "Mis au rebut" }
];

const mockUsers = [
  { id: 1, firstName: "Jean", lastName: "Dupont" },
  { id: 2, firstName: "Marie", lastName: "Martin" }
];

export const ControlForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new" && !!id;

  const [control, setControl] = useState<EpiCheck>({
    id: 0,
    internal_id: "",
    check_date: new Date(),
    status_id: 1,
    user_id: 1
  });
  
  const [selectedEpi, setSelectedEpi] = useState<Epi | null>(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      // Simuler la récupération d'un contrôle
      const timer = setTimeout(() => {
        // Exemple de récupération de contrôle par ID
        const mockControl = {
          id: parseInt(id || "0"),
          internal_id: mockEpis[0].internal_id,
          check_date: new Date(),
          status_id: 1,
          user_id: 1
        };
        
        setControl(mockControl);
        setSelectedEpi(mockEpis.find(epi => epi.internal_id === mockControl.internal_id) || null);
        setRemarks("RAS - Contrôle de routine");
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setControl(prev => ({ ...prev, [name as string]: value }));
    
    // Clear error for this field
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: "" }));
    }
  };

  const handleEpiChange = (_event: React.SyntheticEvent, epi: Epi | null) => {
    setSelectedEpi(epi);
    if (epi) {
      setControl(prev => ({ ...prev, internal_id: epi.internal_id }));
    } else {
      setControl(prev => ({ ...prev, internal_id: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!control.internal_id) newErrors.internal_id = "L'EPI est requis";
    if (!control.user_id) newErrors.user_id = "Le contrôleur est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Mock submission
    console.log("Soumission du formulaire de contrôle:", { ...control, remarks });
    
    // Redirect to list after form submission
    navigate("/controls");
  };

  const formatDateForInput = (date: Date) => {
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
        {isEditMode ? "Modifier un contrôle" : "Ajouter un nouveau contrôle"}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={mockEpis}
                getOptionLabel={(option) => `${option.internal_id} - ${option.brand} ${option.model}`}
                value={selectedEpi}
                onChange={handleEpiChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="EPI"
                    error={!!errors.internal_id}
                    helperText={errors.internal_id}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date du contrôle"
                name="check_date"
                value={formatDateForInput(control.check_date)}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.check_date}
                helperText={errors.check_date}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.user_id}>
                <InputLabel>Contrôleur</InputLabel>
                <Select
                  name="user_id"
                  value={control.user_id}
                  // onChange={handleChange}
                  label="Contrôleur"
                  required
                >
                  {mockUsers.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.user_id && <FormHelperText>{errors.user_id}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.status_id}>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status_id"
                  value={control.status_id}
                  // onChange={handleChange}
                  label="Statut"
                  required
                >
                  {mockStatuses.map(status => (
                    <MenuItem key={status.id} value={status.id}>{status.label}</MenuItem>
                  ))}
                </Select>
                {errors.status_id && <FormHelperText>{errors.status_id}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarques"
                name="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                multiline
                rows={4}
                error={!!errors.remarks}
                helperText={errors.remarks}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate("/controls")}>
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

export default ControlForm;