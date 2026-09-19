import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Star,
  Award,
  Volume2,
  Smile,
  Heart,
  RotateCcw,
} from 'lucide-react';
import { LearningActivity, Story } from '../types';
import { playWebSpeech } from '../utils/audio';

interface LearningActivityScreenProps {
  story: Story;
  onFinish: () => void;
  onBackToStory: () => void;
}

export const LearningActivityScreen: React.FC<LearningActivityScreenProps> = ({
  story,
  onFinish,
  onBackToStory,
}) => {
  const activity = story.learning_activity;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [starsEarned, setStarsEarned] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'quiz' | 'vocab' | 'reflection'>('quiz');

  if (!activity) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <p className="text-slate-600">No learning activity generated for this story.</p>
        <button
          onClick={onFinish}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const handleSelectOption = (questionId: string, optionIndex: number, correctIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    if (optionIndex === correctIndex) {
      setStarsEarned((prev) => prev + 1);
    }
  };

  const handleSpeakWord = (word: string, definition: string) => {
    playWebSpeech(`${word}. ${definition}`, story.language || 'en', 0.95);
  };

  const totalQuestions = activity.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div id="learning-activity-container" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-100 via-orange-50 to-pink-100 dark:from-slate-800 dark:to-slate-850 border-2 border-amber-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            🌱
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Playful Learning Moment
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
              Explore "{story.title}"
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Gentle questions and new words that make reading fun!
            </p>
          </div>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 shadow-xs">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-spin" />
          <span className="font-extrabold text-sm text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
            {starsEarned} / {totalQuestions} Stars
          </span>
        </div>
      </div>

      {/* Tabs: Quiz, Vocabulary Cards, Cozy Reflection */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700 hover:bg-amber-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Story Questions</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'vocab'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700 hover:bg-amber-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>New Words ({activity.vocabWords?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('reflection')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reflection'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700 hover:bg-amber-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Bedtime Reflection</span>
        </button>
      </div>

      {/* TAB 1: Story Questions */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {activity.questions.map((q, qIndex) => {
            const selectedOpt = selectedAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm space-y-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-slate-700 text-amber-800 dark:text-amber-200 font-extrabold text-xs flex items-center justify-center">
                      {qIndex + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                      {q.skillType}
                    </span>
                  </div>
                  {isAnswered && (
                    <span
                      className={`text-xs font-black flex items-center gap-1 ${
                        isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
                      }`}
                    >
                      {isCorrect ? '🌟 Super Job!' : '🌱 Great Try!'}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isPicked = selectedOpt === optIdx;
                    const isRightOption = optIdx === q.correctIndex;

                    let btnStyle = 'bg-amber-50/40 dark:bg-slate-800 border-amber-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400';
                    if (isAnswered) {
                      if (isRightOption) {
                        btnStyle = 'bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-black';
                      } else if (isPicked && !isRightOption) {
                        btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-200 opacity-70';
                      } else {
                        btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                        className={`p-3.5 rounded-2xl text-left border-2 font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isRightOption && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    💡 <strong>Story Hint:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Vocabulary Cards */}
      {activeTab === 'vocab' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {activity.vocabWords?.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-amber-600 dark:text-amber-400 font-['Shantell_Sans',sans-serif]">
                  {item.word}
                </h3>
                <button
                  onClick={() => handleSpeakWord(item.word, item.definition)}
                  className="p-2 rounded-xl bg-amber-100 dark:bg-slate-700 text-amber-800 dark:text-amber-200 hover:bg-amber-200 cursor-pointer"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {item.definition}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-amber-50/50 dark:bg-slate-800 p-2.5 rounded-xl border border-amber-100 dark:border-slate-700">
                "{item.childFriendlyExample}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Bedtime Reflection */}
      {activeTab === 'reflection' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm text-left space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌙</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
              Parent & Child Bedtime Chat
            </h3>
          </div>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium leading-relaxed bg-amber-50 dark:bg-slate-800 p-5 rounded-2xl border border-amber-200 dark:border-slate-700">
            "{activity.reflectionPrompt}"
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Taking one minute to talk about empathy and kindness right before sleep helps kids feel safe, loved, and deeply connected.
          </p>
        </div>
      )}

      {/* Bottom Finish Action */}
      <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-slate-800">
        <button
          onClick={onBackToStory}
          className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-amber-100 cursor-pointer"
        >
          Back to Story
        </button>

        <button
          id="finish-learning-activity-btn"
          onClick={onFinish}
          className="px-7 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md flex items-center gap-2 cursor-pointer font-['Shantell_Sans',sans-serif]"
        >
          <span>Complete Activity & Save</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
