import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Volume1,
  VolumeX,
  Headphones,
  Sparkles,
  BookOpen,
  Info,
  Maximize2,
  Compass,
  ArrowRight,
  MessageCircleQuestion,
  Wand2,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Languages,
  Loader2,
} from 'lucide-react';
import {
  ChildProfile,
  ImageSizeOption,
  LanguageCode,
  Story,
  StoryChoiceOption,
  StoryPage,
} from '../types';
import {
  playWebSpeech,
  pauseWebSpeech,
  resumeWebSpeech,
  stopAllAudio,
} from '../utils/audio';

interface StoryReaderScreenProps {
  story: Story;
  child: ChildProfile;
  bedtimeMode: boolean;
  onStoryComplete: () => void;
  onOpenCompanionChat: (context?: string) => void;
  onSelectChoice: (pageIndex: number, choice: StoryChoiceOption) => void;
  onBackToLibrary: () => void;
  onRecreateImage?: (pageNumber: number, size: ImageSizeOption) => Promise<void>;
  onUpdateStory?: (updatedStory: Story) => void;
}

export const StoryReaderScreen: React.FC<StoryReaderScreenProps> = ({
  story,
  child,
  bedtimeMode,
  onStoryComplete,
  onOpenCompanionChat,
  onSelectChoice,
  onBackToLibrary,
  onRecreateImage,
  onUpdateStory,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(child.narrationPreference.speed || 1.0);
  const [audioVolume, setAudioVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1.0);
  const [spokenCharIndex, setSpokenCharIndex] = useState<number | null>(null);
  const [voicePersonality, setVoicePersonality] = useState<'warm_narrator' | 'playful_hero' | 'curious_robot' | 'wise_animal'>(
    child.narrationPreference.voiceStyle || 'warm_narrator'
  );
  const [selectedImageSize, setSelectedImageSize] = useState<ImageSizeOption>(story.image_size || '2K');
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showBibleDrawer, setShowBibleDrawer] = useState(false);
  const [activeChoiceId, setActiveChoiceId] = useState<string | null>(null);
  const [highContrastMode, setHighContrastMode] = useState(true);

  const currentPage: StoryPage = story.pages[currentPageIndex] || story.pages[0];
  const isLastPage = currentPageIndex === story.pages.length - 1;
  const isFirstPage = currentPageIndex === 0;

  // Cleanup audio when unmounting or changing pages
  useEffect(() => {
    stopAllAudio();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setSpokenCharIndex(null);

    if (currentPage?.selected_choice) {
      setActiveChoiceId(currentPage.selected_choice);
    } else {
      setActiveChoiceId(null);
    }
  }, [currentPageIndex]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Web Speech API Listen / Playback Handlers
  const handleListen = (speed = audioSpeed, volume = isMuted ? 0 : audioVolume) => {
    if (isPlayingAudio && isPausedAudio) {
      resumeWebSpeech();
      setIsPausedAudio(false);
      return;
    }

    stopAllAudio();
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
    setSpokenCharIndex(null);

    const textToRead = currentPage.story_text;

    playWebSpeech(
      textToRead,
      story.language || 'en',
      speed,
      volume,
      () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
        setSpokenCharIndex(null);
      },
      (charIdx) => {
        setSpokenCharIndex(charIdx);
      }
    );
  };

  const handlePause = () => {
    pauseWebSpeech();
    setIsPausedAudio(true);
  };

  const handleResume = () => {
    resumeWebSpeech();
    setIsPausedAudio(false);
  };

  const handleStop = () => {
    stopAllAudio();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setSpokenCharIndex(null);
  };

  const handleToggleListen = () => {
    if (isPlayingAudio && !isPausedAudio) {
      handlePause();
    } else if (isPlayingAudio && isPausedAudio) {
      handleResume();
    } else {
      handleListen();
    }
  };

  const handleReplay = () => {
    handleStop();
    setTimeout(() => {
      handleListen(audioSpeed, isMuted ? 0 : audioVolume);
    }, 120);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setAudioSpeed(newSpeed);
    if (isPlayingAudio && !isPausedAudio) {
      handleListen(newSpeed, isMuted ? 0 : audioVolume);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setAudioVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (isPlayingAudio && !isPausedAudio) {
      handleListen(audioSpeed, newVolume);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      const restored = previousVolume > 0 ? previousVolume : 1.0;
      setIsMuted(false);
      setAudioVolume(restored);
      if (isPlayingAudio && !isPausedAudio) {
        handleListen(audioSpeed, restored);
      }
    } else {
      setPreviousVolume(audioVolume);
      setIsMuted(true);
      setAudioVolume(0);
      if (isPlayingAudio && !isPausedAudio) {
        handleListen(audioSpeed, 0);
      }
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || audioVolume === 0) {
      return <VolumeX className="w-4 h-4 text-rose-500" />;
    }
    if (audioVolume < 0.5) {
      return <Volume1 className="w-4 h-4 text-slate-900 dark:text-white" />;
    }
    return <Volume2 className="w-4 h-4 text-slate-900 dark:text-white" />;
  };

  const getSpeedLabel = (spd: number) => {
    if (spd <= 0.75) return 'Calm Bedtime';
    if (spd === 1.0) return 'Normal';
    if (spd >= 1.25) return 'Brisk';
    return 'Custom';
  };

  const renderHighlightedStoryText = () => {
    const text = currentPage.story_text;
    if (!isPlayingAudio || spokenCharIndex === null || spokenCharIndex === undefined || spokenCharIndex >= text.length) {
      return text;
    }

    const before = text.slice(0, spokenCharIndex);
    const remaining = text.slice(spokenCharIndex);
    const match = remaining.match(/^(\S+)/);
    const currentWord = match ? match[1] : '';
    const after = remaining.slice(currentWord.length);

    return (
      <>
        <span>{before}</span>
        <span className="bg-amber-300 dark:bg-amber-400 text-slate-950 dark:text-slate-950 px-1.5 py-0.5 rounded-lg font-black transition-all shadow-xs">
          {currentWord}
        </span>
        <span>{after}</span>
      </>
    );
  };

  const handleNextPage = () => {
    handleStop();
    if (isLastPage) {
      onStoryComplete();
    } else {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    stopAllAudio();
    setIsPlayingAudio(false);
    if (!isFirstPage) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handlePickChoice = (choice: StoryChoiceOption) => {
    setActiveChoiceId(choice.id);
    onSelectChoice(currentPageIndex, choice);
  };

  const handleRefreshIllustration = async () => {
    if (isRegeneratingImage) return;
    setIsRegeneratingImage(true);
    try {
      if (onRecreateImage) {
        await onRecreateImage(currentPage.page_number, selectedImageSize);
      } else {
        // Fallback direct call
        const res = await fetch('/api/image/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: currentPage.image_prompt,
            artStyle: story.art_style,
            imageSize: selectedImageSize,
          }),
        });
        const data = await res.json();
        if (data.imageUrl) {
          currentPage.image_url = data.imageUrl;
        }
      }
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  // Instant Story Translation into Hindi, Telugu, English & more
  const handleTranslateStory = async (targetLang: LanguageCode) => {
    if (targetLang === story.language || isTranslating) return;
    stopAllAudio();
    setIsPlayingAudio(false);
    setIsTranslating(true);
    try {
      const res = await fetch('/api/story/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story,
          targetLanguage: targetLang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.story && onUpdateStory) {
          onUpdateStory(data.story);
        }
      }
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div id="story-reader-container" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Reading Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-white dark:bg-black border-2 border-slate-900 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            id="reader-back-library-btn"
            onClick={onBackToLibrary}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white cursor-pointer transition-colors font-bold"
            title="Back to Bookshelf"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-black text-base sm:text-xl text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif] line-clamp-1">
              {story.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-slate-200 font-bold">
              <span>Page {currentPageIndex + 1} of {story.pages.length}</span>
              <span>•</span>
              <span className="capitalize">{story.theme}</span>
              <span>•</span>
              <span className="capitalize">{story.art_style}</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-black">
                {story.language === 'hi' ? 'हिन्दी' : story.language === 'te' ? 'తెలుగు' : story.language?.toUpperCase() || 'EN'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Language Switch/Translate, High-Contrast Toggle, Story Bible Inspector & Ask Barnaby */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Language Switch / Translate */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-900 text-xs font-black">
            {isTranslating ? (
              <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            ) : (
              <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
            <select
              value={story.language || 'en'}
              disabled={isTranslating}
              onChange={(e) => handleTranslateStory(e.target.value as LanguageCode)}
              className="bg-transparent font-black text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              title="Translate this story"
            >
              <option value="hi" className="text-slate-900 bg-white">हिन्दी (Hindi)</option>
              <option value="te" className="text-slate-900 bg-white">తెలుగు (Telugu)</option>
              <option value="en" className="text-slate-900 bg-white">English</option>
              <option value="gu" className="text-slate-900 bg-white">ગુજરાતી (Gujarati)</option>
              <option value="pa" className="text-slate-900 bg-white">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="ta" className="text-slate-900 bg-white">தமிழ் (Tamil)</option>
              <option value="bn" className="text-slate-900 bg-white">বাংলা (Bengali)</option>
              <option value="mr" className="text-slate-900 bg-white">मराठी (Marathi)</option>
            </select>
          </div>

          {/* High Contrast Mode Switch */}
          <button
            id="reader-toggle-contrast-btn"
            onClick={() => setHighContrastMode(!highContrastMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              highContrastMode
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-900 dark:border-slate-400 hover:bg-slate-100'
            }`}
            title="Toggle high-contrast black/slate-900 text mode for maximum readability"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{highContrastMode ? 'High Contrast ON' : 'High Contrast OFF'}</span>
          </button>

          {/* Ask Owl about this page */}
          <button
            onClick={() => onOpenCompanionChat(`Currently on page ${currentPage.page_number} of "${story.title}": "${currentPage.story_text}"`)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-slate-900 dark:border-white text-xs font-black flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
          >
            <MessageCircleQuestion className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Barnaby</span>
          </button>

          {/* Story Bible Inspector */}
          <button
            id="open-story-bible-drawer-btn"
            onClick={() => setShowBibleDrawer(!showBibleDrawer)}
            className="px-3 py-1.5 rounded-xl bg-amber-200 dark:bg-slate-900 text-slate-900 dark:text-amber-200 border-2 border-amber-600 dark:border-amber-400 text-xs font-black flex items-center gap-1.5 hover:bg-amber-300 dark:hover:bg-slate-800 cursor-pointer"
            title="View character consistency and memory engine details"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-800 dark:text-amber-300" />
            <span className="hidden sm:inline">Story Bible</span>
          </button>
        </div>
      </div>

      {/* Main Storybook Layout: Left/Top Illustration, Right/Bottom Text & Narration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Illustration & Image Affordances) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 aspect-[4/3] bg-slate-900">
            {currentPage.image_url ? (
              <img
                key={`${currentPage.page_number}-${currentPage.image_url}`}
                src={currentPage.image_url}
                alt={currentPage.image_prompt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  isRegeneratingImage ? 'opacity-40 blur-xs' : 'opacity-100'
                }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white text-center bg-gradient-to-br from-indigo-900 to-purple-900">
                <Sparkles className="w-12 h-12 mb-3 text-amber-400 animate-spin" />
                <p className="text-sm font-bold">Creating high-fidelity illustration...</p>
              </div>
            )}

            {/* Top Badges: Resolution & Page Number */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-extrabold border border-white/20">
                Page {currentPage.page_number}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black shadow-xs">
                {selectedImageSize} Studio
              </span>
            </div>

            {/* Bottom Floating Art Style & Emotion Tag */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
              <span className="px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md">
                Emotion: <strong className="text-amber-300">{currentPage.emotional_state || 'Peaceful'}</strong>
              </span>
              <button
                onClick={handleRefreshIllustration}
                disabled={isRegeneratingImage}
                className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold flex items-center gap-1 cursor-pointer"
                title="Regenerate this page's illustration with Gemini"
              >
                <RefreshCw className={`w-3 h-3 ${isRegeneratingImage ? 'animate-spin' : ''}`} />
                <span>New Art</span>
              </button>
            </div>
          </div>

          {/* Image Size Selection Affordance for Gemini-3-pro-image */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-black border-2 border-slate-900 dark:border-slate-700 text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Image Resolution:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {(['1K', '2K', '4K'] as ImageSizeOption[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedImageSize(size)}
                  className={`px-3 py-1 rounded-lg font-black text-xs transition-all cursor-pointer border-2 ${
                    selectedImageSize === size
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-900 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Story Text, Narration Controls, & Interactive Choice) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Story Text Card */}
          <div
            id="page-story-text-container"
            className={`p-6 sm:p-8 rounded-3xl shadow-xl relative transition-all ${
              highContrastMode
                ? 'bg-white dark:bg-black border-4 border-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700'
            }`}
          >
            {/* Header: Environment pill & Prominent 'Listen' button */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="inline-block text-xs font-black text-slate-900 dark:text-amber-200 bg-amber-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-full border-2 border-slate-900 dark:border-amber-400 uppercase tracking-wider">
                📍 {currentPage.environment}
              </div>

              {/* Quick Listen Button on Story Card */}
              <button
                id="story-card-listen-btn"
                onClick={handleToggleListen}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 border-slate-900 dark:border-white shadow-xs transition-all cursor-pointer ${
                  isPlayingAudio && !isPausedAudio
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : isPausedAudio
                    ? 'bg-amber-300 hover:bg-amber-400 text-slate-950'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                }`}
                title={
                  isPlayingAudio && !isPausedAudio
                    ? 'Pause reading aloud'
                    : isPausedAudio
                    ? 'Resume reading aloud'
                    : 'Listen to story read aloud with Web Speech API'
                }
              >
                {isPlayingAudio && !isPausedAudio ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause</span>
                  </>
                ) : isPausedAudio ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            {/* High-Contrast Readable Typography with Live Word Highlighting */}
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-relaxed tracking-wide text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
              {renderHighlightedStoryText()}
            </p>

            {/* Learning Goal Tag */}
            {currentPage.learning_goal && (
              <div className="mt-6 pt-4 border-t-2 border-slate-900/20 dark:border-white/20 flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 bg-amber-50 dark:bg-slate-900 p-3 rounded-2xl border-2 border-amber-300 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Learning focus: {currentPage.learning_goal}</span>
              </div>
            )}
          </div>

          {/* Interactive Choices (At designated decision forks like Page 3) */}
          {currentPage.choice_options && currentPage.choice_options.length > 0 && (
            <div
              id="story-choice-section"
              className="p-6 rounded-3xl bg-white dark:bg-black border-4 border-slate-900 dark:border-white shadow-xl space-y-4"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-indigo-700 dark:text-indigo-400 animate-spin" />
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                  What should {story.bible?.main_character || 'our friend'} do next?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-200 font-bold">
                Make your choice! Your decision guides the next scene of our bedtime adventure.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {currentPage.choice_options.map((choice) => {
                  const isSelected = activeChoiceId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handlePickChoice(choice)}
                      className={`p-4 rounded-2xl text-left border-3 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white shadow-xl scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-900 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 font-black text-sm sm:text-base">
                        <span className="text-2xl">{choice.icon || '✨'}</span>
                        <span className="font-extrabold">{choice.text}</span>
                      </div>
                      {choice.description && (
                        <p
                          className={`text-xs font-bold ${
                            isSelected ? 'text-slate-200 dark:text-slate-800' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {choice.description}
                        </p>
                      )}
                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-black text-amber-400 dark:text-amber-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Choice Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Web Speech API Audio & Playback Controls Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-black border-2 border-slate-900 dark:border-slate-700 shadow-md space-y-4">
            {/* Top Control Bar: 'Listen', Stop, Replay & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Primary Listen Button */}
                <button
                  id="story-reader-listen-btn"
                  onClick={handleToggleListen}
                  className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2.5 shadow-md transition-all cursor-pointer border-2 border-slate-900 dark:border-white ${
                    isPlayingAudio && !isPausedAudio
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : isPausedAudio
                      ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                      : 'bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
                  }`}
                  title="Read story aloud using Web Speech API"
                >
                  {isPlayingAudio && !isPausedAudio ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : isPausedAudio ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                {/* Stop Button (Active when speaking or paused) */}
                {(isPlayingAudio || isPausedAudio) && (
                  <button
                    id="reader-stop-btn"
                    onClick={handleStop}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 border-2 border-slate-900 dark:border-white font-bold cursor-pointer transition-colors"
                    title="Stop reading aloud"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                )}

                {/* Replay Button */}
                <button
                  id="reader-replay-btn"
                  onClick={handleReplay}
                  className="p-3 rounded-2xl bg-amber-100 dark:bg-slate-900 hover:bg-amber-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white font-bold cursor-pointer transition-colors"
                  title="Replay from start of page"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Status Indicator Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-slate-900 dark:border-white text-xs font-black bg-amber-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                {isPlayingAudio && !isPausedAudio ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Reading Aloud (Web Speech)</span>
                  </>
                ) : isPausedAudio ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Paused</span>
                  </>
                ) : (
                  <>
                    <Headphones className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Web Speech Ready</span>
                  </>
                )}
              </div>
            </div>

            {/* Playback Controls Grid: Speed and Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-900/30 dark:border-slate-800">
              {/* Speed Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <label htmlFor="reader-speed-slider" className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Speed</span>
                  </label>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-900 dark:border-white text-slate-900 dark:text-white font-black text-[11px]">
                    {audioSpeed.toFixed(2)}x • {getSpeedLabel(audioSpeed)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">0.5x</span>
                  <input
                    id="reader-speed-slider"
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={audioSpeed}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                    title="Adjust reading speed"
                  />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">1.5x</span>
                </div>

                {/* Quick Speed Preset Buttons */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {[
                    { label: '0.75x Calm', val: 0.75 },
                    { label: '1.0x Normal', val: 1.0 },
                    { label: '1.25x Brisk', val: 1.25 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleSpeedChange(preset.val)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                        Math.abs(audioSpeed - preset.val) < 0.05
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="cursor-pointer hover:opacity-80"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {getVolumeIcon()}
                    </button>
                    <span>Volume</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-900 dark:border-white text-slate-900 dark:text-white font-black text-[11px]">
                    {isMuted ? 'Muted (0%)' : `${Math.round(audioVolume * 100)}%`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="p-1 rounded-md border border-slate-900 dark:border-white bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {getVolumeIcon()}
                  </button>
                  <input
                    id="reader-volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : audioVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                    title="Adjust reading volume"
                  />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">100%</span>
                </div>

                {/* Quick Volume Preset Buttons */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  {[
                    { label: 'Quiet 30%', val: 0.3 },
                    { label: 'Medium 70%', val: 0.7 },
                    { label: 'Full 100%', val: 1.0 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => handleVolumeChange(preset.val)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                        !isMuted && Math.abs(audioVolume - preset.val) < 0.1
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Page Navigation Controls */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-slate-900/20 dark:border-white/20">
              <button
                id="reader-prev-btn"
                onClick={handlePrevPage}
                disabled={isFirstPage}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all border-2 ${
                  isFirstPage
                    ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-400'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-slate-900 dark:border-white cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {story.pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      stopAllAudio();
                      setIsPlayingAudio(false);
                      setCurrentPageIndex(idx);
                    }}
                    className={`h-3 rounded-full transition-all cursor-pointer border-2 ${
                      idx === currentPageIndex
                        ? 'w-7 bg-slate-900 dark:bg-white border-slate-900 dark:border-white'
                        : 'w-3 bg-amber-200 dark:bg-slate-700 border-slate-900 dark:border-slate-400 hover:bg-amber-400'
                    }`}
                    title={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                id="reader-next-btn"
                onClick={handleNextPage}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md border-2 border-slate-900 dark:border-white cursor-pointer transition-all"
              >
                <span>{isLastPage ? 'Finish Story & Activity' : 'Next Page'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Bible Drawer Modal (Shows how character visual consistency is preserved) */}
      {showBibleDrawer && story.bible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-black border-4 border-slate-900 dark:border-white shadow-2xl space-y-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900/20 dark:border-white/20">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-100 text-slate-900 dark:bg-slate-900 dark:text-amber-300 border-2 border-slate-900 dark:border-amber-400">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                    Story Bible & Memory Engine
                  </h3>
                  <p className="text-xs text-slate-900 dark:text-slate-200 font-bold">
                    Structured blueprint used to maintain character & visual continuity across all pages
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBibleDrawer(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-slate-900 dark:border-white text-xs font-black hover:opacity-90 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-600">
                <div className="font-black text-amber-900 dark:text-amber-300 mb-1 text-sm">
                  Main Character
                </div>
                <div className="font-black text-base text-slate-900 dark:text-white">
                  {story.bible.main_character} (Age {story.bible.target_age})
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-bold mt-1">
                  {story.bible.character_description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-600">
                <div className="font-black text-amber-900 dark:text-amber-300 mb-1 text-sm">
                  Visual Blueprint & Clothing
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-bold">
                  {story.bible.character_visual_description}
                </p>
                <div className="mt-2 text-slate-900 dark:text-slate-200 font-bold">
                  Clothing: <strong className="text-slate-900 dark:text-amber-300">{story.bible.clothing}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-600">
                <div className="font-black text-amber-900 dark:text-amber-300 mb-1 text-sm">
                  World Description
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-bold">
                  {story.bible.world_description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-600">
                <div className="font-black text-amber-900 dark:text-amber-300 mb-1 text-sm">
                  Educational & Safety Goals
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-bold mb-1">
                  Goal: <strong className="text-slate-900 dark:text-amber-300">{story.bible.educational_goal}</strong>
                </p>
                <div className="text-xs text-slate-900 dark:text-slate-200 font-bold mt-1">
                  Constraints: {story.bible.safety_constraints?.join(' • ')}
                </div>
              </div>
            </div>

            {/* Current Page Prompt Inspector */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 text-xs">
              <div className="font-black text-slate-900 dark:text-white mb-2 text-sm">
                Current Page Image Generation Prompt (Combined with Bible):
              </div>
              <p className="font-mono text-xs text-slate-900 dark:text-slate-100 bg-amber-50 dark:bg-black p-3 rounded-xl border-2 border-slate-900 dark:border-slate-600 font-bold">
                {currentPage.image_prompt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
