
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../services/api';

type AuthContextType = {
  session: string | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as any);

export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setSession(token);
      setIsLoading(false);
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!session && !inAuthGroup) {
      router.replace('/'); 
    } else if (session && (inAuthGroup || segments.length === 0)) {
      router.replace('/(tabs)/home'); // Ir a Home
    }
  }, [session, isLoading, segments]);

  const signIn = async (email: string, pass: string) => {
    const data = await ApiService.login(email, pass);
    if (data.token) {
      setSession(data.token);
      await AsyncStorage.setItem('userToken', data.token);
      
      
      const idUsuario = data.userId || (data.user && data.user.id);
      if (idUsuario) await AsyncStorage.setItem('userId', idUsuario);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}