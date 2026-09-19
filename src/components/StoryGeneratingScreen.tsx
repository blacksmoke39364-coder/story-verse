import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Wand2, Palette, Volume2, Stars } from 'lucide-react';

interface StoryGeneratingScreenProps {
  onComplete?: () => void;
  storyTitle?: string;
}

const STEPS = [
  { text: 'Writing your adventure...', icon: Wand2, tip: 'Weaving gentle rhymes and cozy story arcs...' },
  { text: 'Creating your characters...', icon: Stars, tip: 'Saving facial features and clothing to the Story Bible...' },
  { text: 'Painting your world...', icon: Palette, tip: 'Generating picture-book illustrations for each page...' },
  { text: 'Preparing the voices...', icon: Volume2, tip: 'Tuning Gemini natural narration speeds and friendly tones...' },
  { text: 'Opening your storybook...', icon: BookOpen, tip: 'Almost ready for bedtime wonder!' },
];

export const StoryGeneratingScreen: React.FC<StoryGeneratingScreenProps> = ({
  onComplete,
  storyTitle = 'Your New Bedtime Tale',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const currentStep = STEPS[currentStepIndex];
  const Icon = currentStep.icon;

  return (
    <div
      id="story-generating-screen"
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto"
    >
      {/* Magical Animated Book Illustration */}
      <div className="relative mb-8">
        {/* Ambient Glowing Halo */}
        <div className="absolute -inset-6 bg-gradient-to-r from-amber-400/40 via-orange-400/40 to-purple-400/40 rounded-full blur-2xl animate-pulse" />

        {/* Central Book Icon with Floating Sparkles */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 text-white flex items-center justify-center shadow-2xl shadow-orange-500/40 border-4 border-white dark:border-slate-800">
          <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 animate-bounce" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shadow-md animate-spin">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center shadow-md animate-pulse">
            <Stars className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Generating Step Message */}
      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif] mb-3 transition-all">
        {currentStep.text}
      </h2>

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mb-8 max-w-md">
        {currentStep.tip}
      </p>

      {/* Step Progression Indicators */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              idx === currentStepIndex
                ? 'w-8 bg-amber-500 shadow-xs'
                : idx < currentStepIndex
                ? 'w-4 bg-amber-300 dark:bg-amber-700'
                : 'w-4 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Reassurance Card */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Child Safety Filter & Story Bible active: Keeping characters perfectly consistent.</span>
      </div>
    </div>
  );
};
