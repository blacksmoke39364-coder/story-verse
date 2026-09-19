import React from 'react';
import {
  Sparkles,
  BookOpen,
  ShieldCheck,
  Moon,
  Sun,
  User,
  MessageCircleQuestion,
  Languages,
} from 'lucide-react';
import { AppView, ChildProfile, LanguageCode } from '../types';
import { LANGUAGES } from '../data/constants';
import { getTranslations } from '../utils/translations';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeChild: ChildProfile;
  bedtimeMode: boolean;
  setBedtimeMode: (val: boolean) => void;
  isParentUnlocked: boolean;
  setIsParentUnlocked: (val: boolean) => void;
  onOpenParentLogin: () => void;
  onOpenCompanionChat: () => void;
  onLaunchDemoStory: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeChild,
  bedtimeMode,
  setBedtimeMode,
  isParentUnlocked,
  setIsParentUnlocked,
  onOpenParentLogin,
  onOpenCompanionChat,
  onLaunchDemoStory,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const t = getTranslations(selectedLanguage);

  return (
    <header
      id="app-header"
      className="sticky top-2 sm:top-3 z-40 w-full px-2 sm:px-6 pointer-events-auto"
    >
      <div
        className={`max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 rounded-[2.5rem] backdrop-blur-xl border transition-all duration-300 shadow-lg ${
          bedtimeMode
            ? 'bg-slate-900/85 border-slate-700/70 text-slate-100 shadow-indigo-950/40'
            : 'bg-white/85 border-slate-200/80 text-slate-800 shadow-slate-200/50'
        }`}
      >
        {/* Brand Logo & Square Icon (11x11, rounded-2xl) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="brand-home-btn"
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0066CC] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight font-quicksand text-slate-900 dark:text-white">
                  StoryVerse<span className="text-[#0066CC] dark:text-blue-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                  Kids
                </span>
              </div>
              <p className="hidden lg:block text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-none">
                {t.brandTagline}
              </p>
            </div>
          </button>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 font-bold text-sm text-slate-600 dark:text-slate-300">
          <button
            id="nav-child-home"
            onClick={() => setCurrentView('child_home')}
            className={`hover:text-[#0066CC] dark:hover:text-blue-400 transition-colors cursor-pointer ${
              currentView === 'child_home' || currentView === 'story_creator' ? 'text-[#0066CC] dark:text-blue-400 font-black' : ''
            }`}
          >
            {t.explore}
          </button>

          <button
            id="nav-library"
            onClick={() => setCurrentView('story_library')}
            className={`hover:text-[#0066CC] dark:hover:text-blue-400 transition-colors cursor-pointer ${
              currentView === 'story_library' ? 'text-[#0066CC] dark:text-blue-400 font-black' : ''
            }`}
          >
            {t.bookshelf}
          </button>

          <button
            id="nav-safety"
            onClick={() => setCurrentView('privacy_safety_center')}
            className={`hover:text-[#0066CC] dark:hover:text-blue-400 transition-colors cursor-pointer ${
              currentView === 'privacy_safety_center' ? 'text-[#0066CC] dark:text-blue-400 font-black' : ''
            }`}
          >
            {t.safety}
          </button>
        </nav>

        {/* Right Tools: Persistent Language Switcher, Bedtime Toggle, Companion Chat, Parent Gate, and CTA */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Persistent Language Switcher: English, Hindi, Telugu */}
          <div
            id="persistent-language-switcher"
            className="flex items-center p-0.5 rounded-full border border-slate-300/80 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 shadow-xs"
            role="group"
            aria-label="Language Selector"
          >
            <button
              id="lang-switch-en"
              type="button"
              onClick={() => onSelectLanguage('en')}
              className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                selectedLanguage === 'en'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="English"
            >
              <span className="hidden sm:inline">English</span>
              <span className="sm:hidden">EN</span>
            </button>

            <button
              id="lang-switch-hi"
              type="button"
              onClick={() => onSelectLanguage('hi')}
              className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                selectedLanguage === 'hi'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="हिन्दी (Hindi)"
            >
              हिन्दी
            </button>

            <button
              id="lang-switch-te"
              type="button"
              onClick={() => onSelectLanguage('te')}
              className={`px-2 sm:px-2.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                selectedLanguage === 'te'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="తెలుగు (Telugu)"
            >
              తెలుగు
            </button>
          </div>

          {/* Bedtime Mode Toggle */}
          <button
            id="toggle-bedtime-mode-btn"
            onClick={() => setBedtimeMode(!bedtimeMode)}
            title={bedtimeMode ? t.bedtimeOn : t.bedtimeOff}
            className={`p-2 rounded-full flex items-center justify-center transition-all border cursor-pointer ${
              bedtimeMode
                ? 'bg-indigo-950 text-amber-300 border-indigo-700 shadow-inner'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {bedtimeMode ? <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* AI Story Owl */}
          <button
            id="open-companion-chat-btn"
            onClick={onOpenCompanionChat}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all bg-[#4ECDC4] hover:brightness-105 text-slate-900 shadow-xs cursor-pointer"
            title="Talk to Barnaby the Story Owl"
          >
            <MessageCircleQuestion className="w-4 h-4 text-slate-900" />
            <span className="hidden xl:inline font-quicksand font-bold">{t.owlChat}</span>
          </button>

          {/* Parent Gate */}
          <button
            id="parent-space-gate-btn"
            onClick={() => {
              if (isParentUnlocked) {
                setCurrentView('parent_dashboard');
              } else {
                onOpenParentLogin();
              }
            }}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all border cursor-pointer ${
              isParentUnlocked
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
            }`}
            title="Parent Space & Safety Gate"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden lg:inline">{isParentUnlocked ? t.parentGate : 'PIN'}</span>
          </button>

          {/* Pill-shaped Blue CTA button */}
          <button
            id="nav-cta-btn"
            onClick={() => setCurrentView('story_creator')}
            className="btn-3d-blue rounded-full px-3.5 sm:px-5 py-2 font-quicksand font-extrabold text-xs sm:text-sm tracking-wide flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.createStory}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
