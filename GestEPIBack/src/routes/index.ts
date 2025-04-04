import express from 'express';
import epiRoutes from './epi.routes';
import controlRoutes from './control.routes';

const router = express.Router();

router.use('/epis', epiRoutes);
router.use('/controls', controlRoutes);

export default router;