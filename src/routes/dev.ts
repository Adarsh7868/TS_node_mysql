import { Router } from 'express';
import { createAdmin } from '../controllers/devController';

const router = Router();

router.post('/create-admin', createAdmin);

export default router;
