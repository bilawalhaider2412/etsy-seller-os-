import React, { useState } from 'react';
import { CanvaIntegrationStatus } from '../../lib/canva/canva-types.ts';
import { canvaService } from '../../services/canva/canvaService.ts';
import {
  X,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Key,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CanvaConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: CanvaIntegrationStatus;
  workspaceId: string;
  onStatusChanged: (newStatus: CanvaIntegrationStatus) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CanvaConnectModal: React.FC<CanvaConnectModalProps> = ({
  isOpen,
  onClose,
  status,
  workspaceId,
  onStatusChanged,
  showToast,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnectCanva = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Fetch OAuth authorization URL from backend
      const { url } = await canvaService.getAuthUrl(workspaceId);

      // 2. Open official Canva OAuth popup directly (never container iframe route)
      const width = 640;
      const height = 740;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authWindow = window.open(
        url,
        'canva_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`
      );

      if (!authWindow) {
        throw new Error('Popup was blocked by your browser. Please allow popups to connect Canva.');
      }

      // 3. Listen for postMessage from callback handler
      const messageHandler = async (event: MessageEvent) => {
        // Validate origin or event type
        if (event.data?.type === 'CANVA_AUTH_SUCCESS') {
          window.removeEventListener('message', messageHandler);
          const updated = await canvaService.getStatus(workspaceId);
          onStatusChanged(updated);
          showToast('Canva account successfully connected!', 'success');
          setLoading(false);
          onClose();
        } else if (event.data?.type === 'CANVA_AUTH_ERROR') {
          window.removeEventListener('message', messageHandler);
          setErrorMsg(event.data.error || 'Canva authorization was cancelled or failed.');
          setLoading(false);
        }
      };

      window.addEventListener('message', messageHandler);

      // Fallback timer check in case postMessage is intercepted
      const checkTimer = setInterval(async () => {
        if (authWindow.closed) {
          clearInterval(checkTimer);
          const updated = await canvaService.getStatus(workspaceId);
          if (updated.canvaConnected) {
            onStatusChanged(updated);
            showToast('Canva connected!', 'success');
            onClose();
          }
          setLoading(false);
        }
      }, 1500);
    } catch (err: any) {
      console.error('Canva OAuth error:', err);
      setErrorMsg(err?.message || 'Failed to initiate Canva connection');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Canva from this workspace?')) return;
    setLoading(true);
    try {
      await canvaService.disconnect(workspaceId);
      const updated = await canvaService.getStatus(workspaceId);
      onStatusChanged(updated);
      showToast('Canva disconnected from workspace', 'info');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to disconnect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-lg">
              C
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white flex items-center gap-2">
                Canva Integration
                {status.canvaConnected ? (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                    Connected
                  </span>
                ) : (
                  <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                    Not Connected
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-500">Official Canva Connect API &amp; Design Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-stone-600 dark:text-stone-300">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Why Connect Canva to Etsy Seller OS?
            </h4>
            <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-400">
              Canva will be connected to Etsy Seller OS so you can create and manage supported designs from your seller dashboard. Our AI automatically generates Etsy-tailored headlines, dimensions, and image sequences, then launches Canva to customize your listing graphics.
            </p>
          </div>

          {/* Requested Scopes */}
          <div className="space-y-2">
            <span className="font-bold text-stone-800 dark:text-stone-200 text-xs uppercase tracking-wider">
              Requested Permissions:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Create &amp; edit designs</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Export Etsy graphics</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Upload product assets</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sync Brand Kit fonts &amp; colors</span>
              </div>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Zero Password Access &amp; Isolated Tokens</p>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed mt-0.5">
                We never store your Canva passwords or expose OAuth credentials to the browser. All token exchanges are securely executed server-side with workspace isolation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex items-center justify-between">
          <a
            href="https://www.canva.com/developers/"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1"
          >
            <span>Canva Developer Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex items-center gap-2">
            {status.canvaConnected ? (
              <>
                <button
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold text-xs transition-colors"
                >
                  Disconnect
                </button>
                <button
                  onClick={handleConnectCanva}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Reconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectCanva}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Connect Canva</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
