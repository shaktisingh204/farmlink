
'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const profile = { uid: user.uid, ...snapshot.val() };
            setUserProfile(profile);

            // Redirect logic after profile is loaded
            const isAuthPage = ['/farmer-login', '/retailer-login', '/market-login', '/admin-login',
                                '/farmer-register', '/retailer-register', '/market-register', '/admin-register'
                               ].includes(pathname);
            
            if (isAuthPage) {
                switch(profile.role) {
                    case 'farmer': router.replace('/farmer-dashboard'); break;
                    case 'retailer': router.replace('/retailer-dashboard'); break;
                    case 'market': router.replace('/local-market-dashboard'); break;
                    case 'admin': router.replace('/admin-dashboard'); break;
                    default: router.replace('/');
                }
            }
        } else {
            // User exists in auth but not in DB, log them out
            await signOut(auth);
            setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);
  
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
      // Let the onAuthStateChanged listener handle the redirect.
      toast({ title: 'Success', description: 'Your account has been created.' });
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
        // Let the onAuthStateChanged listener handle redirect.
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  }

  const value = { user, userProfile, loading, registerAndRedirect, loginAndRedirect, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
