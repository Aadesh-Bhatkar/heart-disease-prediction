import React from 'react';
import {
  UploadCloud,
  BarChart2,
  Cpu,
  GitCompare,
  UserCheck,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Activity,
  Heart,
  TrendingUp,
  Brain,
  Zap,
} from 'lucide-react';
import { TabType } from './Navbar';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
  datasetRowsCount: number;
  modelsTrainedCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  datasetRowsCount,
  modelsTrainedCount,
}) => {
  const workflowSteps = [
    {
      step: '1',
      title: 'Upload Dataset',
      desc: 'Load Heart.csv or use the Cleveland 303-patient dataset',
      icon: UploadCloud,
      tab: 'dataset' as TabType,
      border: 'hover:border-blue-500',
      tagColor: 'bg-blue-100 text-blue-700',
      iconBg: 'bg-blue-50 text-blue-600',
      buttonBg: 'text-blue-600',
    },
    {
      step: '2',
      title: 'Explore Data',
      desc: 'Visualize distributions, age trends, and feature correlations',
      icon: BarChart2,
      tab: 'visualization' as TabType,
      border: 'hover:border-indigo-500',
      tagColor: 'bg-indigo-100 text-indigo-700',
      iconBg: 'bg-indigo-50 text-indigo-600',
      buttonBg: 'text-indigo-600',
    },
    {
      step: '3',
      title: 'Train Models',
      desc: 'Train 5 classic ML algorithms and a deep neural network',
      icon: Cpu,
      tab: 'models' as TabType,
      border: 'hover:border-emerald-500',
      tagColor: 'bg-emerald-100 text-emerald-700',
      iconBg: 'bg-emerald-50 text-emerald-600',
      buttonBg: 'text-emerald-600',
    },
    {
      step: '4',
      title: 'Compare Results',
      desc: 'Evaluate test accuracy, precision, recall, and F1 scores',
      icon: GitCompare,
      tab: 'comparison' as TabType,
      border: 'hover:border-teal-500',
      tagColor: 'bg-teal-100 text-teal-700',
      iconBg: 'bg-teal-50 text-teal-600',
      buttonBg: 'text-teal-600',
    },
    {
      step: '5',
      title: 'Make Prediction',
      desc: 'Input new patient parameters and compute heart disease risk',
      icon: UserCheck,
      tab: 'prediction' as TabType,
      border: 'hover:border-rose-500',
      tagColor: 'bg-rose-100 text-rose-700',
      iconBg: 'bg-rose-50 text-rose-600',
      buttonBg: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-10 py-4">
      {/* College Project Hero Header with Rich Dynamic Gradient */}
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-slate-200/80 shadow-md bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        {/* Abstract Colorful Backdrop Circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-wider border border-white/20">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>COLLEGE DATA SCIENCE &amp; MACHINE LEARNING PROJECT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
            Heart Disease Prediction using Machine Learning
          </h1>

          <p className="text-base sm:text-lg text-blue-100 leading-relaxed font-normal">
            &ldquo;This project uses machine learning algorithms to predict whether a person is
            likely to have heart disease based on health-related features.&rdquo;
          </p>

          {/* Quick Metrics Bar on Hero */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-300" />
              <span>303 Clinical Patient Records</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>80% Train / 20% Test Split</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-pink-300" />
              <span>5 ML Models + Deep ANN</span>
            </div>
          </div>

          {/* Core Action Buttons with Vibrant Gradients */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={() => onNavigate('dataset')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Explore Dataset
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('models')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            >
              <Cpu className="w-4 h-4" />
              Train Models
            </button>
            <button
              onClick={() => onNavigate('prediction')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
            >
              <UserCheck className="w-4 h-4" />
              Make Prediction
            </button>
          </div>
        </div>
      </div>

      {/* Machine Learning Workflow Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Machine Learning Project Workflow
            </h2>
            <p className="text-sm text-slate-500">
              Follow the 5 structured phases of the data science and predictive analytics pipeline:
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 uppercase tracking-wider self-start sm:self-auto">
            Supervised Learning Pipeline
          </span>
        </div>

        {/* Workflow Steps Cards with Multi-Color Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {workflowSteps.map((ws) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.step}
                onClick={() => onNavigate(ws.tab)}
                className={`group relative bg-white border-2 border-slate-200/90 rounded-2xl p-5 ${ws.border} hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-8 h-8 rounded-xl ${ws.tagColor} font-black text-xs flex items-center justify-center shadow-2xs`}
                    >
                      Step {ws.step}
                    </span>
                    <div className={`w-8 h-8 rounded-xl ${ws.iconBg} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{ws.desc}</p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold ${ws.buttonBg}`}
                >
                  <span>Open Stage</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Colorful Interactive Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-6 rounded-2xl border border-blue-200 shadow-xs space-y-3 hover:border-blue-400 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-200">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Cleveland Clinical Dataset</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Loaded with 303 genuine patient records featuring 14 medical attributes such as chest
            pain category, resting ECG, blood sugar, serum cholesterol, and maximum exercise heart
            rate.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {datasetRowsCount} patient rows loaded
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-6 rounded-2xl border border-emerald-200 shadow-xs space-y-3 hover:border-emerald-400 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">6 Multi-Paradigm Algorithms</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compare linear models (Logistic Regression), distance-based (KNN), decision rules
            (Decision Tree), ensembles (Random Forest), maximum-margin (SVM), and an Artificial
            Neural Network (ANN).
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {modelsTrainedCount} of 6 algorithms active
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-purple-50/80 via-white to-pink-50/40 p-6 rounded-2xl border border-purple-200 shadow-xs space-y-3 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">College Viva Examination Guide</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Includes transparent step-by-step workflow explanations, metric formulas (Accuracy,
            Recall, Precision, F1), confusion matrix interpretations, and university viva answers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
            >
              Explore Viva Q&amp;A <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Objective & Educational Disclaimer with Warm/Vibrant Tints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 border-2 border-blue-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-blue-900 font-extrabold text-base">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Project Objective
          </div>
          <p className="text-sm text-slate-800 font-medium leading-relaxed">
            &ldquo;To compare different machine learning and deep learning algorithms for heart
            disease prediction and identify which model performs best on the given dataset.&rdquo;
          </p>
          <p className="text-xs text-blue-700 font-medium">
            Designed for undergraduate computer science and data science final-year presentations.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border-2 border-amber-300 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Important Disclaimer
          </div>
          <p className="text-sm text-amber-950 leading-relaxed font-semibold">
            &ldquo;This application is developed for educational purposes only and should not be
            used for actual medical diagnosis.&rdquo;
          </p>
          <p className="text-xs text-amber-800">
            For medical decisions, always rely on certified cardiologists and standard diagnostic
            procedures.
          </p>
        </div>
      </div>
    </div>
  );
};
