export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  profileImage?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  rating?: number;
  totalJobs?: number;
  isAvailable?: boolean;
  createdAt: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  isUrgent: boolean;
  latitude: number;
  longitude: number;
  address: string;
  estimatedPrice: number;
  finalPrice?: number;
  commission?: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  clientId: string;
  providerId?: string;
  client?: User;
  provider?: User;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  content: string;
  missionId: string;
  senderId: string;
  receiverId: string;
  sender?: User;
  receiver?: User;
  isRead: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  commission: number;
  providerAmount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  missionId: string;
  mission?: Mission;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}
