import { Router } from 'express';
import {
  createMission,
  getMissions,
  getMissionById,
  acceptMission,
  updateMissionStatus,
  getUserMissions,
} from '../controllers/missionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/missions
 * @desc    Create a new mission
 * @access  Private (Client)
 */
router.post('/', authenticate, authorize('CLIENT'), createMission);

/**
 * @route   GET /api/missions
 * @desc    Get all missions with filters
 * @access  Private
 */
router.get('/', authenticate, getMissions);

/**
 * @route   GET /api/missions/user
 * @desc    Get user's missions
 * @access  Private
 */
router.get('/user', authenticate, getUserMissions);

/**
 * @route   GET /api/missions/:id
 * @desc    Get mission by ID
 * @access  Private
 */
router.get('/:id', authenticate, getMissionById);

/**
 * @route   POST /api/missions/:id/accept
 * @desc    Accept a mission
 * @access  Private (Provider)
 */
router.post('/:id/accept', authenticate, authorize('PROVIDER'), acceptMission);

/**
 * @route   PATCH /api/missions/:id/status
 * @desc    Update mission status
 * @access  Private
 */
router.patch('/:id/status', authenticate, updateMissionStatus);

export default router;
