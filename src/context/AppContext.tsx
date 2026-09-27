import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppTab,
  ShopProfile,
  ProductItem,
  SavedKeyword,
  UserSubscription,
  ToastMessage,
} from '../types/index.ts';
import { api } from '../services/api.ts';
import { User } from 'firebase/auth';
import {
  subscribeToAuthState,
  signOutUser,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  sendResetPassword,
} from '../lib/firebase/firebase-auth.ts';
import {
  getOrCreateUserProfile,
  subscribeToProducts,
  subscribeToKeywords,
  addFirestoreProduct,
  updateFirestoreProduct,
  deleteFirestoreProduct,
  saveFirestoreKeyword,
  deleteFirestoreKeyword,
  updateFirestoreShop,
  getFirestoreShop,
} from '../lib/firebase/firebase-firestore.ts';

// Helper to attach .name to Firebase User instance for display compatibility
export function enrichFirebaseUser(fbUser: User | null): (User & { name: string }) | null {
  if (!fbUser) return null;
  const name = fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Shop Owner');
  try {
    Object.defineProperty(fbUser, 'name', {
      value: name,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } catch {
    (fbUser as any).name = name;
  }
  return fbUser as User & { name: string };
}

// -------------------------------------------------------------
// Authentication Context Definition & Hook
// -------------------------------------------------------------
export interface AuthContextType {
  user: (User & { name: string }) | null;
  firebaseUser: User | null;
  loading: boolean;
  authLoading: boolean;
  activeWorkspaceId: string;
  setUser: (u: any) => void;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<User>;
  sendResetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider or AppProvider');
  }
  return context;
};

// Internal provider that runs Firebase Auth listeners and state persistence
const AuthStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Replace static local auth logic with a null initial state that synchronizes with Firebase Auth
  const [user, setUser] = useState<(User & { name: string }) | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws_default');

  useEffect(() => {
    // Listen for auth state changes from Firebase to persist session across reloads
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        const enriched = enrichFirebaseUser(fbUser);
        setUser(enriched);
        setFirebaseUser(fbUser);

        try {
          const { workspace } = await getOrCreateUserProfile(fbUser);
          if (workspace?.id) {
            setActiveWorkspaceId(workspace.id);
          }
        } catch (e) {
          console.warn('Firebase user profile bootstrap notice:', e);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
        setActiveWorkspaceId('ws_default');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Signout notice:', e);
    }
    setUser(null);
    setFirebaseUser(null);
    setActiveWorkspaceId('ws_default');
  };

  const handleSetUser = (u: any) => {
    if (!u) {
      setUser(null);
      setFirebaseUser(null);
      return;
    }
    if (!u.name) {
      u.name = u.displayName || (u.email ? u.email.split('@')[0] : 'Shop Owner');
    }
    setUser(u);
    if (u.uid && typeof u.getIdToken === 'function') {
      setFirebaseUser(u);
    }
  };

  const authValue: AuthContextType = {
    user,
    firebaseUser,
    loading,
    authLoading: loading,
    activeWorkspaceId,
    setUser: handleSetUser,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendResetPassword,
    logout,
    signOut: logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const existing = useContext(AuthContext);
  if (existing) {
    return <>{children}</>;
  }
  return <AuthStateProvider>{children}</AuthStateProvider>;
};

// -------------------------------------------------------------
// Application Context Definition & Provider
// -------------------------------------------------------------
export interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  shopProfile: ShopProfile | null;
  updateShopProfile: (updates: Partial<ShopProfile>) => Promise<void>;
  products: ProductItem[];
  refreshProducts: () => Promise<void>;
  addProduct: (product: Partial<ProductItem>) => Promise<ProductItem>;
  updateProduct: (id: string, updates: Partial<ProductItem>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  savedKeywords: SavedKeyword[];
  saveKeyword: (phrase: string, score: number, competition: any, intent: string) => Promise<void>;
  deleteKeyword: (id: string) => Promise<void>;
  subscription: UserSubscription | null;
  upgradePlan: (plan: 'Free' | 'Starter' | 'Pro' | 'Business') => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isBillingOpen: boolean;
  setIsBillingOpen: (open: boolean) => void;
  isEtsyModalOpen: boolean;
  setIsEtsyModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  user: (User & { name: string }) | { email: string; name: string; uid?: string } | null;
  firebaseUser: User | null;
  authLoading: boolean;
  activeWorkspaceId: string;
  setUser: (u: any) => void;
  logout: () => void;
  prefillListingData: any;
  setPrefillListingData: (data: any) => void;
  prefillOptimizerData: any;
  setPrefillOptimizerData: (data: any) => void;
  prefillKeywordQuery: string;
  setPrefillKeywordQuery: (query: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    firebaseUser,
    authLoading,
    activeWorkspaceId,
    setUser,
    logout: authLogout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [shopProfile, setShopProfile] = useState<ShopProfile | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [savedKeywords, setSavedKeywords] = useState<SavedKeyword[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isEtsyModalOpen, setIsEtsyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [prefillListingData, setPrefillListingData] = useState<any>(null);
  const [prefillOptimizerData, setPrefillOptimizerData] = useState<any>(null);
  const [prefillKeywordQuery, setPrefillKeywordQuery] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 1. Initial baseline API load
  useEffect(() => {
    async function loadData() {
      try {
        const [profData, prodsData, kwData, subData] = await Promise.all([
          api.getProfile(),
          api.getProducts(),
          api.getKeywords(),
          api.getSubscription(),
        ]);
        setShopProfile(profData.profile);
        setProducts(prodsData.products);
        setSavedKeywords(kwData.keywords);
        setSubscription(subData.subscription);
      } catch (e) {
        console.warn('Initial data load:', e);
      }
    }
    loadData();
  }, []);

  // 2. Synchronize workspace & shop profile when user authenticates
  useEffect(() => {
    if (!firebaseUser || !activeWorkspaceId) return;

    let isMounted = true;
    getFirestoreShop(activeWorkspaceId)
      .then((firestoreShop) => {
        if (firestoreShop && isMounted) {
          setShopProfile((prev: any) => ({
            ...prev,
            ...firestoreShop,
          }));
        }
      })
      .catch((err) => {
        console.warn('Shop fetch notice:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [firebaseUser, activeWorkspaceId]);

  // 3. Realtime Firestore Listeners for Products & Keywords
  useEffect(() => {
    if (!activeWorkspaceId || activeWorkspaceId === 'ws_default') return;

    // Listen to Products in real-time
    const unsubProds = subscribeToProducts(activeWorkspaceId, (firestoreProds) => {
      if (firestoreProds && firestoreProds.length > 0) {
        setProducts(firestoreProds.map((p: any) => ({
          ...p,
          title: p.title || p.name || 'Untitled Product',
          productType: p.productType || 'Digital',
          price: Number(p.price) || 9.99,
          status: p.status || 'Draft',
          seoScore: p.seoScore || 80,
          tags: p.tags || [],
          description: p.description || '',
          updatedAt: p.updatedAt ? new Date(p.updatedAt.toDate ? p.updatedAt.toDate() : p.updatedAt).toISOString() : new Date().toISOString(),
          createdAt: p.createdAt ? new Date(p.createdAt.toDate ? p.createdAt.toDate() : p.createdAt).toISOString() : new Date().toISOString(),
        })));
      }
    });

    // Listen to Keywords in real-time
    const unsubKws = subscribeToKeywords(activeWorkspaceId, (firestoreKws) => {
      if (firestoreKws && firestoreKws.length > 0) {
        setSavedKeywords(firestoreKws.map((k: any) => ({
          id: k.id,
          phrase: k.phrase || k.keyword,
          score: k.score || k.relevanceScore || 85,
          competition: k.competition || 'Medium',
          intent: k.intent || 'High Commercial',
          tagsCount: k.tagsCount || 13,
          addedAt: k.createdAt ? new Date(k.createdAt.toDate ? k.createdAt.toDate() : k.createdAt).toISOString() : new Date().toISOString(),
        })));
      }
    });

    return () => {
      unsubProds();
      unsubKws();
    };
  }, [activeWorkspaceId]);

  const updateShopProfile = async (updates: Partial<ShopProfile>) => {
    try {
      const res = await api.updateProfile(updates);
      setShopProfile(res.profile);

      // Persist to Firestore
      if (firebaseUser) {
        await updateFirestoreShop(activeWorkspaceId, firebaseUser.uid, updates as any);
      }

      showToast('Shop profile updated and synced with Firebase!');
    } catch (e: any) {
      showToast(e.message || 'Failed to update profile', 'error');
    }
  };

  const refreshProducts = async () => {
    try {
      const res = await api.getProducts();
      setProducts(res.products);
    } catch (e) {
      console.error(e);
    }
  };

  const addProduct = async (product: Partial<ProductItem>): Promise<ProductItem> => {
    const res = await api.createProduct(product);
    setProducts((prev) => [res.product, ...prev]);

    if (firebaseUser) {
      try {
        await addFirestoreProduct(activeWorkspaceId, firebaseUser.uid, {
          ...res.product,
          workspaceId: activeWorkspaceId,
        });
      } catch (err) {
        console.warn('Firestore product add fallback:', err);
      }
    }

    showToast(`Added "${res.product.title.slice(0, 30)}..." to Product Library`);
    return res.product;
  };

  const updateProduct = async (id: string, updates: Partial<ProductItem>) => {
    const res = await api.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? res.product : p)));

    if (firebaseUser) {
      try {
        await updateFirestoreProduct(activeWorkspaceId, firebaseUser.uid, id, updates as any);
      } catch (err) {
        console.warn('Firestore product update fallback:', err);
      }
    }

    showToast('Product updated successfully!');
  };

  const deleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (firebaseUser) {
      try {
        await deleteFirestoreProduct(activeWorkspaceId, firebaseUser.uid, id);
      } catch (err) {
        console.warn('Firestore product delete fallback:', err);
      }
    }

    showToast('Product removed from library', 'info');
  };

  const saveKeyword = async (phrase: string, score: number, competition: any, intent: string) => {
    const res = await api.saveKeyword({ phrase, score, competition, intent });
    setSavedKeywords((prev) => [res.keyword, ...prev]);

    if (firebaseUser) {
      try {
        await saveFirestoreKeyword(activeWorkspaceId, firebaseUser.uid, {
          phrase,
          score,
          competition,
          intent,
        });
      } catch (err) {
        console.warn('Firestore keyword save fallback:', err);
      }
    }

    showToast(`Saved keyword: "${phrase}"`);
  };

  const deleteKeyword = async (id: string) => {
    await api.deleteKeyword(id);
    setSavedKeywords((prev) => prev.filter((k) => k.id !== id));

    if (firebaseUser) {
      try {
        await deleteFirestoreKeyword(activeWorkspaceId, id);
      } catch (err) {
        console.warn('Firestore keyword delete fallback:', err);
      }
    }

    showToast('Keyword removed', 'info');
  };

  const upgradePlan = async (plan: 'Free' | 'Starter' | 'Pro' | 'Business') => {
    const res = await api.updateSubscription(plan);
    setSubscription(res.subscription);
    showToast(`Switched plan to ${plan}!`);
  };

  const logout = async () => {
    await authLogout();
    setActiveTab('landing');
    showToast('Signed out of Firebase session', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        shopProfile,
        updateShopProfile,
        products,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        savedKeywords,
        saveKeyword,
        deleteKeyword,
        subscription,
        upgradePlan,
        theme,
        toggleTheme,
        toasts,
        showToast,
        isCopilotOpen,
        setIsCopilotOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isBillingOpen,
        setIsBillingOpen,
        isEtsyModalOpen,
        setIsEtsyModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        firebaseUser,
        authLoading,
        activeWorkspaceId,
        setUser,
        logout,
        prefillListingData,
        setPrefillListingData,
        prefillOptimizerData,
        setPrefillOptimizerData,
        prefillKeywordQuery,
        setPrefillKeywordQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AppProviderInner>{children}</AppProviderInner>
    </AuthProvider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
