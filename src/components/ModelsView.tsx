import React, { useState } from 'react';
import { ModelResult } from '../types';
import {
  Cpu,
  CheckCircle2,
  Play,
  RotateCw,
  HelpCircle,
  BarChart,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ModelsViewProps {
  modelResults: ModelResult[];
  onTrainModel: (modelId: string) => void;
  onTrainAll: () => void;
  isTraining: boolean;
}

export const ModelsView: React.FC<ModelsViewProps> = ({
  modelResults,
  onTrainModel,
  onTrainAll,
  isTraining,
}) => {
  const [activeModelId, setActiveModelId] = useState<string>('logistic_regression');

  const mlModels = modelResults.filter((m) => m.type === 'ml');
  const selectedModel = mlModels.find((m) => m.id === activeModelId) || mlModels[0];

  const modelThemes: Record<
    string,
    { gradient: string; text: string; bg: string; border: string }
  > = {
    logistic_regression: {
      gradient: 'from-sky-500 to-blue-600',
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-300',
    },
    knn: {
      gradient: 'from-purple-500 to-indigo-600',
      text: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-300',
    },
    decision_tree: {
      gradient: 'from-amber-500 to-orange-600',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
    },
    random_forest: {
      gradient: 'from-emerald-500 to-teal-600',
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
    },
    svm: {
      gradient: 'from-indigo-600 to-violet-700',
      text: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
    },
  };

  const currentTheme =
    modelThemes[selectedModel.id] || modelThemes['logistic_regression'];

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner with Richer Gradient */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Supervised Machine Learning Models
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Train and compare 5 classic classification algorithms evaluated on the 20% holdout
                test set.
              </p>
            </div>
          </div>

          <button
            onClick={onTrainAll}
            disabled={isTraining}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
          >
            {isTraining ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            Train All 5 Models
          </button>
        </div>
      </div>

      {/* Model Selection Tabs / Vivid Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {mlModels.map((m) => {
          const isSelected = m.id === selectedModel.id;
          const theme = modelThemes[m.id];
          return (
            <button
              key={m.id}
              onClick={() => setActiveModelId(m.id)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `bg-gradient-to-br ${theme.gradient} text-white border-transparent shadow-lg scale-102`
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isSelected ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  Model #{mlModels.indexOf(m) + 1}
                </span>
                {m.isTrained && (
                  <CheckCircle2
                    className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-emerald-500'}`}
                  />
                )}
              </div>
              <div className="font-extrabold text-xs truncate">{m.name}</div>
              <div
                className={`text-[11px] font-mono mt-1 font-bold ${
                  isSelected ? 'text-white' : 'text-blue-600'
                }`}
              >
                Acc: {(m.metrics.accuracy * 100).toFixed(1)}%
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Model Focus Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} mb-2`}
            >
              <Zap className="w-3.5 h-3.5" />
              Active Supervised Classifier
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedModel.name}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{selectedModel.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onTrainModel(selectedModel.id)}
              disabled={isTraining}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${currentTheme.gradient} text-white font-extrabold text-xs shadow-md cursor-pointer transition-all hover:scale-105 disabled:opacity-50`}
            >
              {isTraining ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              Train Model
            </button>
          </div>
        </div>

        {/* 4 Core Metrics Required in Brief with Vibrant Cards */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Test Set Evaluation Metrics (20% Holdout Data)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Accuracy */}
            <div className="p-5 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-blue-700">Accuracy</span>
              <div className="text-3xl sm:text-4xl font-black text-blue-950 font-mono">
                {(selectedModel.metrics.accuracy * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-blue-600/90 font-medium">
                (TP + TN) / Total Records
              </p>
            </div>

            {/* Precision */}
            <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-emerald-700">Precision</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-950 font-mono">
                {(selectedModel.metrics.precision * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-emerald-600/90 font-medium">TP / (TP + FP)</p>
            </div>

            {/* Recall */}
            <div className="p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-indigo-700">Recall (Sensitivity)</span>
              <div className="text-3xl sm:text-4xl font-black text-indigo-950 font-mono">
                {(selectedModel.metrics.recall * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-indigo-600/90 font-medium">TP / (TP + FN)</p>
            </div>

            {/* F1 Score */}
            <div className="p-5 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-purple-700">F1 Score</span>
              <div className="text-3xl sm:text-4xl font-black text-purple-950 font-mono">
                {(selectedModel.metrics.f1Score * 100).toFixed(1)}%
              </div>
              <p className="text-[11px] text-purple-600/90 font-medium">
                Harmonic Mean (P &amp; R)
              </p>
            </div>
          </div>
        </div>

        {/* Confusion Matrix & Parameters Grid with High Contrast Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* 2x2 Confusion Matrix */}
          <div className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-600" />
                Confusion Matrix (Test Split)
              </h4>
              <span className="text-[11px] font-semibold text-slate-500">
                Ground Truth vs Predictions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2.5 bg-slate-200/80 text-slate-700 font-sans font-bold text-[11px] rounded-t-xl">
                      Pred: Healthy (0)
                    </th>
                    <th className="p-2.5 bg-slate-200/80 text-slate-700 font-sans font-bold text-[11px] rounded-t-xl">
                      Pred: Disease (1)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 bg-slate-200/80 text-slate-700 font-sans font-bold text-[11px] text-right pr-3 rounded-l-xl">
                      Actual: Healthy (0)
                    </td>
                    <td className="p-4 bg-teal-100 text-teal-950 font-black text-sm border-2 border-white rounded-lg shadow-2xs">
                      <div>TN = {selectedModel.metrics.confusionMatrix.tn}</div>
                      <div className="text-[10px] text-teal-700 font-sans font-semibold">
                        True Negative
                      </div>
                    </td>
                    <td className="p-4 bg-rose-100 text-rose-950 font-black text-sm border-2 border-white rounded-lg shadow-2xs">
                      <div>FP = {selectedModel.metrics.confusionMatrix.fp}</div>
                      <div className="text-[10px] text-rose-700 font-sans font-semibold">
                        False Positive
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 bg-slate-200/80 text-slate-700 font-sans font-bold text-[11px] text-right pr-3 rounded-l-xl">
                      Actual: Disease (1)
                    </td>
                    <td className="p-4 bg-amber-100 text-amber-950 font-black text-sm border-2 border-white rounded-lg shadow-2xs">
                      <div>FN = {selectedModel.metrics.confusionMatrix.fn}</div>
                      <div className="text-[10px] text-amber-700 font-sans font-semibold">
                        False Negative (Critical)
                      </div>
                    </td>
                    <td className="p-4 bg-emerald-100 text-emerald-950 font-black text-sm border-2 border-white rounded-lg shadow-2xs">
                      <div>TP = {selectedModel.metrics.confusionMatrix.tp}</div>
                      <div className="text-[10px] text-emerald-700 font-sans font-semibold">
                        True Positive
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              In cardiology, <strong>False Negatives (FN)</strong> represent sick patients
              incorrectly classified as healthy. Maximizing <strong>Recall</strong> directly
              reduces this critical error.
            </p>
          </div>

          {/* Hyperparameters & Viva Explanation */}
          <div className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-4 shadow-2xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              Algorithm Parameters &amp; Theory
            </h4>

            <div className="space-y-2 text-xs">
              {Object.entries(selectedModel.hyperparameters).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-1.5 border-b border-slate-200"
                >
                  <span className="text-slate-600">{key}:</span>
                  <span className="font-mono font-bold text-slate-900">{String(val)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-600">Training Speed:</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {selectedModel.trainingTimeMs} ms
                </span>
              </div>
            </div>

            <div className="mt-3 p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
              <span className="font-bold block mb-1 text-slate-900">
                Viva Explanation for {selectedModel.name}:
              </span>
              {selectedModel.id === 'logistic_regression' && (
                <span>
                  Logistic regression maps linear combinations of features to probability values
                  between 0 and 1 via the sigmoid function{' '}
                  <code>σ(z) = 1 / (1 + e^-z)</code>. It provides clean probabilistic outputs and
                  straightforward interpretability.
                </span>
              )}
              {selectedModel.id === 'knn' && (
                <span>
                  KNN computes Euclidean distances to identify the k nearest patients in the
                  normalized feature space. It creates non-linear boundaries by majority voting.
                </span>
              )}
              {selectedModel.id === 'decision_tree' && (
                <span>
                  Decision Tree recursively evaluates feature thresholds (e.g. <code>oldpeak &gt; 1.5</code>)
                  to minimize Gini impurity, creating human-readable if-then decision rules.
                </span>
              )}
              {selectedModel.id === 'random_forest' && (
                <span>
                  Random forest trains an ensemble of bootstrapped decision trees and votes on the
                  majority class, dramatically mitigating variance and individual tree overfitting.
                </span>
              )}
              {selectedModel.id === 'svm' && (
                <span>
                  Support Vector Machine maximizes the geometric margin between classes in the
                  scaled feature space using hinge-loss optimization.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
