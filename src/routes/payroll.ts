import { Router } from 'express';
import { distributePayroll, payrollHistory } from '../controllers/payrollController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/distribute', authenticate, authorize(['admin', 'hr']), distributePayroll);
router.get('/history', authenticate, authorize(['admin', 'hr']), payrollHistory);

export default router;
