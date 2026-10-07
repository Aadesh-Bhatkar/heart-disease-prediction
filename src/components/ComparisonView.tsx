import React from 'react';
import { ModelResult } from '../types';
import { GitCompare, Trophy, Award, BarChart2, Info, Sparkles } from 'lucide-react';

interface ComparisonViewProps {
  modelResults: ModelResult[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ modelResults }) => {
  const bestModel = [...modelResults].sort(
    (a, b) => b.metrics.accuracy - a.metrics.accuracy
  )[0];

  const modelColorMap: Record<string, { bar: string; badge: string; text: string }> = {
    logistic_regression: {
      bar: 'from-blue-500 to-sky-600',
      badge: 'bg-blue-100 text-blue-800',
      text: 'text-blue-700',
    },
    knn: {
      bar: 'from-purple-500 to-indigo-600',
      badge: 'bg-purple-100 text-purple-800',
      text: 'text-purple-700',
    },
    decision_tree: {
      bar: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-100 text-amber-800',
      text: 'text-amber-700',
    },
    random_forest: {
      bar: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-100 text-emerald-800',
      text: 'text-emerald-700',
    },
    svm: {
      bar: 'from-indigo-500 to-violet-600',
      badge: 'bg-indigo-100 text-indigo-800',
      text: 'text-indigo-700',
    },
    ann: {
      bar: 'from-pink-500 to-rose-600',
      badge: 'bg-pink-100 text-pink-800',
      text: 'text-pink-700',
    },
  };

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner with Richer Gradient */}
      <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border border-teal-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-teal-200">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Model Performance Comparison
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Benchmarking Accuracy, Precision, Recall, and F1 Score across all 6 models on the 20%
              test partition.
            </p>
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Algorithm Benchmark Table
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated on identical 20% holdout test records
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            6 Models Ready
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-black border-b border-slate-200">
              <tr>
                <th className="px-5 py-4">Model Name</th>
                <th className="px-5 py-4 text-center">Paradigm</th>
                <th className="px-5 py-4 text-right font-mono font-black text-blue-900 text-sm">
                  Accuracy
                </th>
                <th className="px-5 py-4 text-right font-mono">Precision</th>
                <th className="px-5 py-4 text-right font-mono">Recall</th>
                <th className="px-5 py-4 text-right font-mono">F1 Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {modelResults.map((m) => {
                const isBest = bestModel && m.id === bestModel.id;
                const colors = modelColorMap[m.id] || modelColorMap['random_forest'];

                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${
                      isBest
                        ? 'bg-amber-50/60 hover:bg-amber-50/90 font-bold'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-5 py-4 font-sans font-black text-slate-900 flex items-center gap-2.5">
                      {isBest && <Trophy className="w-4 h-4 text-amber-500 shrink-0" />}
                      <span>{m.name}</span>
                    </td>
                    <td className="px-5 py-4 text-center font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${colors.badge}`}
                      >
                        {m.type === 'dl' ? 'Deep Learning' : 'Supervised ML'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-black text-blue-700 text-sm">
                      {(m.metrics.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="px-5 py-4 text-right text-slate-800">
                      {(m.metrics.precision * 100).toFixed(1)}%
                    </td>
                    <td className="px-5 py-4 text-right text-slate-800">
                      {(m.metrics.recall * 100).toFixed(1)}%
                    </td>
                    <td className="px-5 py-4 text-right text-slate-900 font-extrabold">
                      {(m.metrics.f1Score * 100).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Colorful Bar Chart Comparing Accuracy */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Accuracy Comparison Bar Chart
          </h3>
          <span className="text-xs font-semibold text-slate-500">Test Set Accuracy (%)</span>
        </div>

        <div className="space-y-4 pt-1">
          {modelResults.map((m) => {
            const pct = Math.round(m.metrics.accuracy * 100);
            const isBest = bestModel && m.id === bestModel.id;
            const colors = modelColorMap[m.id] || modelColorMap['random_forest'];

            return (
              <div key={m.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-2">
                    {isBest && <Trophy className="w-4 h-4 text-amber-500" />}
                    <span>{m.name}</span>
                    {isBest && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded-md uppercase font-extrabold">
                        Top
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-sm">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5 shadow-inner">
                  <div
                    className={`h-full rounded-lg bg-gradient-to-r ${colors.bar} transition-all duration-700 flex items-center justify-end pr-2.5 text-[11px] font-black text-white shadow-sm`}
                    style={{ width: `${pct}%` }}
                  >
                    {pct >= 25 ? `${pct}%` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Model Highlight Card with Rich Gradient */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white rounded-3xl p-8 shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <Trophy className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-black text-emerald-100 uppercase tracking-widest">
              Highest Benchmark Result
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Best Model on Test Data: {bestModel ? bestModel.name : 'Random Forest'}
            </h3>
          </div>
        </div>

        <p className="text-sm font-bold text-emerald-50 leading-relaxed bg-black/15 p-4 rounded-xl border border-white/10">
          &ldquo;The model with the highest accuracy on this test dataset.&rdquo;
        </p>

        <div className="flex items-start gap-2 pt-1 text-xs text-emerald-100">
          <Info className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
          <p>
            Academic Note: Performance depends on the specific dataset distribution and test
            split. We do not claim this model is medically superior.
          </p>
        </div>
      </div>
    </div>
  );
};
