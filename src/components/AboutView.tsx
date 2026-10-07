import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  ShieldAlert,
  FileSpreadsheet,
  Wrench,
  Sliders,
  Split,
  Cpu,
  BarChart,
  UserCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [openVivaIndex, setOpenVivaIndex] = useState<number | null>(0);
  const [vivaFilter, setVivaFilter] = useState<string>('');

  const steps = [
    {
      number: '1',
      title: 'Step 1 — Collect Data',
      desc: 'We use Heart.csv containing health-related information.',
      detail:
        'The dataset contains 303 clinical records with 14 attributes collected from patients including age, sex, chest pain category, resting blood pressure, cholesterol, resting electrocardiographic results, and maximum exercise heart rate.',
      icon: FileSpreadsheet,
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      numColor: 'bg-blue-600 text-white',
    },
    {
      number: '2',
      title: 'Step 2 — Clean Data',
      desc: 'We handle missing or incorrect values.',
      detail:
        'Checked for null values, anomalous characters (like question marks), and duplicates. Missing numeric values are imputed with median or mean averages so the pipeline remains unbroken without discarding precious medical records.',
      icon: Wrench,
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      numColor: 'bg-indigo-600 text-white',
    },
    {
      number: '3',
      title: 'Step 3 — Preprocess Data',
      desc: 'We convert the data into a format suitable for machine learning.',
      detail:
        'All categorical fields are encoded cleanly into numerical format. Continuous features are standardized using StandardScaler: z = (x - mean) / standard_deviation, so features with large values do not dominate the learning algorithms.',
      icon: Sliders,
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      numColor: 'bg-purple-600 text-white',
    },
    {
      number: '4',
      title: 'Step 4 — Split Data',
      desc: 'We divide the data into training and testing sets.',
      detail:
        'We perform an 80/20 train-test split (80% training data = 242 rows, 20% testing data = 61 rows). The models train exclusively on the 80% partition and are strictly evaluated on the remaining 20% holdout set to test generalization.',
      icon: Split,
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      numColor: 'bg-teal-600 text-white',
    },
    {
      number: '5',
      title: 'Step 5 — Train Models',
      desc: 'We train different machine learning algorithms.',
      detail:
        'We train 5 classic algorithms (Logistic Regression, KNN, Decision Tree, Random Forest, SVM) and 1 Deep Learning Artificial Neural Network (ANN) using default parameters to compare linear, non-linear, ensemble, and neural representations.',
      icon: Cpu,
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      numColor: 'bg-emerald-600 text-white',
    },
    {
      number: '6',
      title: 'Step 6 — Evaluate Models',
      desc: 'We compare their accuracy and other metrics.',
      detail:
        'We measure Accuracy, Precision, Recall, F1 Score, and inspect the Confusion Matrix (TP, TN, FP, FN). Special attention is given to Recall (sensitivity) to minimize False Negatives where sick patients are misdiagnosed.',
      icon: BarChart,
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      numColor: 'bg-sky-600 text-white',
    },
    {
      number: '7',
      title: 'Step 7 — Prediction',
      desc: 'The selected model predicts the result for new input data.',
      detail:
        'A user or physician can enter patient parameters into the prediction form. The input values are standardized using the stored training scaling parameters, fed into the selected model, and classified as Disease Present or No Disease with estimated probability.',
      icon: UserCheck,
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      numColor: 'bg-amber-600 text-white',
    },
  ];

  const vivaQuestions = [
    {
      q: 'Why do we split data into 80% training and 20% testing?',
      a: 'If we test a model on the same data it learned from, it can achieve 100% simply by memorizing (overfitting). Splitting 80/20 ensures the test data is completely unseen, verifying that the model can generalize to future patients.',
      tag: 'Data Splitting',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      q: 'Why is Accuracy alone not enough in medical prediction?',
      a: 'If 90% of patients are healthy and a model simply predicts "healthy" for everyone, it has 90% accuracy but misses 100% of sick patients! Metrics like Recall and F1 Score measure how many actual sick patients were correctly flagged.',
      tag: 'Evaluation Metrics',
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      q: 'Why is feature scaling (StandardScaler) necessary for KNN and Neural Networks?',
      a: 'Cholesterol values are around 250, while ST depression is around 1.0. Distance-based algorithms like KNN calculate distances using Euclidean formula; without scaling, cholesterol would dominate the distance calculation 200 times more than ST depression.',
      tag: 'Feature Scaling',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      q: 'Why use an Artificial Neural Network (ANN) instead of a CNN?',
      a: 'Convolutional Neural Networks (CNNs) are built for spatial grid data like images. Heart.csv is a tabular dataset consisting of distinct clinical variables. Dense (fully connected) layers are the standard and optimal architecture for tabular records.',
      tag: 'Deep Learning',
      color: 'bg-pink-100 text-pink-800',
    },
    {
      q: 'What is Gini Impurity in Decision Trees?',
      a: 'Gini impurity measures how "mixed" a subset of data is. A Gini of 0 means pure (all patients have heart disease, or all are healthy). The Decision Tree algorithm picks feature splits that maximize the reduction in Gini impurity.',
      tag: 'Decision Trees',
      color: 'bg-amber-100 text-amber-800',
    },
    {
      q: 'What is the role of the Sigmoid activation in Logistic Regression and Neural Network outputs?',
      a: 'Sigmoid maps any real-valued number from -∞ to +∞ into the (0, 1) probability range via σ(z) = 1 / (1 + e^-z). This gives a direct probability percentage for medical diagnosis.',
      tag: 'Activation Functions',
      color: 'bg-teal-100 text-teal-800',
    },
  ];

  const filteredViva = vivaQuestions.filter(
    (v) =>
      v.q.toLowerCase().includes(vivaFilter.toLowerCase()) ||
      v.a.toLowerCase().includes(vivaFilter.toLowerCase()) ||
      v.tag.toLowerCase().includes(vivaFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner with Richer Gradient */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
          <BookOpen className="w-4 h-4" />
          Project Architecture &amp; Methodology
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How the Project Works
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          An end-to-end overview of the data science lifecycle implemented in this heart disease
          prediction system, explained in simple, beginner-friendly terms.
        </p>
      </div>

      {/* 7 Workflow Steps as requested */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          7-Step Machine Learning Pipeline
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((st) => (
            <div
              key={st.number}
              className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start gap-4 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${st.numColor} font-black text-base flex items-center justify-center shrink-0 shadow-md`}
              >
                {st.number}
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base sm:text-lg font-black text-slate-900">{st.title}</h4>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${st.badge}`}
                  >
                    Phase {st.number}
                  </span>
                </div>
                <p className="text-xs font-bold text-blue-700">{st.desc}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{st.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Objective & Disclaimer Boxes (Required) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border-2 border-blue-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-blue-900 font-black text-base">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Project Objective
          </div>
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">
            &ldquo;To compare different machine learning and deep learning algorithms for heart
            disease prediction and identify which model performs best on the given dataset.&rdquo;
          </p>
          <p className="text-xs text-blue-800 font-medium">
            This study demonstrates the complete supervised workflow from raw CSV intake through to
            model comparison and single-patient probability scoring.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-black text-base">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Disclaimer
          </div>
          <p className="text-sm text-amber-950 font-black leading-relaxed">
            &ldquo;This application is developed for educational purposes only and should not be
            used for actual medical diagnosis.&rdquo;
          </p>
          <p className="text-xs text-amber-800 font-medium">
            Machine learning predictions are statistical estimates based on historical sample data
            and must never replace qualified clinical judgement by physicians.
          </p>
        </div>
      </div>

      {/* College Viva Questions & Answers Section with Interactive Accordions */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                Frequently Asked Viva Examination Questions
              </h3>
              <p className="text-xs text-slate-500">
                Click any question to view the comprehensive academic answer
              </p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search viva questions..."
            value={vivaFilter}
            onChange={(e) => setVivaFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-blue-500 w-full sm:w-56 bg-slate-50 shadow-2xs font-medium"
          />
        </div>

        <div className="space-y-3">
          {filteredViva.map((vq, i) => {
            const isOpen = openVivaIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50/60 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenVivaIndex(isOpen ? null : i)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{vq.q}</span>
                    <span
                      className={`hidden sm:inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${vq.color}`}
                    >
                      {vq.tag}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                    <span className="font-black text-indigo-700 block mb-1">Examiner Answer:</span>
                    {vq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
