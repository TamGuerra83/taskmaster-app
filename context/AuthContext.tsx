import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  user: string | null;
  signIn: (user: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const signIn = (username: string) => {
    setUser(username);
    router.replace('/(tabs)/home');
  };

  const signOut = () => {
    setUser(null);
    router.replace('/');
  };

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';
    
    if (!user && inAuthGroup) {
      router.replace('/');
    } else if (user && segments[0] === undefined) {
      router.replace('/(tabs)/home');
    }
  }, [user, segments]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};