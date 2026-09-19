import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Wand2,
  BookOpen,
  Palette,
  Compass,
  Smile,
  Layers,
  ArrowLeft,
  AlertTriangle,
  Volume2,
  Sliders,
  Languages,
} from 'lucide-react';
import {
  ArtStyle,
  ChildProfile,
  ImageSizeOption,
  LanguageCode,
  StoryBible,
  StoryTheme,
} from '../types';
import { ART_STYLES, IMAGE_SIZES, LANGUAGES, THEMES } from '../data/constants';
import { createSpeechRecognition } from '../utils/speechRecognition';
import { getTranslations } from '../utils/translations';

interface StoryCreatorScreenProps {
  child: ChildProfile;
  initialLanguage?: LanguageCode;
  onBack: () => void;
  onStartGeneration: (config: {
    idea: string;
    theme: StoryTheme;
    character: string;
    world: string;
    mood: string;
    pageCount: number;
    artStyle: ArtStyle;
    imageSize: ImageSizeOption;
    language: LanguageCode;
  }) => void;
}

export const StoryCreatorScreen: React.FC<StoryCreatorScreenProps> = ({
  child,
  initialLanguage,
  onBack,
  onStartGeneration,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme>('Space');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(
    initialLanguage || child.preferredLanguage || 'hi'
  );
  const [ideaText, setIdeaText] = useState('');

  // Synchronize when persistent language switcher in Navbar is clicked
  useEffect(() => {
    if (initialLanguage) {
      setSelectedLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const t = getTranslations(selectedLanguage);
  const [characterName, setCharacterName] = useState(child.firstName);
  const [selectedWorld, setSelectedWorld] = useState('Moonflower Meadow with glowing crystals');
  const [selectedMood, setSelectedMood] = useState('Cozy, comforting & sleepy');
  const [pageCount, setPageCount] = useState<number>(5);
  const [selectedArtStyle, setSelectedArtStyle] = useState<ArtStyle>('storybook');
  const [selectedImageSize, setSelectedImageSize] = useState<ImageSizeOption>('2K');
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);
  const speechRef = useRef<ReturnType<typeof createSpeechRecognition> | null>(null);

  // Setup speech recognition with current language
  useEffect(() => {
    const langMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
    };
    const speechLang = langMap[selectedLanguage] || 'en-US';

    const speech = createSpeechRecognition(
      (transcript) => {
        setIdeaText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      (listening) => {
        setIsListening(listening);
      },
      speechLang
    );

    speechRef.current = speech;
    setMicSupported(speech.supported);

    return () => {
      if (speechRef.current) {
        speechRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  const handleToggleMic = () => {
    if (!speechRef.current || !micSupported) {
      alert('Microphone speech recognition is not supported in this browser environment. You can type your idea directly!');
      return;
    }
    if (isListening) {
      speechRef.current.stop();
      setIsListening(false);
    } else {
      speechRef.current.start();
    }
  };

  const handleSelectTheme = (theme: StoryTheme) => {
    setSelectedTheme(theme);
    const found = THEMES.find((t) => t.id === theme);
    if (found && !ideaText) {
      setIdeaText(found.samplePrompt);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Quick child-safety keyword check before initiating pipeline
    const forbidden = ['kill', 'blood', 'gun', 'curse', 'demon', 'gore', 'die'];
    if (forbidden.some((w) => ideaText.toLowerCase().includes(w))) {
      setSafetyNotice('Let\'s make sure our bedtime story is cozy and safe for sleep! Try an adventure with friendly stars or helpful animals.');
      return;
    }

    setSafetyNotice(null);
    onStartGeneration({
      idea: ideaText || `${characterName}'s wondrous ${selectedTheme} bedtime journey`,
      theme: selectedTheme,
      character: characterName || child.firstName,
      world: selectedWorld,
      mood: selectedMood,
      pageCount,
      artStyle: selectedArtStyle,
      imageSize: selectedImageSize,
      language: selectedLanguage,
    });
  };

  return (
    <div id="story-creator-screen" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-slate-900 dark:text-white">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-black border-2 border-slate-900 dark:border-white text-sm font-black text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* High Contrast Mode Switch */}
          <button
            id="creator-toggle-contrast-btn"
            type="button"
            onClick={() => setHighContrastMode(!highContrastMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              highContrastMode
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-900 dark:border-slate-400 hover:bg-slate-100'
            }`}
            title="Toggle high-contrast text styling for young children"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{highContrastMode ? 'High Contrast ON' : 'High Contrast OFF'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-amber-200 bg-amber-200 dark:bg-slate-900 px-3.5 py-2 rounded-xl border-2 border-slate-900 dark:border-amber-400">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Story Memory Engine Active</span>
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif] mb-3">
          {t.creatorTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-bold leading-relaxed">
          {t.creatorSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Theme */}
        <section
          className={`p-6 sm:p-8 rounded-3xl shadow-lg space-y-4 transition-all ${
            highContrastMode
              ? 'bg-white dark:bg-black border-4 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-slate-900 dark:border-white font-black text-sm flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                {t.pickTheme}
              </h2>
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-amber-300">
              Selected: {selectedTheme}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              return (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all border-3 flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 border-slate-900 dark:border-slate-600 hover:border-slate-900 dark:hover:border-white'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl p-1 rounded-xl bg-amber-100 dark:bg-slate-800 border border-slate-900 dark:border-slate-600 shadow-xs">
                    {theme.icon}
                  </span>
                  <div>
                    <div className={`font-black text-xs sm:text-sm ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                      {theme.label}
                    </div>
                    <p className={`text-xs font-bold line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-200 dark:text-slate-800' : 'text-slate-800 dark:text-slate-200'}`}>
                      {theme.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Language Selection (Multi-language: Hindi, Telugu, English & more) */}
        <section
          id="creator-language-section"
          className={`p-6 sm:p-8 rounded-3xl shadow-lg space-y-4 transition-all ${
            highContrastMode
              ? 'bg-white dark:bg-black border-4 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-slate-900 dark:border-white font-black text-sm flex items-center justify-center">
                2
              </span>
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                  Story Language (భాష / भाषा / Language)
                </h2>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-300">
              {LANGUAGES.find((l) => l.code === selectedLanguage)?.label || 'Hindi'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">
            Stories, narrations, and activities will be written in authentic native script.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              const isHighlighted = lang.code === 'hi' || lang.code === 'te';
              return (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 rounded-2xl text-left border-3 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white shadow-md scale-[1.02]'
                      : isHighlighted
                      ? 'bg-amber-50 dark:bg-slate-900 border-amber-400 dark:border-amber-500 hover:border-slate-900 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-slate-900 text-slate-900 dark:text-white'
                  }`}
                >
                  {isHighlighted && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black tracking-wider uppercase shadow-xs">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`font-black text-xs sm:text-sm ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                      {lang.label}
                    </span>
                  </div>
                  <div className={`text-xs font-bold mt-0.5 ${isSelected ? 'text-amber-200 dark:text-amber-800' : 'text-slate-600 dark:text-slate-300'}`}>
                    {lang.nativeLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3: Type or Speak Idea (Microphone) */}
        <section
          className={`p-6 sm:p-8 rounded-3xl shadow-lg space-y-4 transition-all ${
            highContrastMode
              ? 'bg-white dark:bg-black border-4 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-slate-900 dark:border-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                Your Story Idea or Bedtime Wish
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer border-2 border-slate-900 dark:border-white ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-amber-200 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-amber-300 dark:hover:bg-slate-800'
                }`}
                title="Speak your idea into the microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-slate-900 dark:text-amber-300" />}
                <span>{isListening ? 'Listening...' : 'Speak Idea'}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="story-idea-input"
              rows={3}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. A friendly baby star slips from Orion's belt and Aarav helps her find her constellation before bedtime..."
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-slate-400 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:outline-none focus:border-amber-500 transition-colors"
            />
            {isListening && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-black text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>Recording voice idea...</span>
              </div>
            )}
          </div>

          {safetyNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-slate-900 border-2 border-slate-900 dark:border-amber-400 text-slate-900 dark:text-amber-200 text-xs sm:text-sm font-black flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{safetyNotice}</span>
            </div>
          )}
        </section>

        {/* Step 4: Character, World & Mood Customization */}
        <section
          className={`p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 transition-all ${
            highContrastMode
              ? 'bg-white dark:bg-black border-4 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-slate-900 dark:border-white font-black text-sm flex items-center justify-center">
              4
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
              Characters, World & Atmosphere
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hero Character */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Hero Name
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Child's hero name"
                className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-400 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* World Setting */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                World Setting
              </label>
              <select
                value={selectedWorld}
                onChange={(e) => setSelectedWorld(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-400 font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Moonflower Meadow with glowing crystals">Moonflower Meadow with glowing crystals</option>
                <option value="Cosmic Cloud Playground above the stars">Cosmic Cloud Playground above the stars</option>
                <option value="Sunlit Prehistoric Fern Valley with gentle waterfalls">Sunlit Prehistoric Fern Valley with gentle waterfalls</option>
                <option value="Enchanted Whispering Treehouse in the Woods">Enchanted Whispering Treehouse in the Woods</option>
                <option value="Shimmering Coral Bay with singing dolphins">Shimmering Coral Bay with singing dolphins</option>
                <option value="Royal Palace Garden decorated with Diwali diyas">Royal Palace Garden decorated with Diwali diyas</option>
              </select>
            </div>

            {/* Story Mood */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Story Mood
              </label>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-400 font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="Cozy, comforting & sleepy">Cozy, comforting & sleepy (Bedtime Favorite)</option>
                <option value="Playful, funny & cheerful">Playful, funny & cheerful</option>
                <option value="Curious, scientific & inspiring">Curious, scientific & inspiring</option>
                <option value="Gentle, peaceful & soothing">Gentle, peaceful & soothing</option>
              </select>
            </div>
          </div>
        </section>

        {/* Step 5: Art Style, Image Size Affordance (1K, 2K, 4K) & Page Length */}
        <section
          className={`p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 transition-all ${
            highContrastMode
              ? 'bg-white dark:bg-black border-4 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-slate-950 border-2 border-slate-900 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-slate-900 dark:border-white font-black text-sm flex items-center justify-center">
                5
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                Visual Art Style & Story Length
              </h2>
            </div>
          </div>

          {/* Art Style Picker */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              Illustration Art Direction
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {ART_STYLES.map((style) => {
                const isSelected = selectedArtStyle === style.id;
                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setSelectedArtStyle(style.id)}
                    className={`p-3.5 rounded-2xl text-left border-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-900 dark:border-slate-600 hover:border-slate-900 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{style.preview}</span>
                      <span className={`font-black text-xs sm:text-sm ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-slate-200 dark:text-slate-800' : 'text-slate-800 dark:text-slate-200'}`}>
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Size Affordance: 1K, 2K, 4K */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Gemini Image Resolution Affordance (gemini-3-pro-image-preview)
              </label>
              <span className="text-xs font-black text-slate-900 dark:text-amber-300">
                Current: {selectedImageSize}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {IMAGE_SIZES.map((size) => {
                const isSelected = selectedImageSize === size.id;
                return (
                  <button
                    type="button"
                    key={size.id}
                    onClick={() => setSelectedImageSize(size.id)}
                    className={`p-3.5 rounded-2xl text-left border-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-900 dark:border-slate-600 text-slate-900 dark:text-white hover:border-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-black text-sm ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                        {size.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border-2 border-slate-900 dark:border-white ${
                        isSelected
                          ? 'bg-amber-300 text-slate-900'
                          : 'bg-amber-200 dark:bg-slate-800 text-slate-900 dark:text-amber-200'
                      } text-[10px] font-black`}>
                        {size.badge}
                      </span>
                    </div>
                    <p className={`text-xs font-bold ${isSelected ? 'text-slate-200 dark:text-slate-800' : 'text-slate-800 dark:text-slate-200'}`}>
                      {size.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Story Length: 5, 8, 10, 15 pages */}
          <div className="space-y-2 pt-2">
            <label className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              Story Length
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[5, 8, 10, 15].map((count) => {
                const isSelected = pageCount === count;
                return (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setPageCount(count)}
                    className={`py-3 px-2 rounded-2xl text-center border-3 font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-black dark:border-white shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-900 dark:border-slate-600 hover:border-slate-900'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-black font-['Shantell_Sans',sans-serif]">
                      {count}
                    </div>
                    <div className="text-xs uppercase font-black opacity-90">
                      Pages
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Grand Submission: CREATE MY STORY */}
        <div className="text-center pt-2">
          <button
            type="submit"
            id="create-my-story-btn"
            className="w-full sm:w-auto px-12 py-5 rounded-3xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 border-4 border-slate-900 dark:border-white font-black text-xl sm:text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto font-['Shantell_Sans',sans-serif]"
          >
            <Sparkles className="w-7 h-7 text-amber-400 dark:text-amber-500 animate-spin" />
            <span>{t.generateStoryBtn}</span>
          </button>
          <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 mt-3 font-bold">
            StoryVerse will plan the character Story Bible, illustrate all {pageCount} pages in {selectedImageSize}, and prepare narration.
          </p>
        </div>
      </form>
    </div>
  );
};
