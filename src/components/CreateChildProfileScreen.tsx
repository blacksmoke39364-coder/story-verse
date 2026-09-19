import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Check, Volume2, User, Smile } from 'lucide-react';
import { ChildProfile, LanguageCode, ReadingLevel } from '../types';
import { CHARACTER_AVATARS, LANGUAGES, THEMES } from '../data/constants';

interface CreateChildProfileScreenProps {
  onSave: (profile: ChildProfile) => void;
  onCancel: () => void;
}

export const CreateChildProfileScreen: React.FC<CreateChildProfileScreenProps> = ({
  onSave,
  onCancel,
}) => {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState<number>(7);
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>('en');
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('Developing Reader');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [favoriteTopics, setFavoriteTopics] = useState<string[]>(['Space', 'Animals']);
  const [voiceStyle, setVoiceStyle] = useState<'warm_narrator' | 'playful_hero' | 'curious_robot' | 'wise_animal'>('warm_narrator');
  const [speed, setSpeed] = useState<number>(1.0);

  const toggleTopic = (topic: string) => {
    if (favoriteTopics.includes(topic)) {
      setFavoriteTopics(favoriteTopics.filter((t) => t !== topic));
    } else {
      setFavoriteTopics([...favoriteTopics, topic]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return;

    const ageGroup = age <= 5 ? '3-5' : age <= 8 ? '6-8' : '9-12';

    const newProfile: ChildProfile = {
      id: `child_${Date.now()}`,
      firstName: firstName.trim(),
      age,
      ageGroup,
      readingLevel,
      preferredLanguage,
      favoriteTopics: favoriteTopics.length > 0 ? favoriteTopics : ['Space', 'Animals'],
      favoriteCharacters: ['Pip the Fox', 'Barnaby the Owl'],
      avatar: selectedAvatar,
      storyDifficulty: 'balanced',
      narrationPreference: {
        voiceStyle,
        speed,
        autoPlay: true,
      },
    };

    onSave(newProfile);
  };

  return (
    <div id="create-child-profile-container" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel</span>
      </button>

      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200 dark:border-slate-700 shadow-xl space-y-8 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-slate-700 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Family Profile Setup</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
            Add a Young Reader
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalize the story vocabulary, language, and narration pacing to match your child's age.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Child's First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Diya, Rohan, Maya"
                className="w-full p-3.5 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Child's Age ({age} years old)
              </label>
              <input
                type="range"
                min={3}
                max={12}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full mt-3 accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>3 (Toddler)</span>
                <span>7 (Early)</span>
                <span>12 (Pre-Teen)</span>
              </div>
            </div>
          </div>

          {/* Avatar Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Choose an Avatar
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CHARACTER_AVATARS.map((av) => (
                <button
                  type="button"
                  key={av.label}
                  onClick={() => setSelectedAvatar(av.emoji)}
                  className={`p-3 rounded-2xl border-2 text-2xl transition-all cursor-pointer ${
                    selectedAvatar === av.emoji
                      ? 'bg-amber-100 border-amber-500 scale-110 shadow-xs'
                      : 'bg-amber-50/30 dark:bg-slate-800 border-amber-100 dark:border-slate-700 hover:border-amber-300'
                  }`}
                  title={av.label}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language & Reading Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Default Story Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label} ({lang.nativeLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reading Stage
              </label>
              <select
                value={readingLevel}
                onChange={(e) => setReadingLevel(e.target.value as ReadingLevel)}
                className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 font-bold text-xs text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="Early Explorer">Early Explorer (Ages 3-5, simple rhythm & rhymes)</option>
                <option value="Developing Reader">Developing Reader (Ages 6-8, short cozy sentences)</option>
                <option value="Confident Reader">Confident Reader (Ages 9-12, richer bedtime vocabulary)</option>
              </select>
            </div>
          </div>

          {/* Favorite Topics Multi-selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Favorite Topics
            </label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((theme) => {
                const isPicked = favoriteTopics.includes(theme.id);
                return (
                  <button
                    type="button"
                    key={theme.id}
                    onClick={() => toggleTopic(theme.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isPicked
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-amber-50/40 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-amber-100 dark:border-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <span>{theme.icon}</span>
                    <span>{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Narration Preference */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span>Narration Preference for Bedtime</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'warm_narrator', label: 'Warm Bedtime Narrator' },
                { id: 'playful_hero', label: 'Playful Adventure Hero' },
                { id: 'curious_robot', label: 'Gentle Friendly Robot' },
                { id: 'wise_animal', label: 'Wise Moon Owl' },
              ].map((voice) => (
                <button
                  type="button"
                  key={voice.id}
                  onClick={() => setVoiceStyle(voice.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-bold cursor-pointer ${
                    voiceStyle === voice.id
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {voice.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md cursor-pointer font-['Shantell_Sans',sans-serif]"
            >
              Save Child Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
