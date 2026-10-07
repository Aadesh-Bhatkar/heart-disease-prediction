import React from 'react';
import {
  HeartPulse,
  Database,
  BarChart3,
  Sliders,
  Cpu,
  Brain,
  GitCompare,
  UserCheck,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export type TabType =
  | 'home'
  | 'dataset'
  | 'visualization'
  | 'preprocessing'
  | 'models'
  | 'deeplearning'
  | 'comparison'
  | 'prediction'
  | 'about';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  datasetRowsCount: number;
  modelsTrainedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  datasetRowsCount,
  modelsTrainedCount,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: HeartPulse,
      activeColor: 'from-rose-500 to-red-600',
      activeText: 'text-white',
      badge: null,
    },
    {
      id: 'dataset' as TabType,
      label: 'Dataset',
      icon: Database,
      activeColor: 'from-blue-600 to-indigo-600',
      activeText: 'text-white',
      badge: `${datasetRowsCount}`,
    },
    {
      id: 'visualization' as TabType,
      label: 'Visualization',
      icon: BarChart3,
      activeColor: 'from-indigo-600 to-purple-600',
      activeText: 'text-white',
      badge: '5 Charts',
    },
    {
      id: 'preprocessing' as TabType,
      label: 'Preprocessing',
      icon: Sliders,
      activeColor: 'from-amber-500 to-orange-600',
      activeText: 'text-white',
      badge: '80/20',
    },
    {
      id: 'models' as TabType,
      label: 'ML Models',
      icon: Cpu,
      activeColor: 'from-emerald-500 to-teal-600',
      activeText: 'text-white',
      badge: '5 Models',
    },
    {
      id: 'deeplearning' as TabType,
      label: 'Deep Learning',
      icon: Brain,
      activeColor: 'from-purple-600 to-pink-600',
      activeText: 'text-white',
      badge: 'ANN',
    },
    {
      id: 'comparison' as TabType,
      label: 'Comparison',
      icon: GitCompare,
      activeColor: 'from-teal-600 to-cyan-600',
      activeText: 'text-white',
      badge: 'Best',
    },
    {
      id: 'prediction' as TabType,
      label: 'Prediction',
      icon: UserCheck,
      activeColor: 'from-rose-600 to-amber-600',
      activeText: 'text-white',
      badge: 'Live',
    },
    {
      id: 'about' as TabType,
      label: 'How It Works',
      icon: BookOpen,
      activeColor: 'from-blue-600 to-cyan-600',
      activeText: 'text-white',
      badge: 'Viva Q&A',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Decorative Vibrant Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-purple-500 via-indigo-500 via-teal-500 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & College Project Title */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3.5 text-left focus:outline-hidden group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base leading-tight flex items-center gap-2">
                <span>Heart Disease Prediction</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider border border-rose-200">
                  ML Project
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>College Data Science &amp; Machine Learning Lab</span>
              </div>
            </div>
          </button>

          {/* Badges */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Dataset: {datasetRowsCount} rows
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Trained: {modelsTrainedCount}/6 Models
            </span>
          </div>
        </div>

        {/* Tab Navigation with Vibrant Color Badges */}
        <nav className="flex space-x-1.5 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-100 pt-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${tab.activeColor} ${tab.activeText} shadow-md font-bold scale-[1.02]`
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
