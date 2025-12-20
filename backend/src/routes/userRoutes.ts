import { Router } from 'express';
import { updateProfile, getNearbyProviders } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   PATCH /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/profile', authenticate, updateProfile);

/**
 * @route   GET /api/users/nearby-providers
 * @desc    Get nearby available providers
 * @access  Private
 */
router.get('/nearby-providers', authenticate, getNearbyProviders);

export default router;
