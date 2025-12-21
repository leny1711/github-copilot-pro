import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const {
      firstName,
      lastName,
      phoneNumber,
      profileImage,
      latitude,
      longitude,
      address,
      isAvailable,
      fcmToken,
    } = req.body;
    
    const updateData: any = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (address !== undefined) updateData.address = address;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (fcmToken !== undefined) updateData.fcmToken = fcmToken;
    
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        profileImage: true,
        latitude: true,
        longitude: true,
        address: true,
        rating: true,
        totalJobs: true,
        isAvailable: true,
      },
    });
    
    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Get available providers nearby
 */
export const getNearbyProviders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Latitude and longitude required' });
      return;
    }
    
    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const rad = parseFloat(radius as string);
    
    // Get all available providers (in real app, use proper geo queries)
    const providers = await prisma.user.findMany({
      where: {
        role: 'PROVIDER',
        isAvailable: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rating: true,
        totalJobs: true,
        latitude: true,
        longitude: true,
      },
    });
    
    // Filter by distance (simple calculation)
    const nearbyProviders = providers.filter((provider) => {
      if (!provider.latitude || !provider.longitude) return false;
      
      const distance = calculateDistance(
        lat,
        lon,
        provider.latitude,
        provider.longitude
      );
      
      return distance <= rad;
    });
    
    res.json({ providers: nearbyProviders });
  } catch (error) {
    console.error('Get nearby providers error:', error);
    res.status(500).json({ error: 'Failed to get nearby providers' });
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
