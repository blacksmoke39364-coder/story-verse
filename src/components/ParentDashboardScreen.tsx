import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  BarChart3,
  Sliders,
  Sparkles,
  Lock,
  Clock,
  Volume2,
  Moon,
  PlusCircle,
  Eye,
  CheckCircle2,
  BookOpen,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { AppView, ChildProfile, ParentSettings, Story } from '../types';

interface ParentDashboardScreenProps {
  childrenProfiles: ChildProfile[];
  activeChild: ChildProfile;
  onSelectChild: (child: ChildProfile) => void;
  onAddNewChild: () => void;
  parentSettings: ParentSettings;
  onUpdateSettings: (settings: ParentSettings) => void;
  stories: Story[];
  setCurrentView: (view: AppView) => void;
  onLockParentMode: () => void;
}

export const ParentDashboardScreen: React.FC<ParentDashboardScreenProps> = ({
  childrenProfiles,
  activeChild,
  onSelectChild,
  onAddNewChild,
  parentSettings,
  onUpdateSettings,
  stories,
  setCurrentView,
  onLockParentMode,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'controls' | 'voice'>('overview');
  const [maxMinutes, setMaxMinutes] = useState(parentSettings.dailyTimeLimitMinutes);
  const [bedtimeActive, setBedtimeActive] = useState(parentSettings.bedtimeMode);
  const [branchingAllowed, setBranchingAllowed] = useState(parentSettings.allowInteractiveBranching);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveControls = () => {
    onUpdateSettings({
      ...parentSettings,
      dailyTimeLimitMinutes: maxMinutes,
      bedtimeMode: bedtimeActive,
      allowInteractiveBranching: branchingAllowed,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div id="parent-dashboard-screen" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Grown-Up Sanctuary
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                PIN Protected
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-['Shantell_Sans',sans-serif]">
              Parent Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Oversee your family's bedtime reading, manage screen time, and customize content safety.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('privacy_safety')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer"
          >
            Safety Architecture
          </button>
          <button
            onClick={onLockParentMode}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Gate</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Child Profiles</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reading Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('controls')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'controls'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Bedtime & Limits</span>
        </button>
      </div>

      {/* TAB 1: Profiles Management */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
              Children in Your Family
            </h2>
            <button
              onClick={onAddNewChild}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Child Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childrenProfiles.map((child) => {
              const isActive = child.id === activeChild.id;
              return (
                <div
                  key={child.id}
                  className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-50/80 dark:bg-slate-800 border-amber-500 shadow-md'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-2xl bg-amber-100 dark:bg-slate-700 shadow-xs">
                          {child.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                              {child.firstName}
                            </h3>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black uppercase">
                                Active Reader
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Age {child.age} • {child.readingLevel} reader • {child.preferredLanguage.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        Favorite topics:{' '}
                        <strong className="text-slate-800 dark:text-white">
                          {child.favoriteTopics.join(', ')}
                        </strong>
                      </div>
                      <div>
                        Voice narration style:{' '}
                        <strong className="text-slate-800 dark:text-white capitalize">
                          {child.narrationPreference.voiceStyle.replace('_', ' ')} (
                          {child.narrationPreference.speed}x speed)
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <button
                      onClick={() => onSelectChild(child)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-amber-100 dark:bg-slate-700 text-amber-900 dark:text-amber-200 hover:bg-amber-200'
                      }`}
                    >
                      {isActive ? 'Current Active Profile' : 'Switch to this Child'}
                    </button>

                    <button
                      onClick={() => setCurrentView('child_home')}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Child View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Reading Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Stories Completed</div>
              <div className="text-3xl font-black text-amber-500 mt-1 font-['Shantell_Sans',sans-serif]">
                14
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">↑ 3 this week</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Minutes Listened</div>
              <div className="text-3xl font-black text-indigo-500 mt-1 font-['Shantell_Sans',sans-serif]">
                94 min
              </div>
              <div className="text-[11px] text-slate-400 font-bold mt-1">Daily avg: 15 min</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Vocabulary Words</div>
              <div className="text-3xl font-black text-emerald-500 mt-1 font-['Shantell_Sans',sans-serif]">
                42
              </div>
              <div className="text-[11px] text-slate-400 font-bold mt-1">Exposed & mastered</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Weekly Streak</div>
              <div className="text-3xl font-black text-orange-500 mt-1 font-['Shantell_Sans',sans-serif]">
                5 Days 🔥
              </div>
              <div className="text-[11px] text-slate-400 font-bold mt-1">Goal: 7 days</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-amber-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
              Themes Explored by {activeChild.firstName}
            </h3>
            <div className="space-y-3">
              {[
                { theme: 'Space & Astronomy', percent: 45, count: '6 stories' },
                { theme: 'Animals & Nature', percent: 30, count: '4 stories' },
                { theme: 'Science & Inventions', percent: 15, count: '2 stories' },
                { theme: 'Indian Culture & Folklore', percent: 10, count: '2 stories' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{item.theme}</span>
                    <span>{item.count} ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Bedtime Controls & Limits */}
      {activeTab === 'controls' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border-2 border-amber-200/80 dark:border-slate-700 shadow-sm space-y-6 text-left">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
            Bedtime & Screen Limits
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Bedtime Mode Warm Palette
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reduces blue light, darkens background, and slows narration cadence after 7:30 PM.
                </p>
              </div>
              <input
                type="checkbox"
                checked={bedtimeActive}
                onChange={(e) => setBedtimeActive(e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Allow Interactive Branching Choices
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Allows child to make choices at page forks. Disable for passive calming bedtime mode.
                </p>
              </div>
              <input
                type="checkbox"
                checked={branchingAllowed}
                onChange={(e) => setBranchingAllowed(e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Daily Reading Time Limit
                </span>
                <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
                  {maxMinutes} minutes
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={maxMinutes}
                onChange={(e) => setMaxMinutes(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>10 min</span>
                <span>20 min (Recommended)</span>
                <span>60 min</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings updated safely!</span>
              </span>
            ) : <span />}

            <button
              onClick={handleSaveControls}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md cursor-pointer"
            >
              Save Parent Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
