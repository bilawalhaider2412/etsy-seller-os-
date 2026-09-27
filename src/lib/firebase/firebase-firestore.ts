import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  limit,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, auth } from './firebase-client.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface UserProfileDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  updatedAt: any;
  onboardingCompleted: boolean;
  plan: 'Free' | 'Starter' | 'Pro' | 'Business';
  role: 'owner' | 'admin' | 'member';
  activeWorkspaceId: string;
}

export interface WorkspaceDoc {
  id: string;
  name: string;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
  subscriptionId?: string;
  plan: 'Free' | 'Starter' | 'Pro' | 'Business';
}

export interface ShopDoc {
  id: string;
  workspaceId: string;
  shopName: string;
  category: string;
  whatYouSell?: string;
  productType?: 'Digital' | 'Physical' | 'Both';
  targetMarket?: string;
  listingCount?: number;
  monthlySales?: string;
  primaryGoal?: string;
  etsyShopId?: string;
  etsyConnected: boolean;
  etsyConnectionStatus: 'connected' | 'disconnected' | 'pending';
  lastSync?: any;
  createdAt: any;
  updatedAt: any;
}

export interface ProductDoc {
  id: string;
  workspaceId: string;
  shopId?: string;
  ownerId: string;
  title: string;
  name?: string;
  category: string;
  productType: 'Digital' | 'Physical' | 'Print on Demand' | 'Pattern' | 'Template';
  price: number;
  currency: string;
  sku?: string;
  status: 'Idea' | 'Draft' | 'Ready' | 'Published' | 'Needs Optimization';
  seoScore: number;
  views?: number;
  favorites?: number;
  orders?: number;
  revenue?: number;
  conversionRate?: number;
  tags: string[];
  materials?: string[];
  description: string;
  notes?: string;
  imageUrl?: string;
  images?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface ListingDoc {
  id: string;
  workspaceId: string;
  productId?: string;
  shopId?: string;
  title: string;
  description: string;
  tags: string[];
  materials?: string[];
  price: number;
  seoScore: number;
  status: 'draft' | 'active' | 'inactive';
  createdAt: any;
  updatedAt: any;
  aiGenerated: boolean;
  aiLastUpdated?: any;
}

export interface ProductIdeaDoc {
  id: string;
  workspaceId: string;
  title: string;
  productName?: string;
  description: string;
  category: string;
  targetCustomer: string;
  keywords: string[];
  suggestedPrice: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  demandEstimate: 'High' | 'Very High' | 'Medium' | 'Low';
  competitionEstimate: 'Low' | 'Medium' | 'High';
  opportunityScore: number;
  differentiationAngle?: string;
  source: 'ai_brainstorm' | 'user';
  isAiEstimate: boolean;
  saved: boolean;
  createdAt: any;
}

export interface KeywordDoc {
  id: string;
  workspaceId: string;
  keyword: string;
  phrase?: string;
  category: string;
  source: 'ai_generator' | 'verified_etsy' | 'manual';
  relevanceScore: number;
  score?: number;
  intent: string;
  estimatedOpportunity: number;
  competition?: 'Low' | 'Medium' | 'High';
  tagsCount?: number;
  metricType: 'ai_estimate' | 'verified_source';
  saved: boolean;
  createdAt: any;
}

export interface AIGenerationDoc {
  id: string;
  workspaceId: string;
  userId: string;
  type: 'listing' | 'seo' | 'product_idea' | 'competitor_analysis' | 'customer_reply' | 'shop_audit' | 'copilot';
  prompt: string;
  result: any;
  model: string;
  tokensUsed: number;
  status: 'completed' | 'failed';
  createdAt: any;
}

export interface AuditLogDoc {
  id: string;
  workspaceId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: any;
  metadata?: any;
}

// 1. Get or Create User Profile & Workspace
export async function getOrCreateUserProfile(user: User): Promise<{
  profile: UserProfileDoc;
  workspace: WorkspaceDoc;
}> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  let defaultWorkspaceId = `ws_${user.uid.slice(0, 8)}`;

  if (snap.exists()) {
    const profile = snap.data() as UserProfileDoc;
    const wsRef = doc(db, 'workspaces', profile.activeWorkspaceId || defaultWorkspaceId);
    let wsSnap = await getDoc(wsRef);
    let workspace: WorkspaceDoc;

    if (!wsSnap.exists()) {
      workspace = {
        id: profile.activeWorkspaceId || defaultWorkspaceId,
        name: `${user.displayName || 'Seller'}'s Workspace`,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        plan: profile.plan || 'Pro',
      };
      await setDoc(wsRef, workspace);
    } else {
      workspace = wsSnap.data() as WorkspaceDoc;
    }

    return { profile, workspace };
  }

  // Create new user profile document
  const newProfile: UserProfileDoc = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Etsy Seller',
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    onboardingCompleted: true,
    plan: 'Pro',
    role: 'owner',
    activeWorkspaceId: defaultWorkspaceId,
  };

  await setDoc(userRef, newProfile);

  // Create initial workspace
  const workspaceRef = doc(db, 'workspaces', defaultWorkspaceId);
  const newWorkspace: WorkspaceDoc = {
    id: defaultWorkspaceId,
    name: `${newProfile.displayName}'s Workspace`,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    plan: 'Pro',
  };
  await setDoc(workspaceRef, newWorkspace);

  // Create workspace membership
  const memberRef = doc(db, 'workspaces', defaultWorkspaceId, 'members', user.uid);
  await setDoc(memberRef, {
    uid: user.uid,
    email: user.email,
    role: 'owner',
    joinedAt: serverTimestamp(),
  });

  // Seed default shop and products into Firestore
  await seedInitialWorkspaceData(defaultWorkspaceId, user.uid);

  return { profile: newProfile, workspace: newWorkspace };
}

// 2. Seed Initial Workspace Data (Shop, Products, Keywords)
export async function seedInitialWorkspaceData(workspaceId: string, userId: string) {
  try {
    // Seed default shop
    const shopRef = doc(db, 'workspaces', workspaceId, 'shops', 'shop_primary');
    await setDoc(shopRef, {
      id: 'shop_primary',
      workspaceId,
      shopName: 'Oak & Willow Craft Co.',
      category: 'Handmade Crafts & Patterns',
      whatYouSell: 'Crochet patterns, digital craft guides, and artisan pouch accessories',
      productType: 'Both',
      targetMarket: 'United States & UK Crafters',
      listingCount: 24,
      monthlySales: '$2,850/mo',
      primaryGoal: 'Get more sales',
      etsyShopId: 'oakandwillowco',
      etsyConnected: true,
      etsyConnectionStatus: 'connected',
      lastSync: new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Seed sample product
    const prodRef = doc(db, 'workspaces', workspaceId, 'products', 'prod_101');
    await setDoc(prodRef, {
      id: 'prod_101',
      workspaceId,
      ownerId: userId,
      title: 'Wildflower Meadow Zipper Pouch Sewing Pattern & Step-by-Step PDF Tutorial',
      category: 'Sewing & Patterns',
      productType: 'Pattern',
      price: 6.99,
      currency: 'USD',
      status: 'Needs Optimization',
      seoScore: 62,
      views: 1240,
      favorites: 142,
      orders: 28,
      revenue: 195.72,
      conversionRate: 2.25,
      tags: ['sewing pattern', 'zipper pouch', 'pdf tutorial', 'diy pouch pattern', 'craft pdf', 'handmade bag'],
      materials: ['PDF Digital Download', 'Pattern Sheets'],
      description: 'Step by step sewing instructions for a lined zipper pouch with boxed corners.',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Record audit log
    await recordAuditLog(workspaceId, userId, 'WORKSPACE_INITIALIZED', 'workspaces', workspaceId, {
      seededDemo: true,
    });
  } catch (err) {
    console.warn('Initial workspace seed error (non-fatal):', err);
  }
}

// 3. Products CRUD & Realtime Listener
export function subscribeToProducts(
  workspaceId: string,
  callback: (products: ProductDoc[]) => void
): Unsubscribe {
  const prodsRef = collection(db, 'workspaces', workspaceId, 'products');
  const q = query(prodsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ProductDoc[];
    callback(list);
  }, (err) => {
    console.warn('Product snapshot error:', err);
  });
}

export async function addFirestoreProduct(
  workspaceId: string,
  userId: string,
  product: Partial<ProductDoc>
): Promise<ProductDoc> {
  const prodId = product.id || `prod_${Date.now()}`;
  const prodRef = doc(db, 'workspaces', workspaceId, 'products', prodId);

  const newDoc: ProductDoc = {
    id: prodId,
    workspaceId,
    ownerId: userId,
    title: product.title || 'Untitled Product',
    category: product.category || 'General Crafts',
    productType: product.productType || 'Digital',
    price: product.price || 9.99,
    currency: 'USD',
    status: product.status || 'Draft',
    seoScore: product.seoScore || 80,
    tags: product.tags || [],
    materials: product.materials || [],
    description: product.description || '',
    notes: product.notes || '',
    imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    views: product.views || 0,
    favorites: product.favorites || 0,
    orders: product.orders || 0,
    revenue: product.revenue || 0,
    conversionRate: product.conversionRate || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(prodRef, newDoc);

  await recordAuditLog(workspaceId, userId, 'PRODUCT_CREATED', 'products', prodId, {
    title: newDoc.title,
  });

  return newDoc;
}

export async function updateFirestoreProduct(
  workspaceId: string,
  userId: string,
  productId: string,
  updates: Partial<ProductDoc>
): Promise<void> {
  const prodRef = doc(db, 'workspaces', workspaceId, 'products', productId);
  await updateDoc(prodRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  await recordAuditLog(workspaceId, userId, 'PRODUCT_UPDATED', 'products', productId);
}

export async function deleteFirestoreProduct(
  workspaceId: string,
  userId: string,
  productId: string
): Promise<void> {
  const prodRef = doc(db, 'workspaces', workspaceId, 'products', productId);
  await deleteDoc(prodRef);

  await recordAuditLog(workspaceId, userId, 'PRODUCT_DELETED', 'products', productId);
}

// 4. Shop Profile Management
export async function getFirestoreShop(workspaceId: string): Promise<ShopDoc | null> {
  const shopsRef = collection(db, 'workspaces', workspaceId, 'shops');
  const snap = await getDocs(shopsRef);
  if (!snap.empty) {
    return snap.docs[0].data() as ShopDoc;
  }
  return null;
}

export async function updateFirestoreShop(
  workspaceId: string,
  userId: string,
  shopUpdates: Partial<ShopDoc>
): Promise<void> {
  const shopRef = doc(db, 'workspaces', workspaceId, 'shops', 'shop_primary');
  await setDoc(shopRef, {
    id: 'shop_primary',
    workspaceId,
    ...shopUpdates,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await recordAuditLog(workspaceId, userId, 'SHOP_UPDATED', 'shops', 'shop_primary');
}

// 5. Keywords Management
export function subscribeToKeywords(
  workspaceId: string,
  callback: (keywords: KeywordDoc[]) => void
): Unsubscribe {
  const kwRef = collection(db, 'workspaces', workspaceId, 'keywords');
  const q = query(kwRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as KeywordDoc[];
    callback(list);
  }, (err) => {
    console.warn('Keyword snapshot error:', err);
  });
}

export async function saveFirestoreKeyword(
  workspaceId: string,
  userId: string,
  kw: { phrase: string; score: number; competition?: string; intent?: string }
): Promise<KeywordDoc> {
  const id = `kw_${Date.now()}`;
  const kwRef = doc(db, 'workspaces', workspaceId, 'keywords', id);

  const docData: KeywordDoc = {
    id,
    workspaceId,
    keyword: kw.phrase,
    phrase: kw.phrase,
    category: 'Etsy Keywords',
    source: 'ai_generator',
    relevanceScore: kw.score || 85,
    score: kw.score || 85,
    intent: kw.intent || 'High Commercial',
    estimatedOpportunity: kw.score || 85,
    competition: (kw.competition as any) || 'Medium',
    tagsCount: 13,
    metricType: 'ai_estimate',
    saved: true,
    createdAt: serverTimestamp(),
  };

  await setDoc(kwRef, docData);
  await recordAuditLog(workspaceId, userId, 'KEYWORD_SAVED', 'keywords', id, { keyword: kw.phrase });
  return docData;
}

export async function deleteFirestoreKeyword(
  workspaceId: string,
  keywordId: string
): Promise<void> {
  const kwRef = doc(db, 'workspaces', workspaceId, 'keywords', keywordId);
  await deleteDoc(kwRef);
}

// 6. Record Audit Logs (Append-Only)
export async function recordAuditLog(
  workspaceId: string,
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: any
): Promise<void> {
  try {
    const logRef = doc(collection(db, 'workspaces', workspaceId, 'auditLogs'));
    await setDoc(logRef, {
      id: logRef.id,
      workspaceId,
      userId,
      action,
      resource,
      resourceId: resourceId || '',
      timestamp: serverTimestamp(),
      metadata: metadata || {},
    });
  } catch (e) {
    console.warn('Audit log write error:', e);
  }
}

// 7. Track AI Generation & Usage in Firestore
export async function recordAIGeneration(
  workspaceId: string,
  userId: string,
  type: AIGenerationDoc['type'],
  prompt: string,
  result: any,
  model: string = 'gemini-3.8-flash'
): Promise<void> {
  try {
    const genRef = doc(collection(db, 'workspaces', workspaceId, 'aiGenerations'));
    await setDoc(genRef, {
      id: genRef.id,
      workspaceId,
      userId,
      type,
      prompt: prompt.slice(0, 500),
      result: typeof result === 'object' ? JSON.stringify(result).slice(0, 1000) : String(result).slice(0, 1000),
      model,
      tokensUsed: 420,
      status: 'completed',
      createdAt: serverTimestamp(),
    });

    // Update usage summary
    const today = new Date().toISOString().slice(0, 10);
    const usageRef = doc(db, 'workspaces', workspaceId, 'usage', `usage_${today}`);
    await setDoc(usageRef, {
      id: `usage_${today}`,
      date: today,
      userId,
      feature: type,
      generationCount: 1,
      totalTokens: 420,
      createdAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('AI generation log write error:', e);
  }
}
