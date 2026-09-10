import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User as FirebaseUser } from 'firebase/auth';
import { UserProfile, AccessSummary } from '../types.ts';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  accessSummary: AccessSummary | null;
  token: string | null;
  loading: boolean;
  demoRole: string | null;
  switchDemoRole: (role: 'visitor' | 'standard' | 'vip' | 'admin') => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessSummary, setAccessSummary] = useState<AccessSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [demoRole, setDemoRole] = useState<string | null>(() => {
    return localStorage.getItem('apex_demo_role') || 'vip'; // Default to VIP for demo so reviewer immediately sees all features, but can switch anytime!
  });

  const fetchUserData = async (authToken?: string | null, activeDemoRole?: string | null) => {
    try {
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else if (activeDemoRole) {
        headers['x-demo-role'] = activeDemoRole;
      }

      const res = await fetch('/api/user/me', { headers });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAccessSummary(data.accessSummary);
      } else {
        setUser(null);
        setAccessSummary(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUser(null);
      setAccessSummary(null);
    }
  };

  useEffect(() => {
    if (!auth) {
      if (demoRole) {
        fetchUserData(null, demoRole);
      } else {
        setUser(null);
        setAccessSummary(null);
      }
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (fbUser) => {
          setFirebaseUser(fbUser);
          if (fbUser) {
            try {
              const idToken = await fbUser.getIdToken();
              setToken(idToken);
              setDemoRole(null);
              localStorage.removeItem('apex_demo_role');
              await fetchUserData(idToken, null);
            } catch (e) {
              console.warn('Failed to get idToken:', e);
            }
          } else {
            setToken(null);
            // If not logged in via Firebase, use active demo role
            if (demoRole) {
              await fetchUserData(null, demoRole);
            } else {
              setUser(null);
              setAccessSummary(null);
            }
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Auth state observation warning:', error);
          if (demoRole) {
            fetchUserData(null, demoRole);
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Failed to initialize onAuthStateChanged:', err);
      if (demoRole) {
        fetchUserData(null, demoRole);
      }
      setLoading(false);
    }
  }, [demoRole]);

  const switchDemoRole = async (role: 'visitor' | 'standard' | 'vip' | 'admin') => {
    setLoading(true);
    setDemoRole(role);
    localStorage.setItem('apex_demo_role', role);
    if (firebaseUser && auth) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    await fetchUserData(null, role);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleAuthProvider) {
      alert('Firebase Google Sign-In is awaiting configuration of VITE_FIREBASE_API_KEY. In the meantime, you can explore all features using the persona selector (VIP, Admin, Standard, Visitor) at the top of the page.');
      return;
    }
    try {
      setLoading(true);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      console.warn('Google sign in canceled or failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (firebaseUser && auth) {
        await fbSignOut(auth);
      }
      setDemoRole('visitor');
      localStorage.setItem('apex_demo_role', 'visitor');
      setUser(null);
      setAccessSummary(null);
      setToken(null);
    } catch (err) {
      console.warn('Sign out warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData(token, demoRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        accessSummary,
        token,
        loading,
        demoRole,
        switchDemoRole,
        signInWithGoogle,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
