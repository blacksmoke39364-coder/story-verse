/**
 * StoryVerse AI - Interactive Bedtime Storybook Platform
 * "Every bedtime becomes a new adventure."
 */

import React, { useState, useEffect } from 'react';
import {
  AppView,
  ArtStyle,
  ChildProfile,
  ImageSizeOption,
  LanguageCode,
  ParentSettings,
  Story,
  StoryChoiceOption,
  StoryTheme,
} from './types';
import { mockStories } from './data/mockStories';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './components/LandingScreen';
import { ChildHomeScreen } from './components/ChildHomeScreen';
import { StoryCreatorScreen } from './components/StoryCreatorScreen';
import { StoryGeneratingScreen } from './components/StoryGeneratingScreen';
import { StoryReaderScreen } from './components/StoryReaderScreen';
import { StoryCompletionScreen } from './components/StoryCompletionScreen';
import { LearningActivityScreen } from './components/LearningActivityScreen';
import { StoryLibraryScreen } from './components/StoryLibraryScreen';
import { ParentDashboardScreen } from './components/ParentDashboardScreen';
import { CreateChildProfileScreen } from './components/CreateChildProfileScreen';
import { PrivacySafetyCenter } from './components/PrivacySafetyCenter';
import { ParentLoginModal } from './components/ParentLoginModal';
import { CompanionChatDrawer } from './components/CompanionChatDrawer';

const DEFAULT_CHILDREN: ChildProfile[] = [
  {
    id: 'child_aarav',
    firstName: 'Aarav',
    age: 7,
    ageGroup: '6-8',
    readingLevel: 'Developing Reader',
    preferredLanguage: 'en',
    favoriteTopics: ['Space', 'Animals', 'Gentle Dinosaurs'],
    favoriteCharacters: ['Pip the Starlight Fox', 'Captain Nova'],
    avatar: '🚀',
    storyDifficulty: 'balanced',
    narrationPreference: {
      voiceStyle: 'warm_narrator',
      speed: 1.0,
      autoPlay: true,
    },
  },
  {
    id: 'child_diya',
    firstName: 'Diya',
    age: 5,
    ageGroup: '3-5',
    readingLevel: 'Early Explorer',
    preferredLanguage: 'hi',
    favoriteTopics: ['Animals', 'Fantasy', 'Indian culture'],
    favoriteCharacters: ['Chintu the Squirrel', 'Gaju the Elephant'],
    avatar: '🦊',
    storyDifficulty: 'gentle',
    narrationPreference: {
      voiceStyle: 'playful_hero',
      speed: 0.9,
      autoPlay: true,
    },
  },
];

const DEFAULT_SETTINGS: ParentSettings = {
  parentPin: '1234',
  dailyReadingTimeMinutes: 20,
  dailyTimeLimitMinutes: 20,
  bedtimeMode: false,
  interactiveChoicesEnabled: true,
  allowInteractiveBranching: true,
  narrationSpeed: 1.0,
  preferredNarrationTone: 'warm_narrator',
  contentRestrictions: ['no_monsters', 'no_weapons', 'no_darkness_fear'],
};

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Child Profiles State
  const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem('storyverse_children');
      return saved ? JSON.parse(saved) : DEFAULT_CHILDREN;
    } catch {
      return DEFAULT_CHILDREN;
    }
  });

  const [activeChild, setActiveChild] = useState<ChildProfile>(() => {
    return childrenProfiles[0] || DEFAULT_CHILDREN[0];
  });

  // Parent Settings & Security State
  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => {
    try {
      const saved = localStorage.getItem('storyverse_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isParentUnlocked, setIsParentUnlocked] = useState<boolean>(false);
  const [isParentLoginOpen, setIsParentLoginOpen] = useState<boolean>(false);

  // Bedtime Mode (Softer night palette)
  const [bedtimeMode, setBedtimeMode] = useState<boolean>(parentSettings.bedtimeMode);

  // Stories Collection
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('storyverse_stories');
      return saved ? JSON.parse(saved) : mockStories;
    } catch {
      return mockStories;
    }
  });

  // Active Story & Creation State
  const [activeStory, setActiveStory] = useState<Story>(() => mockStories[0]);
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Companion Chat State
  const [isCompanionChatOpen, setIsCompanionChatOpen] = useState<boolean>(false);
  const [companionContext, setCompanionContext] = useState<string>('');

  // Multilingual Selector - persists across story generation and UI text localization
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('storyverse_language') as LanguageCode;
      if (saved) return saved;
    } catch {}
    return activeChild.preferredLanguage || 'en';
  });

  // Reading Tracker Minutes
  const [dailyMinutesRead, setDailyMinutesRead] = useState<number>(14);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('storyverse_children', JSON.stringify(childrenProfiles));
    } catch {}
  }, [childrenProfiles]);

  useEffect(() => {
    try {
      localStorage.setItem('storyverse_settings', JSON.stringify(parentSettings));
    } catch {}
  }, [parentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('storyverse_stories', JSON.stringify(stories));
    } catch {}
  }, [stories]);

  // Sync bedtime mode class on document
  useEffect(() => {
    if (bedtimeMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [bedtimeMode]);

  // Launch the featured Aarav demo story
  const handleLaunchDemoStory = () => {
    const demo = stories.find((s) => s.id === 'demo-aarav-lost-star') || mockStories[0];
    setActiveStory(demo);
    setCurrentView('story_reader');
  };

  // Switch active story and open reader
  const handleSelectStory = (story: Story) => {
    setActiveStory(story);
    setCurrentView('story_reader');
  };

  // Open companion chat with custom context
  const handleOpenCompanionChat = (context?: string) => {
    if (context) {
      setCompanionContext(context);
    }
    setIsCompanionChatOpen(true);
  };

  // Interactive Story Branching Choice selection on Page
  const handleSelectChoice = (pageIndex: number, choice: StoryChoiceOption) => {
    if (!activeStory) return;

    const updatedPages = [...activeStory.pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      selected_choice: choice.id,
    };

    // If next page exists, seamlessly weave the choice result into the opening sentence of the next page
    if (pageIndex + 1 < updatedPages.length) {
      const nextPage = updatedPages[pageIndex + 1];
      const prefix =
        choice.id === 'choice-bridge'
          ? 'Taking a gentle step onto the singing bridge, '
          : 'Following the starlight stream with happy whispers, ';

      if (!nextPage.story_text.startsWith('Taking') && !nextPage.story_text.startsWith('Following')) {
        updatedPages[pageIndex + 1] = {
          ...nextPage,
          story_text: `${prefix}${nextPage.story_text.charAt(0).toLowerCase()}${nextPage.story_text.slice(1)}`,
        };
      }
    }

    const updatedStory: Story = {
      ...activeStory,
      pages: updatedPages,
    };

    setActiveStory(updatedStory);
    setStories((prev) => prev.map((s) => (s.id === updatedStory.id ? updatedStory : s)));
  };

  const handleUpdateStory = (updatedStory: Story) => {
    setActiveStory(updatedStory);
    setStories((prev) => prev.map((s) => (s.id === updatedStory.id ? updatedStory : s)));
  };

  // Full Story Generation Workflow via Backend Gemini APIs
  const handleStartGeneration = async (config: {
    idea: string;
    theme: StoryTheme;
    character: string;
    world: string;
    mood: string;
    pageCount: number;
    artStyle: ArtStyle;
    imageSize: ImageSizeOption;
    language?: LanguageCode;
  }) => {
    const storyLanguage = config.language || selectedLanguage;
    setCurrentView('story_generating');
    setIsGeneratingStory(true);

    try {
      // Step 1: Generate Story Bible for character memory continuity
      const bibleRes = await fetch('/api/story/bible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: config.idea,
          theme: config.theme,
          characterName: config.character,
          worldSetting: config.world,
          childAge: activeChild.age,
          language: storyLanguage,
          artStyle: config.artStyle,
        }),
      });

      let bible: any = null;
      if (bibleRes.ok) {
        const bibleData = await bibleRes.json().catch(() => ({}));
        bible = bibleData?.bible;
      }

      if (!bible) {
        bible = {
          story_title: `${config.character || activeChild.firstName} and the Whispering ${config.theme}`,
          target_age: activeChild.age,
          language: storyLanguage,
          main_character: config.character || activeChild.firstName,
          character_description: `A gentle and curious explorer who loves bedtime adventures.`,
          character_visual_description: `${activeChild.age}-year-old child with warm eyes, signature golden-star badge, and cozy clothes.`,
          world_description: config.world || `A magical starlit realm glowing with friendly wonder`,
          art_style: config.artStyle,
          story_theme: config.theme,
          clothing: 'soft bedtime clothes',
        };
      }

      // Step 2: Generate Full Story Pages & Interactive Choices
      const storyRes = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bible,
          pageCount: config.pageCount,
          language: storyLanguage,
          childAge: activeChild.age,
          childProfile: activeChild,
        }),
      });

      let generatedStory: Story | null = null;
      if (storyRes.ok) {
        const storyData = await storyRes.json().catch(() => ({}));
        generatedStory = storyData?.story;
      }

      // Guarantee fallback story if server or parsing had any hiccups
      if (!generatedStory) {
        generatedStory = {
          id: `story_${Date.now()}`,
          child_id: activeChild.id,
          title: bible.story_title || `${config.character || activeChild.firstName}'s Bedtime Adventure`,
          short_description: `A gentle ${config.theme} bedtime tale for ${config.character || activeChild.firstName}.`,
          cover_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
          theme: config.theme,
          art_style: config.artStyle,
          image_size: config.imageSize,
          language: storyLanguage,
          target_age: activeChild.age,
          created_at: new Date().toISOString(),
          completed: false,
          bible,
          pages: [
            {
              page_number: 1,
              story_text: `Once upon a peaceful evening, ${bible.main_character} set off on a wonderful journey through ${bible.world_description}. Soft starlight guided every step with warmth and peace.`,
              narration_text: `Once upon a peaceful evening, ${bible.main_character} set off on a wonderful journey.`,
              image_prompt: `Children's book illustration of ${bible.character_visual_description} in ${bible.world_description}.`,
              image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
              characters_present: [bible.main_character],
              environment: bible.world_description,
              emotional_state: 'Curious and happy',
            },
            {
              page_number: 2,
              story_text: `${bible.main_character} found a glowing starlight bridge. "Welcome friend!" whispered the gentle moonflower. "Together, we can light up tonight's bedtime sky."`,
              narration_text: `${bible.main_character} found a glowing starlight bridge.`,
              image_prompt: `Children's book illustration of ${bible.character_visual_description} on a starlight bridge.`,
              image_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
              characters_present: [bible.main_character],
              environment: bible.world_description,
              emotional_state: 'Wonder and delight',
            },
            {
              page_number: 3,
              story_text: `Ahead lay two wonderful paths. ${bible.main_character} paused to decide which trail would lead to the best bedtime dreams.`,
              narration_text: `Ahead lay two wonderful paths.`,
              image_prompt: `Two glowing paths in a dreamy meadow.`,
              image_url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1200&auto=format&fit=crop',
              characters_present: [bible.main_character],
              environment: bible.world_description,
              emotional_state: 'Thoughtful',
              choice_options: [
                { id: 'c1', text: 'Follow the singing stream', description: 'Gentle water twinkling with stardust', icon: '🌊' },
                { id: 'c2', text: 'Climb the lantern hill', description: 'Soft golden light glowing on the hill', icon: '🏮' },
              ],
            },
            {
              page_number: 4,
              story_text: `Following the quiet path, every gentle breath brought a wave of soothing peace. The whole world seemed ready for sleep.`,
              narration_text: `Following the quiet path, every breath brought peace.`,
              image_prompt: `Peaceful night sky with soft clouds and gentle colors.`,
              image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
              characters_present: [bible.main_character],
              environment: bible.world_description,
              emotional_state: 'Calm and cozy',
            },
            {
              page_number: 5,
              story_text: `Tucked into cozy blankets, ${bible.main_character} closed their eyes with a peaceful smile, ready for the sweetest dreams under the stars.`,
              narration_text: `Tucked into cozy blankets, good night sweet explorer.`,
              image_prompt: `Cozy bed with soft starlight shining through the window.`,
              image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
              characters_present: [bible.main_character],
              environment: 'Cozy bedroom',
              emotional_state: 'Sleepy and safe',
            },
          ],
        };
      }

      // Safely set image size attribute
      generatedStory.image_size = config.imageSize;
      generatedStory.art_style = config.artStyle;
      generatedStory.theme = config.theme;

      // Step 3: Trigger High-Quality Illustrations for Cover & Initial Page
      try {
        const coverRes = await fetch('/api/image/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Book cover illustration for children's bedtime story titled "${generatedStory.title}". Main character: ${bible.character_visual_description}. Setting: ${bible.world_description}. Warm, gentle bedtime mood.`,
            artStyle: config.artStyle,
            imageSize: config.imageSize,
          }),
        });
        if (coverRes.ok) {
          const coverData = await coverRes.json().catch(() => ({}));
          if (coverData?.imageUrl) {
            generatedStory.cover_image = coverData.imageUrl;
          }
        }

        // Generate Page 1 illustration
        if (generatedStory.pages && generatedStory.pages[0]) {
          const p1Res = await fetch('/api/image/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `${generatedStory.pages[0].image_prompt}. Consistent character: ${bible.character_visual_description}.`,
              artStyle: config.artStyle,
              imageSize: config.imageSize,
            }),
          });
          if (p1Res.ok) {
            const p1Data = await p1Res.json().catch(() => ({}));
            if (p1Data?.imageUrl) {
              generatedStory.pages[0].image_url = p1Data.imageUrl;
            }
          }
        }
      } catch (imgErr) {
        console.warn('Cover generation fallback used:', imgErr);
      }

      // Add newly generated story to bookshelf
      setStories((prev) => [generatedStory!, ...prev]);
      setActiveStory(generatedStory);

      // Transition to reading view
      setTimeout(() => {
        setIsGeneratingStory(false);
        setCurrentView('story_reader');
      }, 800);
    } catch (err) {
      console.error('Story generation gracefully handled:', err);
      // Open default cozy story if uninterrupted flow needed
      setActiveStory(mockStories[0]);
      setIsGeneratingStory(false);
      setCurrentView('story_reader');
    }
  };

  // Re-generate individual page illustration with Gemini
  const handleRecreateImage = async (pageNumber: number, size: ImageSizeOption) => {
    if (!activeStory) return;
    const pageIndex = activeStory.pages.findIndex((p) => p.page_number === pageNumber);
    if (pageIndex === -1) return;

    const page = activeStory.pages[pageIndex];
    const prompt = `${page.image_prompt}. Main character: ${activeStory.bible?.character_visual_description || 'A gentle child with warm starlight smile'}.`;

    const res = await fetch('/api/image/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        artStyle: activeStory.art_style,
        imageSize: size,
      }),
    });

    const data = await res.json();
    if (data.imageUrl) {
      const updatedPages = [...activeStory.pages];
      updatedPages[pageIndex] = {
        ...page,
        image_url: data.imageUrl,
      };

      const updatedStory = {
        ...activeStory,
        image_size: size,
        pages: updatedPages,
      };

      setActiveStory(updatedStory);
      setStories((prev) => prev.map((s) => (s.id === updatedStory.id ? updatedStory : s)));
    }
  };

  // Reset custom data
  const handleClearLocalData = () => {
    localStorage.removeItem('storyverse_stories');
    localStorage.removeItem('storyverse_children');
    localStorage.removeItem('storyverse_settings');
    setStories(mockStories);
    setChildrenProfiles(DEFAULT_CHILDREN);
    setActiveChild(DEFAULT_CHILDREN[0]);
    setParentSettings(DEFAULT_SETTINGS);
    alert('Local data reset to default demo stories.');
    setCurrentView('landing');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 ${
        bedtimeMode ? 'bg-slate-950 text-slate-100' : 'bg-amber-50/40 text-slate-900'
      }`}
    >
      {/* Sticky Header Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeChild={activeChild}
        bedtimeMode={bedtimeMode}
        setBedtimeMode={setBedtimeMode}
        isParentUnlocked={isParentUnlocked}
        setIsParentUnlocked={setIsParentUnlocked}
        onOpenParentLogin={() => setIsParentLoginOpen(true)}
        onOpenCompanionChat={() => handleOpenCompanionChat()}
        onLaunchDemoStory={handleLaunchDemoStory}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          setSelectedLanguage(lang);
          setActiveChild((prev) => ({ ...prev, preferredLanguage: lang }));
          try {
            localStorage.setItem('storyverse_language', lang);
          } catch {}
        }}
      />

      {/* Main Dynamic View Router */}
      <main className="flex-1">
        {/* 1. Landing Screen */}
        {currentView === 'landing' && (
          <LandingScreen
            setCurrentView={setCurrentView}
            onLaunchDemo={handleLaunchDemoStory}
            onSelectStory={handleSelectStory}
            demoStory={stories[0] || mockStories[0]}
          />
        )}

        {/* 2. Child Home Screen */}
        {currentView === 'child_home' && (
          <ChildHomeScreen
            child={activeChild}
            stories={stories}
            setCurrentView={setCurrentView}
            onSelectStory={handleSelectStory}
            onOpenCompanionChat={() => handleOpenCompanionChat()}
            dailyMinutesRead={dailyMinutesRead}
            dailyGoalMinutes={parentSettings.dailyTimeLimitMinutes}
            selectedLanguage={selectedLanguage}
          />
        )}

        {/* 3. Story Creator Wizard */}
        {currentView === 'story_creator' && (
          <StoryCreatorScreen
            child={activeChild}
            initialLanguage={selectedLanguage}
            onBack={() => setCurrentView('child_home')}
            onStartGeneration={handleStartGeneration}
          />
        )}

        {/* 4. Story Generating Animation */}
        {currentView === 'story_generating' && (
          <StoryGeneratingScreen
            storyTitle={activeStory?.title || 'Your Story'}
          />
        )}

        {/* 5. Story Reader Screen */}
        {currentView === 'story_reader' && activeStory && (
          <StoryReaderScreen
            story={activeStory}
            child={activeChild}
            bedtimeMode={bedtimeMode}
            onStoryComplete={() => setCurrentView('story_completion')}
            onOpenCompanionChat={handleOpenCompanionChat}
            onSelectChoice={handleSelectChoice}
            onBackToLibrary={() => setCurrentView('story_library')}
            onRecreateImage={handleRecreateImage}
            onUpdateStory={handleUpdateStory}
          />
        )}

        {/* 6. Story Completion Celebration */}
        {currentView === 'story_completion' && activeStory && (
          <StoryCompletionScreen
            story={activeStory}
            onStartLearning={() => setCurrentView('learning_activity')}
            onReadAgain={() => setCurrentView('story_reader')}
            onGoHome={() => setCurrentView('child_home')}
          />
        )}

        {/* 7. Learning Activity Layer */}
        {currentView === 'learning_activity' && activeStory && (
          <LearningActivityScreen
            story={activeStory}
            onFinish={() => {
              setDailyMinutesRead((prev) => prev + 5);
              setCurrentView('story_library');
            }}
            onBackToStory={() => setCurrentView('story_reader')}
          />
        )}

        {/* 8. Story Library Bookshelf */}
        {currentView === 'story_library' && (
          <StoryLibraryScreen
            stories={stories}
            onSelectStory={handleSelectStory}
            setCurrentView={setCurrentView}
            selectedLanguage={selectedLanguage}
          />
        )}

        {/* 9. Parent Dashboard & Analytics */}
        {currentView === 'parent_dashboard' && (
          <ParentDashboardScreen
            childrenProfiles={childrenProfiles}
            activeChild={activeChild}
            onSelectChild={(child) => setActiveChild(child)}
            onAddNewChild={() => setCurrentView('create_child')}
            parentSettings={parentSettings}
            onUpdateSettings={(updated) => {
              setParentSettings(updated);
              setBedtimeMode(updated.bedtimeMode);
            }}
            stories={stories}
            setCurrentView={setCurrentView}
            onLockParentMode={() => {
              setIsParentUnlocked(false);
              setCurrentView('child_home');
            }}
          />
        )}

        {/* 10. Create Child Profile Form */}
        {currentView === 'create_child' && (
          <CreateChildProfileScreen
            onSave={(newChild) => {
              setChildrenProfiles((prev) => [...prev, newChild]);
              setActiveChild(newChild);
              setCurrentView('parent_dashboard');
            }}
            onCancel={() => setCurrentView('parent_dashboard')}
          />
        )}

        {/* 11. Privacy & Safety Center */}
        {currentView === 'privacy_safety' && (
          <PrivacySafetyCenter
            setCurrentView={setCurrentView}
            onClearLocalData={handleClearLocalData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-amber-200/60 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold">
            <span>StoryVerse AI</span>
            <span>•</span>
            <span>Child-Safe Interactive Storybook Engine</span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <button
              onClick={() => setCurrentView('privacy_safety')}
              className="hover:underline cursor-pointer"
            >
              Privacy & Safety Architecture
            </button>
            <button
              onClick={() => {
                if (isParentUnlocked) {
                  setCurrentView('parent_dashboard');
                } else {
                  setIsParentLoginOpen(true);
                }
              }}
              className="hover:underline cursor-pointer"
            >
              Parent Controls
            </button>
          </div>
        </div>
      </footer>

      {/* Parent PIN Authentication Modal */}
      <ParentLoginModal
        isOpen={isParentLoginOpen}
        onClose={() => setIsParentLoginOpen(false)}
        correctPin={parentSettings.parentPin}
        onSuccess={() => {
          setIsParentUnlocked(true);
          setCurrentView('parent_dashboard');
        }}
      />

      {/* AI Story Companion Multi-Turn Chat Drawer */}
      <CompanionChatDrawer
        isOpen={isCompanionChatOpen}
        onClose={() => setIsCompanionChatOpen(false)}
        child={activeChild}
        currentStory={activeStory}
        initialContext={companionContext}
        language={selectedLanguage}
      />
    </div>
  );
}
