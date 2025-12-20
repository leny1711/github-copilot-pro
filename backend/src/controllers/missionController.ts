import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendPushNotification } from '../config/firebase';
import { config } from '../config';

/**
 * Create a new mission
 */
export const createMission = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const {
      title,
      description,
      category,
      isUrgent,
      latitude,
      longitude,
      address,
      estimatedPrice,
    } = req.body;
    
    // Calculate commission
    const commission = estimatedPrice * config.admin.commissionRate;
    
    // Create mission
    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        category,
        isUrgent: isUrgent || false,
        latitude,
        longitude,
        address,
        estimatedPrice,
        commission,
        clientId: req.user.userId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });
    
    res.status(201).json({
      message: 'Mission created successfully',
      mission,
    });
  } catch (error) {
    console.error('Create mission error:', error);
    res.status(500).json({ error: 'Failed to create mission' });
  }
};

/**
 * Get all missions (with filters)
 */
export const getMissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, category, isUrgent } = req.query;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (isUrgent !== undefined) {
      where.isUrgent = isUrgent === 'true';
    }
    
    const missions = await prisma.mission.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rating: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json({ missions });
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({ error: 'Failed to get missions' });
  }
};

/**
 * Get a specific mission by ID
 */
export const getMissionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            rating: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            rating: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }
    
    res.json({ mission });
  } catch (error) {
    console.error('Get mission error:', error);
    res.status(500).json({ error: 'Failed to get mission' });
  }
};

/**
 * Accept a mission (Provider only)
 */
export const acceptMission = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const { id } = req.params;
    
    // Check if mission exists and is pending
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });
    
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }
    
    if (mission.status !== 'PENDING') {
      res.status(400).json({ error: 'Mission is not available' });
      return;
    }
    
    // Update mission
    const updatedMission = await prisma.mission.update({
      where: { id },
      data: {
        providerId: req.user.userId,
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
      include: {
        client: true,
        provider: true,
      },
    });
    
    // Send notification to client
    if (mission.client.fcmToken) {
      await sendPushNotification(
        mission.client.fcmToken,
        'Mission Accepted',
        `Your mission "${mission.title}" has been accepted`,
        { missionId: mission.id }
      );
    }
    
    res.json({
      message: 'Mission accepted successfully',
      mission: updatedMission,
    });
  } catch (error) {
    console.error('Accept mission error:', error);
    res.status(500).json({ error: 'Failed to accept mission' });
  }
};

/**
 * Update mission status
 */
export const updateMissionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        client: true,
        provider: true,
      },
    });
    
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }
    
    // Authorization check
    if (mission.clientId !== req.user.userId && mission.providerId !== req.user.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }
    
    const updateData: any = { status };
    
    if (status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
      
      // Update provider stats
      if (mission.providerId) {
        await prisma.user.update({
          where: { id: mission.providerId },
          data: {
            totalJobs: { increment: 1 },
          },
        });
      }
    }
    
    const updatedMission = await prisma.mission.update({
      where: { id },
      data: updateData,
    });
    
    // Send notification
    const recipientToken = mission.clientId === req.user.userId
      ? mission.provider?.fcmToken
      : mission.client.fcmToken;
    
    if (recipientToken) {
      await sendPushNotification(
        recipientToken,
        'Mission Status Updated',
        `Mission "${mission.title}" is now ${status}`,
        { missionId: mission.id }
      );
    }
    
    res.json({
      message: 'Mission updated successfully',
      mission: updatedMission,
    });
  } catch (error) {
    console.error('Update mission error:', error);
    res.status(500).json({ error: 'Failed to update mission' });
  }
};

/**
 * Get user's missions (as client or provider)
 */
export const getUserMissions = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const { role } = req.query;
    
    const where: any = {};
    
    if (role === 'client') {
      where.clientId = req.user.userId;
    } else if (role === 'provider') {
      where.providerId = req.user.userId;
    } else {
      // Get both
      where.OR = [
        { clientId: req.user.userId },
        { providerId: req.user.userId },
      ];
    }
    
    const missions = await prisma.mission.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rating: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json({ missions });
  } catch (error) {
    console.error('Get user missions error:', error);
    res.status(500).json({ error: 'Failed to get missions' });
  }
};
