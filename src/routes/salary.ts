import { Router } from 'express';
import { calculateSalary, getSalaryForEmployee } from '../controllers/salaryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/calculate', authenticate, authorize(['admin', 'hr']), calculateSalary);
router.get('/:employeeId', authenticate, getSalaryForEmployee);

export default router;
