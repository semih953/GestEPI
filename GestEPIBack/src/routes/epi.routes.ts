import express from 'express';
import epiController from '../controllers/epi.controllers';

const router = express.Router();

// Routes pour les EPI
router.get('/', epiController.getAllEPIs);
router.get('/alerts', epiController.getEPIsWithUpcomingControls);
router.get('/:id', epiController.getEPIById);
router.get('/:id/with-controls', epiController.getEPIWithControls);
router.post('/', epiController.createEPI);
router.put('/:id', epiController.updateEPI);
router.delete('/:id', epiController.deleteEPI);

export default router;