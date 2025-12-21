import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllMissions,
  getAllPayments,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, authorize('ADMIN'), getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin)
 */
router.get('/users', authenticate, authorize('ADMIN'), getAllUsers);

/**
 * @route   GET /api/admin/missions
 * @desc    Get all missions
 * @access  Private (Admin)
 */
router.get('/missions', authenticate, authorize('ADMIN'), getAllMissions);

/**
 * @route   GET /api/admin/payments
 * @desc    Get all payments
 * @access  Private (Admin)
 */
router.get('/payments', authenticate, authorize('ADMIN'), getAllPayments);

export default router;
