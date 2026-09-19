import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Heart,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import { AppView } from '../types';

interface PrivacySafetyCenterProps {
  setCurrentView: (view: AppView) => void;
  onClearLocalData: () => void;
}

export const PrivacySafetyCenter: React.FC<PrivacySafetyCenterProps> = ({
  setCurrentView,
  onClearLocalData,
}) => {
  return (
    <div id="privacy-safety-center" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 text-left">
      <button
        onClick={() => setCurrentView('parent_dashboard')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Parent Dashboard</span>
      </button>

      {/* Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Trust & Protection
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-['Shantell_Sans',sans-serif]">
            Child Safety & Family Privacy Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            StoryVerse is engineered from the ground up to protect children's emotional wellbeing and data privacy.
          </p>
        </div>
      </div>

      {/* 5-Layer Safety Pipeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
          Our Multi-Layer Safety Architecture
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Pre-Generation Input Filter
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Before sending prompts to Gemini, all user typed and voice inputs are verified against safety taxonomies to block violent, frightening, or inappropriate themes.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Story World & Story Bible Boundary Constraints
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Every generated adventure is bound to a strict Story Bible that forbids weapons, real-world distress, darkness trauma, or menacing antagonists.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Age-Appropriate Vocabulary Pacing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Sentence structures and lexical complexity are calibrated to the child's registered age bracket (3-5 rhyme, 6-8 early reader, 9-12 chapter builder).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Restricted Role-Based Companion (No Open Chatbots)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Children are never given an unrestricted LLM prompt box. The AI Story Owl only answers questions about the current storybook, explains words, or shares cozy bedtime riddles.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex items-start gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
              5
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Post-Generation Content Audit
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Generated page text and illustration prompts pass an automated safety audit before rendering onto the child's screen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Commitments */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
          Family Privacy Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Third-Party Advertisements</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Selling of Children's Information</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Parent-Controlled PIN Authorization</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strict COPPA & International Child Compliance</span>
          </div>
        </div>
      </div>

      {/* Data Management & Deletion */}
      <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-rose-900 dark:text-rose-200">
            Clear Local Family Reading History
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300">
            Permanently deletes custom saved stories and resets reading minutes.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset custom reading history and restore demo stories?')) {
              onClearLocalData();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Data</span>
        </button>
      </div>
    </div>
  );
};
