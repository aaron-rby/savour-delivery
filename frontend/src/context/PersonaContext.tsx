'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { INITIAL_USERS } from '@/lib/demoData';

interface PersonaContextType {
  activeUser: User;
  setPersona: (userId: number) => void;
  allPersonas: User[];
  isMounted: boolean;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  // Always default to INITIAL_USERS[0] ('Alex Chen') for deterministic SSR match
  const [activeUser, setActiveUser] = useState<User>(INITIAL_USERS[0]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedId = localStorage.getItem('savour_active_user_id');
      if (savedId) {
        const found = INITIAL_USERS.find(u => u.userId === parseInt(savedId, 10));
        if (found) {
          setActiveUser(found);
        }
      }
    } catch {
      // LocalStorage access may fail in strict private browsing environments
    }
  }, []);

  const setPersona = (userId: number) => {
    const found = INITIAL_USERS.find(u => u.userId === userId);
    if (found) {
      setActiveUser(found);
      try {
        localStorage.setItem('savour_active_user_id', userId.toString());
      } catch {
        // Ignore storage errors
      }
    }
  };

  return (
    <PersonaContext.Provider value={{ activeUser, setPersona, allPersonas: INITIAL_USERS, isMounted }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
