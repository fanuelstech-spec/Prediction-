import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
  Smartphone,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export interface PaymentTarget {
  productId?: number;
  packageId?: number;
  name: string;
  amount: number;
  type: 'subscription' | 'pay_per_prediction';
  tier?: 'standard' | 'vip' | 'single';
}

interface PaymentModalProps {
  target: PaymentTarget | null;
  onClose: () => void;
  onSuccess: (packageId?: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ target, onClose, onSuccess }) => {
  const { token, demoRole, refreshUser } = useAuth();
  const [step, setStep] = useState<'ready' | 'initiating' | 'pending' | 'verifying' | 'success' | 'failed'>('ready');
  const [reference, setReference] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!target) return null;

  const handleInitiate = async () => {
    setStep('initiating');
    setErrorMessage(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      else if (demoRole) headers['x-demo-role'] = demoRole;

      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: target.productId,
          packageId: target.packageId,
          returnUrl: window.location.origin,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      setReference(data.reference);
      setCheckoutUrl(data.checkoutUrl);
      setIsMock(Boolean(data.isMock));
      setStep('pending');
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation error');
      setStep('failed');
    }
  };

  const handleVerify = async (forceSandbox = false) => {
    if (!reference) return;
    setStep('verifying');
    setErrorMessage(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      else if (demoRole) headers['x-demo-role'] = demoRole;

      let verifyUrl = `/api/payments/verify/${reference}`;
      if (forceSandbox) {
        verifyUrl += '?sandbox=true';
      }

      const res = await fetch(verifyUrl, { headers });
      const data = await res.json();

      if (data.verified && data.status === 'successful') {
        setStep('success');
        await refreshUser();
      } else {
        setErrorMessage(data.message || 'Payment has not been confirmed yet. Please try again.');
        setStep('pending');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification error');
      setStep('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Fapshi Secure Checkout</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Instant Server-Side Entitlement</p>
            </div>
          </div>
          <button
            id="close-payment-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Item Details Summary */}
          <div className="p-4 rounded-xl bg-neutral-950/90 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Product / Package:</span>
              <span className="text-white font-bold text-right">{target.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Access Category:</span>
              <span className="text-amber-400 font-mono uppercase font-semibold">
                {target.type === 'subscription' ? `${target.tier?.toUpperCase()} Subscription` : 'Single Ticket'}
              </span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Total Amount:</span>
              <span className="text-xl font-extrabold text-white font-mono">
                {target.amount.toLocaleString()} <span className="text-xs text-amber-400 font-sans">XAF</span>
              </span>
            </div>
          </div>

          {/* Supported Mobile Money Channels */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 font-mono">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> MTN MoMo &amp; Orange Money
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Visa / Mastercard
            </span>
          </div>

          {/* State: READY */}
          {step === 'ready' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400 leading-relaxed text-center">
                Clicking continue will initiate a secure transaction via Fapshi. You will receive an instant push prompt on your phone or card authorization.
              </p>

              <button
                id="btn-confirm-initiate-payment"
                onClick={handleInitiate}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Pay {target.amount.toLocaleString()} XAF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* State: INITIATING */}
          {step === 'initiating' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-white">Initiating transaction with Fapshi...</p>
              <p className="text-[11px] text-neutral-400 font-mono">Generating unique reference &amp; cryptographic hash</p>
            </div>
          )}

          {/* State: PENDING (Waiting for payment) */}
          {step === 'pending' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold font-mono">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  Transaction Reference: {reference}
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Status: Pending payment confirmation from provider
                </p>
              </div>

              {isMock ? (
                // Sandbox Simulation Mode (Allows instant verification & testing in the preview)
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Fapshi Sandbox Test Environment</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Live Fapshi credentials are using sandbox mode. Click below to simulate an approved payment callback from Fapshi to test server-side entitlement granting!
                  </p>
                  <button
                    id="btn-simulate-fapshi-success"
                    onClick={() => handleVerify(true)}
                    className="w-full py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful Mobile Money Approval</span>
                  </button>
                </div>
              ) : (
                // Live Fapshi Flow
                <div className="space-y-3">
                  {checkoutUrl && (
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Open Fapshi Payment Portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    id="btn-verify-live-payment"
                    onClick={() => handleVerify(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
                  >
                    Check Payment Status
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          {/* State: VERIFYING */}
          {step === 'verifying' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-white">Verifying payment with server...</p>
              <p className="text-[11px] text-neutral-400 font-mono">Granting entitlement and unlocking prediction packages</p>
            </div>
          )}

          {/* State: SUCCESS */}
          {step === 'success' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Payment Verified Successfully!</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Your access has been unlocked and active entitlement has been recorded on the database.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="btn-payment-success-continue"
                  onClick={() => {
                    onClose();
                    onSuccess(target.packageId);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide transition-colors"
                >
                  {target.packageId ? 'View Unlocked Prediction Now ➔' : 'Go to User Dashboard ➔'}
                </button>
              </div>
            </div>
          )}

          {/* State: FAILED */}
          {step === 'failed' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Transaction Failed or Cancelled</h4>
                <p className="text-xs text-red-300 mt-1">{errorMessage || 'Unable to complete payment transaction.'}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('ready')}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
