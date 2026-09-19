import React, { useState } from 'react';
import { ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';
import { AppView } from '../types';

interface ParentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctPin: string;
  onSuccess: () => void;
  targetViewAfterLogin?: AppView;
}

export const ParentLoginModal: React.FC<ParentLoginModalProps> = ({
  isOpen,
  onClose,
  correctPin,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          setTimeout(() => {
            onSuccess();
            setPin('');
            onClose();
          }, 200);
        } else {
          setTimeout(() => {
            setError('Incorrect PIN. (Default demo PIN is 1234)');
            setPin('');
          }, 300);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="parent-login-card"
        className="w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-700 shadow-2xl relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif] mb-1">
          Grown-Up Verification
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Enter parent PIN to manage reading limits, child profiles, and family privacy.
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all border-2 ${
                idx < pin.length
                  ? 'bg-amber-500 border-amber-500 scale-110'
                  : 'bg-transparent border-slate-300 dark:border-slate-600'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-500 mb-4 animate-shake">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 active:scale-95 text-xl font-extrabold text-slate-800 dark:text-slate-100 transition-all cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 active:scale-95 text-xl font-extrabold text-slate-800 dark:text-slate-100 transition-all cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            ⌫
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Demo Parent PIN: <strong>1234</strong></span>
        </div>
      </div>
    </div>
  );
};
