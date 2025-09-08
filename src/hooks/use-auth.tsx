
'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  registerAndRedirect: (email: string, password: string, name: string, role: string, dashboardPath: string) => Promise<void>;
  loginAndRedirect: (email: string, password: string, role: UserProfile['role'], loginPath: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    userProfile: null,
    loading: true,
    registerAndRedirect: async () => {},
    loginAndRedirect: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // fetch user profile
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            setUserProfile({ uid: user.uid, ...snapshot.val() });
        } else {
            setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const registerAndRedirect = async (email: string, password: string, name: string, role: string, dashboardPath: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        name: name,
        role: role,
        location: '',
      };
      await set(ref(db, 'users/' + user.uid), userProfileData);
      // The onAuthStateChanged listener will handle setting the user and profile state.
      // We just need to redirect.
      toast({ title: 'Success', description: 'Your account has been created.' });
      router.replace(dashboardPath);
  }

  const loginAndRedirect = async (email: string, password: string, role: UserProfile['role'], loginPath: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            await signOut(auth);
            throw new Error('User profile not found.');
        }

        const dbProfile = snapshot.val();
        if (dbProfile.role !== role) {
            await signOut(auth);
            throw new Error(`You are not authorized to access the ${role} portal.`);
        }
        // The onAuthStateChanged listener will handle setting the user and profile state.
        // We just need to redirect.
        router.replace(loginPath);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    router.push('/');
  }

  const value = { user, userProfile, loading, registerAndRedirect, loginAndRedirect, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
