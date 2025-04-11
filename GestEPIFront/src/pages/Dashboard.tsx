import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip,
  CircularProgress
} from "@mui/material";
import { Warning, CheckCircle, LocalOffer, Assignment } from "@mui/icons-material";
import { Epi, EpiCheck } from "gestepiinterfaces-semih";


// Interface pour les alertes
interface ControlAlert {
  epi: Epi;
  lastControl: EpiCheck | null;
  daysUntilNextControl: number;
}

// Données mockées pour le développement
const mockAlerts: ControlAlert[] = [
  {
    epi: {
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
    lastControl: {
      id: 1,
      internal_id: "EPI-001",
      check_date: new Date("2023-06-15"),
      status_id: 1,
      user_id: 1
    },
    daysUntilNextControl: 5
  },
  {
    epi: {
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
    lastControl: {
      id: 2,
      internal_id: "EPI-002",
      check_date: new Date("2023-07-10"),
      status_id: 1,
      user_id: 2
    },
    daysUntilNextControl: 12
  }
];

const mockStats = {
  totalEpis: 3,
  totalControls: 1,
  pendingControls: 2
};

export const Dashboard = () => {
  const [alerts, setAlerts] = useState<ControlAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEpis: 0,
    totalControls: 0,
    pendingControls: 0
  });

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setAlerts(mockAlerts);
      setStats(mockStats);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "Jamais";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
      <div>
          
      <Typography variant="h4" component="h1" gutterBottom>
        Tableau de bord
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Statistiques */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <LocalOffer sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">Total EPI</Typography>
              <Typography variant="h3">{stats.totalEpis}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6">Contrôles effectués</Typography>
              <Typography variant="h3">{stats.totalControls}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
              <Typography variant="h6">Contrôles à faire</Typography>
              <Typography variant="h3">{stats.pendingControls}</Typography>
            </Paper>
          </Grid>

          {/* Alertes */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Alertes de contrôle à venir
                </Typography>
              </Box>
              
              {alerts.length === 0 ? (
                <Typography>Aucune alerte pour les 30 prochains jours</Typography>
              ) : (
                <List>
                  {alerts.map((alert, index) => (
                    <React.Fragment key={alert.epi.id}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={`${alert.epi.internal_id} - ${alert.epi.brand} ${alert.epi.model}`}
                          secondary={`Dernier contrôle: ${alert.lastControl ? formatDate(alert.lastControl.check_date) : "Jamais contrôlé"}`}
                        />
                        <Chip 
                          label={`Contrôle dans ${alert.daysUntilNextControl} jours`}
                          color={alert.daysUntilNextControl <= 7 ? "error" : "warning"}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};