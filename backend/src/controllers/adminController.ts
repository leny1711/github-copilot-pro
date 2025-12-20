import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Get admin dashboard statistics
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalClients,
      totalProviders,
      totalMissions,
      pendingMissions,
      completedMissions,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'PROVIDER' } }),
      prisma.mission.count(),
      prisma.mission.count({ where: { status: 'PENDING' } }),
      prisma.mission.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { commission: true },
      }),
    ]);
    
    res.json({
      stats: {
        users: {
          total: totalUsers,
          clients: totalClients,
          providers: totalProviders,
        },
        missions: {
          total: totalMissions,
          pending: pendingMissions,
          completed: completedMissions,
        },
        revenue: {
          totalCommission: totalRevenue._sum.commission || 0,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (role) {
      where.role = role;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          rating: true,
          totalJobs: true,
          isAvailable: true,
          createdAt: true,
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    
    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

/**
 * Get all missions (admin only)
 */
export const getAllMissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [missions, total] = await Promise.all([
      prisma.mission.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          payment: true,
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.mission.count({ where }),
    ]);
    
    res.json({
      missions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all missions error:', error);
    res.status(500).json({ error: 'Failed to get missions' });
  }
};

/**
 * Get all payments (admin only)
 */
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (status) {
      where.status = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          mission: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);
    
    res.json({
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  }
};
