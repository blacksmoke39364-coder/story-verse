import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  PlusCircle,
  Play,
  Volume2,
  Star,
  Search,
  Filter,
  Layers,
} from 'lucide-react';
import { AppView, LanguageCode, Story, StoryTheme } from '../types';
import { getTranslations } from '../utils/translations';

interface StoryLibraryScreenProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  setCurrentView: (view: AppView) => void;
  selectedLanguage?: LanguageCode;
}

export const StoryLibraryScreen: React.FC<StoryLibraryScreenProps> = ({
  stories,
  onSelectStory,
  setCurrentView,
  selectedLanguage = 'en',
}) => {
  const t = getTranslations(selectedLanguage);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = stories.filter((story) => {
    const matchesFilter =
      selectedFilter === 'all' || story.theme.toLowerCase() === selectedFilter.toLowerCase();
    const matchesLang =
      selectedLangFilter === 'all' || (story.language || 'en') === selectedLangFilter;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesLang && matchesSearch;
  });

  return (
    <div id="story-library-screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-amber-100/70 dark:bg-slate-800 border-2 border-amber-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
            📚
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
              {t.myBookshelf}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {t.librarySubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('story_creator')}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer font-['Shantell_Sans',sans-serif]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.createStory}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchStories}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-white font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Theme Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {['all', 'Space', 'Animals', 'Dinosaurs', 'Fantasy', 'Adventure', 'Nature'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                  selectedFilter === filter
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-amber-200 dark:border-slate-700 hover:bg-amber-50'
                }`}
              >
                {filter === 'all' ? 'All Themes' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          <span className="text-slate-400 dark:text-slate-500 mr-1 shrink-0 font-bold">Language:</span>
          {[
            { id: 'all', label: 'All Languages' },
            { id: 'hi', label: 'हिन्दी (Hindi)' },
            { id: 'te', label: 'తెలుగు (Telugu)' },
            { id: 'en', label: 'English' },
            { id: 'gu', label: 'ગુજરાતી (Gujarati)' },
            { id: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLangFilter(lang.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedLangFilter === lang.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-amber-200 dark:border-slate-700 space-y-4">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white font-['Shantell_Sans',sans-serif]">
            No stories match your filter
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Why not create a brand-new adventure right now?
          </p>
          <button
            onClick={() => setCurrentView('story_creator')}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs"
          >
            Create a Story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between text-left"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={story.cover_image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
                    {story.pages.length} Pages
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase">
                    {story.image_size || '2K'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  Age {story.target_age}
                </div>
              </div>

              {/* Story Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                    <span>{story.theme}</span>
                    <span>•</span>
                    <span className="capitalize">{story.art_style}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                      {story.language === 'hi'
                        ? 'हिन्दी (Hindi)'
                        : story.language === 'te'
                        ? 'తెలుగు (Telugu)'
                        : story.language === 'gu'
                        ? 'ગુજરાતી'
                        : story.language === 'pa'
                        ? 'ਪੰਜਾਬੀ'
                        : story.language?.toUpperCase() || 'EN'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif] line-clamp-1">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                    {story.short_description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-amber-100 dark:border-slate-700/80 flex items-center gap-2">
                  <button
                    onClick={() => onSelectStory(story)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Read Book</span>
                  </button>
                  <button
                    onClick={() => onSelectStory(story)}
                    className="p-2.5 rounded-xl bg-amber-100 dark:bg-slate-700 text-amber-900 dark:text-amber-200 hover:bg-amber-200 cursor-pointer"
                    title="Audio narration ready"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
