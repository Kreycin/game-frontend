import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserProfile {
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: number, username: string) => {
    try {
      const profileDocRef = doc(db, 'userProfiles', userId.toString());
      const profileSnap = await getDoc(profileDocRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as UserProfile);
      } else {
        setProfile({ displayName: username });
      }
    } catch (error) {
      console.error("Failed to fetch Firebase profile", error);
      setProfile({ displayName: username }); // Fallback profile
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const { data: userData } = await axios.get(`${API_ENDPOINT}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userData);
          await fetchProfile(userData.id, userData.username);
        } catch (error) {
          console.error("Failed to verify token", error);
          localStorage.removeItem('jwt');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [fetchProfile]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('jwt', token);
    setUser(userData);
    fetchProfile(userData.id, userData.username);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    setProfile(null);
    window.location.href = '/'; // Reload to clear all states
  };

  const refetchProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, user.username);
    }
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, isLoggedIn: !!user, loading, login, logout, refetchProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};