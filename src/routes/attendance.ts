import { Router } from 'express';
import { markAttendance } from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/mark', authenticate, markAttendance);

export default router;
