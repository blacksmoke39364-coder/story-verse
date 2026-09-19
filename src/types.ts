export type AgeGroup = '3-5' | '6-8' | '9-12';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'te'
  | 'ta'
  | 'kn'
  | 'ml'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'pa';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export type ReadingLevel = 'Early Explorer' | 'Developing Reader' | 'Confident Reader';

export interface ChildProfile {
  id: string;
  firstName: string;
  age: number;
  ageGroup: AgeGroup;
  preferredLanguage: LanguageCode;
  readingLevel: ReadingLevel;
  favoriteTopics: string[];
  favoriteCharacters: string[];
  avatar: string;
  storyDifficulty: 'gentle' | 'balanced' | 'challenging';
  narrationPreference: {
    speed: number; // 0.8 to 1.2
    voiceStyle: 'warm_narrator' | 'playful_hero' | 'curious_robot' | 'wise_animal';
    autoPlay: boolean;
  };
}

export type StoryTheme =
  | 'Space'
  | 'Dinosaurs'
  | 'Animals'
  | 'Fantasy'
  | 'Adventure'
  | 'Science'
  | 'Friendship'
  | 'School'
  | 'Mystery'
  | 'Nature'
  | 'Indian culture'
  | 'Custom';

export type ArtStyle =
  | '3D animated'
  | 'watercolor'
  | 'storybook'
  | 'cartoon'
  | 'soft illustration'
  | 'magical fantasy'
  | 'educational illustration';

export type ImageSizeOption = '1K' | '2K' | '4K';

export interface StoryChoiceOption {
  id: string;
  text: string;
  description?: string;
  icon?: string;
}

export interface StoryBible {
  story_title: string;
  target_age: number;
  language: LanguageCode;
  main_character: string;
  character_description: string;
  character_visual_description: string;
  supporting_characters: string[];
  world_description: string;
  art_style: ArtStyle;
  color_style: string;
  clothing: string;
  personality_traits: string[];
  story_theme: StoryTheme;
  educational_goal: string;
  plot_outline: string[];
  safety_constraints: string[];
}

export interface StoryPage {
  page_number: number;
  story_text: string;
  narration_text: string;
  image_prompt: string;
  image_url?: string;
  characters_present: string[];
  environment: string;
  emotional_state: string;
  learning_goal?: string;
  choice_options?: StoryChoiceOption[];
  selected_choice?: string;
}

export interface LearningQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillType: 'comprehension' | 'vocabulary' | 'creativity' | 'emotional_learning';
}

export interface LearningActivity {
  id: string;
  story_title: string;
  questions: LearningQuestion[];
  reflectionPrompt: string;
  vocabWords: { word: string; definition: string; childFriendlyExample: string }[];
}

export interface Story {
  id: string;
  child_id: string;
  title: string;
  short_description: string;
  cover_image: string;
  theme: StoryTheme;
  art_style: ArtStyle;
  image_size: ImageSizeOption;
  language: LanguageCode;
  target_age: number;
  created_at: string;
  bible: StoryBible;
  pages: StoryPage[];
  completed: boolean;
  learning_activity?: LearningActivity;
}

export interface ParentSettings {
  parentPin: string;
  dailyReadingTimeMinutes?: number;
  dailyTimeLimitMinutes: number;
  bedtimeMode: boolean;
  interactiveChoicesEnabled?: boolean;
  allowInteractiveBranching: boolean;
  narrationSpeed?: number;
  approvedThemes?: StoryTheme[];
  privacyConsent?: boolean;
  dataRetentionDays?: number;
  safeSearchStrictness?: 'strict' | 'standard';
  preferredNarrationTone?: string;
  contentRestrictions?: string[];
}

export interface ParentAnalytics {
  storiesCompleted: number;
  totalListeningMinutes: number;
  favoriteThemes: { theme: string; count: number }[];
  vocabularyLearnedCount: number;
  comprehensionSuccessRate: number; // percentage
  weeklyStreakDays: number;
  recentReadingSessions: {
    id: string;
    storyTitle: string;
    date: string;
    durationMinutes: number;
    pagesRead: number;
    choiceMade: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  senderName: string;
  avatar?: string;
}

export type AppView =
  | 'landing'
  | 'parent_login'
  | 'parent_dashboard'
  | 'create_child_profile'
  | 'child_home'
  | 'story_creator'
  | 'story_generating'
  | 'story_reader'
  | 'story_completion'
  | 'learning_activity'
  | 'story_library'
  | 'parent_analytics'
  | 'settings'
  | 'privacy_safety_center';
