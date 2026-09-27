import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  sendResetPassword,
} from '../../lib/firebase/firebase-auth.ts';
import {
  Sparkles,
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser, showToast, setActiveTab } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isForgot) {
        if (!email.trim()) {
          throw new Error('Please enter your email address to reset password');
        }
        await sendResetPassword(email.trim());
        showToast(`Firebase password reset link sent to ${email}!`, 'info');
        setIsForgot(false);
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const user = await signUpWithEmail(email.trim(), password, name.trim());
        setUser({
          email: user.email || email,
          name: user.displayName || name || 'Etsy Seller',
        });
        showToast('Firebase account created! Verification email dispatched.');
      } else {
        const user = await signInWithEmail(email.trim(), password);
        setUser({
          email: user.email || email,
          name: user.displayName || email.split('@')[0] || 'Shop Owner',
        });
        showToast('Signed in successfully with Firebase Auth!');
      }

      setIsAuthModalOpen(false);
      setActiveTab('overview');
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let msg = err.message || 'Authentication failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password must be at least 6 characters.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      setUser({
        email: user.email || 'google_user@etsy.com',
        name: user.displayName || 'Google Seller',
      });
      setIsAuthModalOpen(false);
      setActiveTab('overview');
      showToast('Authenticated via Google OAuth!');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err.message || 'Google sign-in error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setUser({ email: 'jamrudkhan23@gmail.com', name: 'Jamrud (Shop Owner)' });
    setIsAuthModalOpen(false);
    setActiveTab('overview');
    showToast('Loaded demo store: Oak & Willow Craft Co.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-xs">
        {/* Top Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                {isForgot ? 'Reset Password' : isSignUp ? 'Create Firebase Account' : 'Welcome to Seller OS'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isForgot
                  ? 'We will send a secure recovery link via Firebase'
                  : isSignUp
                  ? 'Sign up with Firebase Authentication'
                  : 'Sign in to sync your Etsy workspace'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Error Message banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 font-bold flex items-center justify-center gap-2.5 transition-all text-stone-800 dark:text-stone-200 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-stone-200 dark:border-stone-800" />
            <span className="px-3 text-[10px] text-stone-600 dark:text-stone-300 uppercase tracking-wider font-semibold">
              or email &amp; password
            </span>
            <div className="flex-1 border-t border-stone-200 dark:border-stone-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Shop / Seller Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@yourshop.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {!isForgot && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgot(true)}
                    className="text-[11px] text-amber-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Contacting Firebase...</span>
                </>
              ) : (
                <>
                  <span>{isForgot ? 'Send Reset Email' : isSignUp ? 'Register with Firebase' : 'Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign In Button */}
          <div className="pt-2">
            <button
              onClick={handleDemoSignIn}
              type="button"
              className="w-full py-2 px-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-semibold flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors text-[11px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Or Explore Demo Shop (1-Click)</span>
            </button>
          </div>

          {/* Toggle mode */}
          <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500">
            {isForgot ? (
              <button
                type="button"
                onClick={() => setIsForgot(false)}
                className="text-amber-600 hover:underline font-semibold"
              >
                Back to Sign In
              </button>
            ) : isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-amber-600 hover:underline font-semibold"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-amber-600 hover:underline font-semibold"
                >
                  Sign up free
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
