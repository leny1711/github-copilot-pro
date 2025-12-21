import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types';
import apiService from '../services/api';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await apiService.login(email, password);
      
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: string;
  }) => {
    try {
      const response: AuthResponse = await apiService.register(data);
      
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
