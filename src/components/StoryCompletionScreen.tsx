import React from 'react';
import {
  Sparkles,
  Trophy,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Heart,
  Star,
  Compass,
} from 'lucide-react';
import { Story } from '../types';

interface StoryCompletionScreenProps {
  story: Story;
  onStartLearning: () => void;
  onReadAgain: () => void;
  onGoHome: () => void;
}

export const StoryCompletionScreen: React.FC<StoryCompletionScreenProps> = ({
  story,
  onStartLearning,
  onReadAgain,
  onGoHome,
}) => {
  return (
    <div
      id="story-completion-screen"
      className="max-w-2xl mx-auto px-4 py-10 sm:py-16 text-center space-y-8"
    >
      {/* Celebration Icon with Animated Badge */}
      <div className="relative inline-block">
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 text-white flex items-center justify-center shadow-xl mx-auto border-4 border-white dark:border-slate-800">
          <Trophy className="w-12 h-12 sm:w-14 sm:h-14 animate-bounce" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-amber-900 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Adventure Accomplished</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
          Hooray! You Finished <br />
          <span className="text-amber-500">"{story.title}"</span>!
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
          You listened attentively, made brave choices, and brought your bedtime world to a peaceful, cozy close.
        </p>
      </div>

      {/* Story Summary Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm text-left flex items-center gap-5">
        <img
          src={story.cover_image}
          alt={story.title}
          className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0"
          referrerPolicy="no-referrer"
        />
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Bedtime Milestone
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
            {story.pages.length} Pages Explored • {story.theme} Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Added to your Bedtime Bookshelf with full narration and illustrations.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        {story.learning_activity && (
          <button
            id="start-learning-activity-btn"
            onClick={onStartLearning}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-base shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-['Shantell_Sans',sans-serif]"
          >
            <Sparkles className="w-5 h-5" />
            <span>Play Learning Activity</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onReadAgain}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm border-2 border-amber-200 dark:border-slate-700 hover:bg-amber-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Read Again</span>
        </button>

        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-sm border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};
