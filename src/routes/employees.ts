import { Router } from 'express';
import { createEmployee, getEmployee } from '../controllers/employeesController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['admin', 'hr']), createEmployee);
router.get('/:id', authenticate, getEmployee);

export default router;
