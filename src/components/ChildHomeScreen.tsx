import React from 'react';
import {
  Sparkles,
  BookOpen,
  PlusCircle,
  Play,
  Heart,
  Star,
  Clock,
  Volume2,
  Compass,
  ArrowRight,
  MessageCircleQuestion,
} from 'lucide-react';
import { AppView, ChildProfile, LanguageCode, Story } from '../types';
import { getTranslations } from '../utils/translations';

interface ChildHomeScreenProps {
  child: ChildProfile;
  stories: Story[];
  setCurrentView: (view: AppView) => void;
  onSelectStory: (story: Story) => void;
  onOpenCompanionChat: () => void;
  dailyMinutesRead?: number;
  dailyGoalMinutes?: number;
  selectedLanguage?: LanguageCode;
}

export const ChildHomeScreen: React.FC<ChildHomeScreenProps> = ({
  child,
  stories,
  setCurrentView,
  onSelectStory,
  onOpenCompanionChat,
  dailyMinutesRead = 12,
  dailyGoalMinutes = 20,
  selectedLanguage = 'en',
}) => {
  const featuredStory = stories[0];
  const t = getTranslations(selectedLanguage);

  const greetingWord =
    selectedLanguage === 'hi' ? 'नमस्ते' : selectedLanguage === 'te' ? 'నమస్కారం' : 'Namaste';

  return (
    <div id="child-home-screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Friendly Child Greeting Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-200/70 via-orange-100/70 to-pink-100/70 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border-2 border-amber-300/80 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 dark:bg-amber-500/20 border-2 border-white dark:border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-md">
            {child.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                {greetingWord}, {child.firstName}!
              </h1>
              <span className="text-2xl">✨</span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-1">
              {t.readyForBedtime}
            </p>
          </div>
        </div>

        {/* Daily Reading Badge */}
        <div className="w-full md:w-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900 border border-amber-200 dark:border-slate-700 shadow-xs">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>{t.dailyGoal}</span>
              <span className="text-amber-500 font-extrabold flex items-center">
                <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> {dailyMinutesRead}/{dailyGoalMinutes}m
              </span>
            </div>
            <div className="w-32 sm:w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                style={{ width: `${Math.min(100, (dailyMinutesRead / dailyGoalMinutes) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Big Action Cards for Children */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Create a Brand New Story */}
        <button
          id="child-create-story-card"
          onClick={() => setCurrentView('story_creator')}
          className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all text-left overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-8 text-amber-200/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            <Sparkles className="w-36 h-36" />
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs mb-4">
              <PlusCircle className="w-3.5 h-3.5" /> {t.startNewStory}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-['Shantell_Sans',sans-serif] mb-2 leading-tight">
              {t.createStory}
            </h2>
            <p className="text-sm sm:text-base text-amber-100 font-medium max-w-sm mb-6">
              {t.creatorSubtitle}
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-md group-hover:bg-amber-50 transition-colors">
              <span>{t.createStory}</span>
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </div>
          </div>
        </button>

        {/* Card 2: Interactive Story Owl Buddy */}
        <button
          id="child-talk-owl-card"
          onClick={onOpenCompanionChat}
          className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all text-left overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-8 text-indigo-300/20 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
            <MessageCircleQuestion className="w-36 h-36" />
          </div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs mb-4">
              🦉 Barnaby the Moon Owl
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-['Shantell_Sans',sans-serif] mb-2 leading-tight">
              {t.owlChat}
            </h2>
            <p className="text-sm sm:text-base text-indigo-100 font-medium max-w-sm mb-6">
              {selectedLanguage === 'hi'
                ? 'अपनी कहानी के बारे में सवाल पूछें, कठिन शब्दों का अर्थ जानें या प्यारी पहेलियां सुनें!'
                : selectedLanguage === 'te'
                ? 'మీ కథ గురించి ప్రశ్నలు అడగండి, కష్టమైన పదాల అర్థాలు తెలుసుకోండి లేదా నిద్రవేళ పొడుపుకథలు వినండి!'
                : 'Ask questions about your book, learn what words mean, or get a cozy bedtime riddle!'}
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-md group-hover:bg-indigo-50 transition-colors">
              <span>{t.owlChat}</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
        </button>
      </div>

      {/* Featured Story Carousel / Bookshelf */}
      {featuredStory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                Featured Adventure Tonight
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('story_library')}
              className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              See All Stories ({stories.length})
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-amber-200/80 dark:border-slate-700 shadow-md flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-2/5 aspect-[4/3] rounded-2xl overflow-hidden relative shadow-md">
              <img
                src={featuredStory.cover_image}
                alt={featuredStory.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Interactive Choice</span>
              </div>
            </div>

            <div className="w-full md:w-3/5 space-y-3 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-slate-700 text-amber-800 dark:text-amber-200">
                  {featuredStory.theme}
                </span>
                <span>•</span>
                <span>{featuredStory.pages.length} illustrated pages</span>
                <span>•</span>
                <span>Narration Ready</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                {featuredStory.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {featuredStory.short_description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectStory(featuredStory)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Open Storybook</span>
                </button>

                <button
                  onClick={() => onSelectStory(featuredStory)}
                  className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-slate-700 text-amber-800 dark:text-amber-200 font-bold text-sm border border-amber-200 dark:border-slate-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Aloud</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Child Favorite Topics Quick Picks */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
          {child.firstName}'s Favorite Topics
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {child.favoriteTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setCurrentView('story_creator')}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-200/80 dark:border-slate-700 hover:border-amber-400 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>⭐</span>
              <span>{topic}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
