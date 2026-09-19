import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  ShieldCheck,
  Languages,
  ArrowRight,
  Play,
  CheckCircle2,
  Star,
  Compass,
  Heart,
  Smile,
  Music,
  Lightbulb,
  Award,
  Zap,
} from 'lucide-react';
import { AppView, Story } from '../types';

interface LandingScreenProps {
  setCurrentView: (view: AppView) => void;
  onLaunchDemo: () => void;
  onSelectStory: (story: Story) => void;
  demoStory: Story;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  setCurrentView,
  onLaunchDemo,
  onSelectStory,
  demoStory,
}) => {
  // Quick enrollment / adventure form state
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('6-8');
  const [favoriteTopic, setFavoriteTopic] = useState('Space');

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('story_creator');
  };

  return (
    <div id="landing-screen" className="relative min-h-screen overflow-hidden dot-pattern-bg pb-20">
      {/* Floating blurred pastel blobs background */}
      <div
        className="absolute top-12 left-10 w-96 h-96 rounded-full bg-[#BFDBFE] opacity-60 blur-3xl pointer-events-none floating-blob-slow -z-10"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute top-72 right-12 w-[28rem] h-[28rem] rounded-full bg-[#FEF08A] opacity-50 blur-3xl pointer-events-none floating-blob-slow -z-10"
        style={{ animationDelay: '2.5s' }}
      />
      <div
        className="absolute top-[1400px] left-1/4 w-[32rem] h-[32rem] rounded-full bg-[#4ECDC4]/20 opacity-40 blur-3xl pointer-events-none floating-blob-slow -z-10"
        style={{ animationDelay: '4s' }}
      />

      {/* 1. HERO SECTION (Two-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Pill badge, Massive 6xl-8xl Quicksand heading (leading 0.95), 3D Yellow Button */}
          <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8">
            {/* Pill-shaped badge for taglines */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 border-2 border-amber-300 dark:border-slate-700 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] animate-ping" />
              <span className="font-quicksand font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 tracking-wide">
                🌟 AI-POWERED BEDTIME STORYBOOK PLATFORM
              </span>
            </div>

            {/* Massive 6xl-8xl heading using Quicksand font with tight leading (0.95) */}
            <h1 className="font-quicksand font-black text-5xl sm:text-7xl lg:text-8xl text-slate-900 dark:text-white leading-[0.95] tracking-tight">
              Every bedtime <br />
              becomes a <br />
              <span className="text-[#0066CC] inline-block hover:scale-105 transition-transform">
                new adventure.
              </span>
            </h1>

            {/* Body copy */}
            <p className="font-medium text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Spark lifelong imagination with personalized storybooks narrated in comforting voices,
              illustrated page-by-page in high-resolution, and guarded by child-safe privacy standards.
            </p>

            {/* CTAs with 3D Yellow Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                id="hero-start-story-btn"
                onClick={() => setCurrentView('story_creator')}
                className="btn-3d-yellow px-8 sm:px-10 py-4 sm:py-5 rounded-3xl font-quicksand font-black text-lg sm:text-xl flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-6 h-6 text-slate-900" />
                <span>Create a Story</span>
                <ArrowRight className="w-5 h-5 text-slate-900" />
              </button>

              <button
                id="hero-demo-story-btn"
                onClick={onLaunchDemo}
                className="btn-3d-teal px-7 sm:px-8 py-4 sm:py-5 rounded-3xl font-quicksand font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Play className="w-5 h-5 text-slate-900 fill-slate-900" />
                <span>Play Live Demo</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Kid-Safe & Zero Ads</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#0066CC] dark:text-blue-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>8 Indian & World Languages</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#FF6B6B]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Parent PIN Gate</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic image stack (12px white border rotated 2deg, secondary rotated -6deg, organic floating badge) */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square flex items-center justify-center">
              {/* Main image with 12px white border rotated 2 degrees */}
              <div className="relative z-10 w-[82%] sm:w-[86%] aspect-[4/5] rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl rotate-2 transition-transform hover:rotate-0 duration-500 bg-white">
                <img
                  src={demoStory.cover_image || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop'}
                  alt="Aarav and the Lost Star Cover"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-left">
                  <span className="px-3 py-1 rounded-full bg-[#FFD700] text-slate-900 font-quicksand font-black text-xs uppercase w-fit mb-2">
                    Featured Story
                  </span>
                  <h3 className="font-quicksand font-bold text-xl sm:text-2xl leading-tight">
                    {demoStory.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                    {demoStory.short_description}
                  </p>
                </div>
              </div>

              {/* Smaller secondary image overlapping bottom-left rotated -6 degrees */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 z-20 w-44 sm:w-56 aspect-square rounded-[2rem] overflow-hidden border-[8px] border-white shadow-xl -rotate-6 transition-transform hover:rotate-0 duration-500 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
                  alt="Tiku the Friendly Dino"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 dark:bg-slate-900/95 py-1 px-2.5 rounded-xl shadow-xs text-center">
                  <p className="font-quicksand font-bold text-[11px] text-slate-800 dark:text-white truncate">
                    🦖 Tiku's Mango Picnic
                  </p>
                </div>
              </div>

              {/* Special Component 2: Organic Floating Badge */}
              <div
                id="organic-floating-badge"
                className="absolute -top-4 -right-2 sm:-right-6 z-30 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#4ECDC4] border-[8px] border-white shadow-xl floating-badge flex flex-col items-center justify-center text-center p-2 text-slate-900"
              >
                <div className="p-2 rounded-full bg-white/80 mb-1">
                  <Sparkles className="w-5 h-5 text-[#0066CC]" />
                </div>
                <span className="font-quicksand font-black text-xs sm:text-sm uppercase tracking-wider leading-tight">
                  100% NEW
                </span>
                <span className="font-quicksand font-extrabold text-[10px] uppercase text-slate-800">
                  ILLUSTRATIONS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACTIVITY GRID (CURRICULUM / BEDTIME ADVENTURES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-quicksand font-extrabold text-sm uppercase tracking-widest text-[#0066CC] dark:text-blue-400">
            Interactive Realm
          </span>
          <h2 className="font-quicksand font-black text-3xl sm:text-5xl text-slate-900 dark:text-white">
            Choose Tonight's Bedtime Curriculum
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            Every story combines rich visual artistry, comforting audio narration, and values of empathy and kindness.
          </p>
        </div>

        {/* 4-column grid for desktop with 3rem rounded containers, top image 2rem radius, bouncy card hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              title: 'Cosmic Constellations',
              category: 'Space Exploration',
              categoryColor: 'bg-blue-100 text-blue-800',
              iconBoxColor: 'bg-[#0066CC] text-white',
              icon: Sparkles,
              img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
              desc: 'Help baby stars find their way home while learning planetary orbits and peaceful courage.',
              age: 'Ages 4-8',
            },
            {
              title: 'Gentle Giants Picnic',
              category: 'Prehistoric Nature',
              categoryColor: 'bg-amber-100 text-amber-800',
              iconBoxColor: 'bg-[#FFD700] text-slate-900',
              icon: Compass,
              img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
              desc: 'Meet friendly plant-eating baby dinosaurs sharing ripe mangoes near sunlit waterfalls.',
              age: 'Ages 3-7',
            },
            {
              title: 'Enchanted Forest Friends',
              category: 'Fantasy & Empathy',
              categoryColor: 'bg-teal-100 text-teal-800',
              iconBoxColor: 'bg-[#4ECDC4] text-slate-900',
              icon: Heart,
              img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800&auto=format&fit=crop',
              desc: 'Solve forest riddles with Pip the Fox and Barnaby the Moon Owl to restore harmony.',
              age: 'Ages 5-10',
            },
            {
              title: 'Curious Deep Ocean',
              category: 'Marine Wonder',
              categoryColor: 'bg-rose-100 text-rose-800',
              iconBoxColor: 'bg-[#FF6B6B] text-white',
              icon: Zap,
              img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
              desc: 'Swim alongside glowing jellyfish and baby sea turtles to find the singing starlight pearl.',
              age: 'Ages 6-12',
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bouncy-card rounded-[3rem] bg-white dark:bg-slate-850 p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between text-left cursor-pointer group"
              onClick={() => setCurrentView('story_creator')}
            >
              <div>
                {/* Top image with 2rem radius */}
                <div className="relative w-full h-48 rounded-[2rem] overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full font-quicksand font-bold text-xs ${card.categoryColor} shadow-xs`}
                  >
                    {card.category}
                  </span>
                </div>

                {/* Icon in colored 2xl-radius box */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-2xl ${card.iconBoxColor} flex items-center justify-center shadow-sm shrink-0`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-quicksand font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                      {card.title}
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                      {card.age}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-quicksand font-bold text-xs text-[#0066CC] dark:text-blue-400 group-hover:underline">
                  Start Adventure
                </span>
                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#0066CC] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VIDEO / STORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Full-width section with 4rem rounded blue container */}
        <div className="relative overflow-hidden rounded-[4rem] bg-[#0066CC] text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
          {/* Blurred decorative blobs in background */}
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#FEF08A] opacity-30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#4ECDC4] opacity-35 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 text-left space-y-5">
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-quicksand font-black text-xs uppercase tracking-widest inline-block">
                Interactive Showcase
              </span>
              <h2 className="font-quicksand font-black text-3xl sm:text-5xl leading-tight">
                Watch how every page comes to life.
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium">
                Experience synchronized narration, high-definition illustrations, interactive story branches, and cozy bedtime music in real-time.
              </p>

              <div className="pt-2">
                <button
                  onClick={onLaunchDemo}
                  className="btn-3d-yellow px-8 py-4 rounded-2xl font-quicksand font-black text-base sm:text-lg flex items-center gap-3 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-slate-900 text-slate-900" />
                  <span>Launch Live Story Reader</span>
                </button>
              </div>
            </div>

            {/* Aspect-video thumbnail with 12px white/10 border and central pulsing play icon */}
            <div className="lg:col-span-7">
              <div
                onClick={onLaunchDemo}
                className="relative aspect-video rounded-[2.5rem] overflow-hidden border-[12px] border-white/15 shadow-2xl cursor-pointer group bg-slate-950"
              >
                <img
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop"
                  alt="Story Reader Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  referrerPolicy="no-referrer"
                />

                {/* Ambient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-6">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      Gemini Natural TTS (Warm Narrator)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-quicksand font-black text-xs">
                      Page 1 of 5
                    </span>
                  </div>

                  {/* Center Pulsing Play Icon */}
                  <div className="self-center my-auto flex flex-col items-center gap-3">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-[#0066CC] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 relative">
                      <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-[#0066CC] ml-1" />
                    </div>
                    <span className="font-quicksand font-black text-xs sm:text-sm uppercase tracking-wider text-white drop-shadow-md">
                      Click to Read "Aarav & the Lost Star"
                    </span>
                  </div>

                  <div className="text-left text-xs text-slate-200">
                    <p className="font-medium italic">
                      "Beneath the silver shimmer of the crescent moon, Aarav noticed a gentle golden glow..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AGE GROUPS / CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="font-quicksand font-extrabold text-sm uppercase tracking-widest text-[#FF6B6B]">
            Age-Calibrated Learning
          </span>
          <h2 className="font-quicksand font-black text-3xl sm:text-5xl text-slate-900 dark:text-white">
            Designed for Every Reading Stage
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            From rhythmic toddler lullabies to chapter-style elementary quests.
          </p>
        </div>

        {/* 4-column grid of colored cards (Blue-50, Yellow-50, Teal-50, Purple-50) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
              accent: 'text-[#0066CC]',
              icon: '🍼',
              title: 'Ages 3–5',
              subtitle: 'Early Explorers',
              desc: 'Gentle rhythms, repetitive soothing refrains, and vibrant animal characters designed for bedtime calm.',
            },
            {
              bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
              accent: 'text-amber-600',
              icon: '🚀',
              title: 'Ages 6–8',
              subtitle: 'Developing Readers',
              desc: 'Interactive branching choices, simple moral dilemmas, and word-by-word highlighted narration.',
            },
            {
              bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900',
              accent: 'text-teal-600',
              icon: '🧭',
              title: 'Ages 9–10',
              subtitle: 'Confident Adventurers',
              desc: 'Richer vocabulary, mysterious natural science puzzles, and deeper character perspectives.',
            },
            {
              bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900',
              accent: 'text-purple-600',
              icon: '👑',
              title: 'Ages 11–12',
              subtitle: 'Chapter Builders',
              desc: 'Mythological tales, creative world-building prompts, and post-story emotional reflections.',
            },
          ].map((tier, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-[3rem] p-6 sm:p-8 border-2 ${tier.bg} text-left flex flex-col justify-between shadow-xs hover:shadow-md transition-all group`}
            >
              <div>
                {/* White 3xl-rounded icon box */}
                <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  {tier.icon}
                </div>

                <span className={`font-quicksand font-bold text-xs uppercase tracking-wider ${tier.accent}`}>
                  {tier.subtitle}
                </span>
                <h3 className="font-quicksand font-black text-2xl text-slate-900 dark:text-white mt-1 mb-3">
                  {tier.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {tier.desc}
                </p>
              </div>

              {/* Subtle SVG geometric pattern at bottom with 20% opacity */}
              <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                <span className="font-quicksand font-bold text-xs text-slate-500">
                  Curated Vocabulary
                </span>
                <svg className="w-12 h-6 opacity-20 text-current" viewBox="0 0 100 40">
                  <circle cx="20" cy="20" r="10" fill="currentColor" />
                  <rect x="45" y="10" width="20" height="20" rx="5" fill="currentColor" />
                  <polygon points="85,10 95,30 75,30" fill="currentColor" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEACHER / TEAM / STORYTELLER PROFILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 2x2 grid of team cards where images have 2rem radius and cards are rotated (-3 or 3 degrees) like polaroids */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                name: 'Barnaby Owl',
                role: 'Wise Bedtime Guide',
                img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
                rotate: '-rotate-3',
                badge: '🦉 AI Companion',
              },
              {
                name: 'Captain Nova',
                role: 'Starlight Explorer',
                img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
                rotate: 'rotate-3',
                badge: '🚀 Space Realm',
              },
              {
                name: 'Dadi Storyteller',
                role: 'Cultural Folklore',
                img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
                rotate: 'rotate-2',
                badge: '🪔 Indian Heritage',
              },
              {
                name: 'Stella Star',
                role: 'Gentle Lullabies',
                img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
                rotate: '-rotate-3',
                badge: '✨ Sleep Calmer',
              },
            ].map((guide, idx) => (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-[2rem] shadow-lg border border-slate-200/80 dark:border-slate-700 ${guide.rotate} hover:rotate-0 transition-transform duration-300`}
              >
                <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-3 bg-slate-100 dark:bg-slate-900">
                  <img
                    src={guide.img}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left px-1">
                  <span className="text-[10px] font-bold text-[#0066CC] dark:text-blue-400">
                    {guide.badge}
                  </span>
                  <h4 className="font-quicksand font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                    {guide.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {guide.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Descriptive text with bullet points using check-circle icons and colored backgrounds */}
          <div className="lg:col-span-6 text-left space-y-6">
            <span className="font-quicksand font-extrabold text-sm uppercase tracking-widest text-[#4ECDC4]">
              Pedagogy & Child Psychology
            </span>
            <h2 className="font-quicksand font-black text-3xl sm:text-5xl text-slate-900 dark:text-white leading-tight">
              Guided by child development experts and caring parents.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              StoryVerse AI was designed with pediatric cognitive principles. Stories don't just entertain—they foster emotional regulation, bedtime relaxation, and cognitive curiosity.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60">
                <CheckCircle2 className="w-5 h-5 text-[#0066CC] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-quicksand font-bold text-sm text-slate-900 dark:text-white">
                    Sleep-Inducing Pacing & Vocabulary
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                    Narratives begin with light adventure and gradually soften into rhythmic, calm vocabulary by the final page.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60">
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-quicksand font-bold text-sm text-slate-900 dark:text-white">
                    Non-Overstimulating Visual Language
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                    No fast flashing animations, sirens, or chaotic jump cuts. Pure static picture-book warmth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/60">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-quicksand font-bold text-sm text-slate-900 dark:text-white">
                    Cultural Inclusivity & Indian Heritage
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                    Rich folklore, monsoon melodies, and regional languages (Hindi, Tamil, Telugu, and more).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ENROLLMENT / ADVENTURE CREATOR CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* High-contrast Slate-900 background with 4rem border-radius, radial dot pattern */}
        <div className="relative overflow-hidden rounded-[4rem] bg-slate-900 text-white p-8 sm:p-14 lg:p-16 dot-pattern-dark shadow-2xl border border-slate-800">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="px-4 py-1.5 rounded-full bg-white/10 text-[#FFD700] font-quicksand font-black text-xs uppercase tracking-widest inline-block">
              Free Family Access
            </span>

            <h2 className="font-quicksand font-black text-3xl sm:text-5xl lg:text-6xl leading-tight">
              Start Tonight's Magic Bedtime Story
            </h2>

            <p className="text-slate-300 text-sm sm:text-lg font-medium max-w-xl mx-auto">
              Join thousands of families turning bedtime struggles into moments of peaceful bonding, laughter, and wonder.
            </p>

            {/* Form fields: bg-white/10 with white borders and bold text */}
            <form onSubmit={handleEnrollSubmit} className="space-y-4 pt-4 max-w-xl mx-auto text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-quicksand text-slate-300">
                    Child's First Name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Aarav, Diya, Leo"
                    className="w-full p-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-bold placeholder-slate-400 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-quicksand text-slate-300">
                    Age Group
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-bold focus:outline-none focus:border-[#FFD700] cursor-pointer"
                  >
                    <option value="3-5" className="text-slate-900 bg-white">Ages 3–5 (Rhymes & Animals)</option>
                    <option value="6-8" className="text-slate-900 bg-white">Ages 6–8 (Space & Dinosaur Quests)</option>
                    <option value="9-12" className="text-slate-900 bg-white">Ages 9–12 (Mystery & Heritage)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold font-quicksand text-slate-300">
                  Favorite Theme or Dream Adventure
                </label>
                <input
                  type="text"
                  value={favoriteTopic}
                  onChange={(e) => setFavoriteTopic(e.target.value)}
                  placeholder="e.g. A friendly dragon who loves strawberry mango ice cream"
                  className="w-full p-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-bold placeholder-slate-400 focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              {/* Submit button: full-width yellow 3D button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="btn-3d-yellow w-full py-5 rounded-2xl font-quicksand font-black text-lg sm:text-xl text-slate-900 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Sparkles className="w-6 h-6 text-slate-900" />
                  <span>Launch Bedtime Adventure Now</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 font-semibold pt-1">
                No credit card required • Zero ads • COPPA compliant • Parent-controlled accounts
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
