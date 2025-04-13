// // import React, { useState, useEffect } from "react";
// // import { Box, Typography, Button } from "@mui/material";
// // import { useNavigate } from "react-router-dom";
// // import { UserForm } from "../components/UserForm";
// // import UsersList from "../components/UsersList";

// // export const UserPages = () => {
// //   const navigate = useNavigate();
// //   const [isAdding, setIsAdding] = useState(false); // Gérer l'état pour ajouter un utilisateur
// //   const [isEditing, setIsEditing] = useState(false); // Gérer l'état pour modifier un utilisateur

// //   useEffect(() => {
// //     // Réinitialiser l'état d'ajout ou de modification quand la page se charge
// //     const path = window.location.pathname;
// //     if (path.includes("/users/new")) {
// //       setIsAdding(true);
// //       setIsEditing(false);
// //     } else if (path.includes("/users/")) {
// //       setIsAdding(false);
// //       setIsEditing(true);
// //     }
// //   }, [window.location.pathname]);

// //   return (
// //     <Box sx={{ padding: 3 }}>
// //       <Typography variant="h4" gutterBottom>
// //         {isAdding ? "Ajouter un nouvel utilisateur" : isEditing ? "Modifier un utilisateur" : "Liste des utilisateurs"}
// //       </Typography>

// //       {isAdding || isEditing ? (
// //         <UserForm />
// //       ) : (
// //         <Box sx={{ mb: 2 }}>
// //           <Button
// //             variant="contained"
// //             color="primary"
// //             onClick={() => navigate("/users/new")}
// //             sx={{ mb: 2 }}
// //           >
// //             Ajouter un utilisateur
// //           </Button>
// //           <UsersList />
// //         </Box>
// //       )}
// //     </Box>
// //   );
// // };

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from "@mui/material";
// import UsersList from "../components/UsersList";
// import { UserForm } from "../components/UserForm";

// export const UserPages = () => {
//   const [openModal, setOpenModal] = useState(false); // Contrôle de la modal

//   const handleOpen = () => setOpenModal(true);
//   const handleClose = () => setOpenModal(false);

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Gestion des utilisateurs
//       </Typography>

//       <Box sx={{ mb: 2 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpen}
//           sx={{ mb: 2 }}
//         >
//           Ajouter un utilisateur
//         </Button>

//         <UsersList />
//       </Box>

//       {/* Modal pour le formulaire */}
//       <Dialog
//         open={openModal}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
//         <DialogContent>
//           <UserForm onSuccess={handleClose} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="error">
//             Annuler
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import UsersList from "../components/UsersList";
import { UserForm } from "../components/UserForm";
import { Edit } from "@mui/icons-material";

export const UserPages = () => {
  const [openModal, setOpenModal] = useState(false); // Contrôle de la modal
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Utilisateur à éditer

  const handleOpen = (id?: string) => {
    setSelectedUserId(id || null);
    setOpenModal(true);
  };

  const handleClose = () => {
    setSelectedUserId(null);
    setOpenModal(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des utilisateurs
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()} // ouverture de la modal en mode création
          sx={{ mb: 2 }}
        >
          Ajouter un utilisateur
        </Button>

        {/* Liste avec possibilité de déclencher une édition */}
        <UsersList onEdit={handleOpen} />
      </Box>

      {/* Modal de création / édition */}
      <Dialog
        open={openModal}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedUserId ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
        </DialogTitle>
        <DialogContent>
          <UserForm id={selectedUserId} onSuccess={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
