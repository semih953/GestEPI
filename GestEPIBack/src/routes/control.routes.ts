import express from 'express';
import controlController from '../controllers/control.controller';

const router = express.Router();

// Routes pour les contrôles
router.get('/', controlController.getAllControls);
router.get('/:id', controlController.getControlById);
router.post('/', controlController.createControl);
router.put('/:id', controlController.updateControl);
router.delete('/:id', controlController.deleteControl);

// Route pour récupérer tous les contrôles d'un EPI
router.get('/epi/:epiId', controlController.getControlsByEpiId);

export default router;