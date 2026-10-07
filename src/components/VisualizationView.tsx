import React, { useMemo, useState } from 'react';
import { ParsedDataset } from '../types';
import {
  BarChart3,
  Activity,
  Heart,
  Users,
  Flame,
  Info,
  Sparkles,
} from 'lucide-react';

interface VisualizationViewProps {
  dataset: ParsedDataset;
}

export const VisualizationView: React.FC<VisualizationViewProps> = ({ dataset }) => {
  const targetCol = dataset.targetColumn;
  const rows = dataset.rows;

  const [activeHeatmapCell, setActiveHeatmapCell] = useState<{
    x: string;
    y: string;
    val: number;
  } | null>(null);

  // 1. Heart disease distribution (target: 0 vs 1)
  const targetStats = useMemo(() => {
    let disease = 0;
    let noDisease = 0;
    rows.forEach((r) => {
      const val = r[targetCol];
      if (val > 0) disease++;
      else noDisease++;
    });
    const total = rows.length || 1;
    return {
      disease,
      noDisease,
      diseasePct: Math.round((disease / total) * 100),
      noDiseasePct: Math.round((noDisease / total) * 100),
      total,
    };
  }, [rows, targetCol]);

  // 2. Age distribution bins (<40, 40-49, 50-59, 60-69, 70+)
  const ageDistribution = useMemo(() => {
    const bins = [
      { label: '<40', count: 0, min: 0, max: 39, color: 'from-blue-400 to-blue-600' },
      { label: '40–49', count: 0, min: 40, max: 49, color: 'from-indigo-400 to-indigo-600' },
      { label: '50–59', count: 0, min: 50, max: 59, color: 'from-purple-400 to-purple-600' },
      { label: '60–69', count: 0, min: 60, max: 69, color: 'from-pink-400 to-pink-600' },
      { label: '70+', count: 0, min: 70, max: 120, color: 'from-rose-400 to-rose-600' },
    ];
    rows.forEach((r) => {
      const age = r['age'];
      if (age !== undefined) {
        const b = bins.find((bin) => age >= bin.min && age <= bin.max);
        if (b) b.count++;
      }
    });
    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    return { bins, maxCount };
  }, [rows]);

  // 3. Gender distribution (sex: 0 = Female, 1 = Male)
  const genderStats = useMemo(() => {
    let maleTotal = 0;
    let maleDisease = 0;
    let femaleTotal = 0;
    let femaleDisease = 0;

    rows.forEach((r) => {
      const sex = r['sex'];
      const hasDisease = r[targetCol] > 0;
      if (sex === 1) {
        maleTotal++;
        if (hasDisease) maleDisease++;
      } else {
        femaleTotal++;
        if (hasDisease) femaleDisease++;
      }
    });

    return {
      maleTotal,
      maleDisease,
      malePct: Math.round((maleTotal / (rows.length || 1)) * 100),
      femaleTotal,
      femaleDisease,
      femalePct: Math.round((femaleTotal / (rows.length || 1)) * 100),
    };
  }, [rows, targetCol]);

  // 4. Cholesterol distribution bins (<200 Desirable, 200-239 Borderline, >=240 High)
  const cholDistribution = useMemo(() => {
    const bins = [
      {
        label: '<200',
        title: 'Desirable',
        count: 0,
        color: 'from-emerald-400 to-emerald-600',
      },
      {
        label: '200–239',
        title: 'Borderline',
        count: 0,
        color: 'from-blue-400 to-blue-600',
      },
      {
        label: '240–280',
        title: 'High',
        count: 0,
        color: 'from-amber-400 to-amber-600',
      },
      {
        label: '>280',
        title: 'Very High',
        count: 0,
        color: 'from-rose-500 to-red-600',
      },
    ];
    rows.forEach((r) => {
      const c = r['chol'];
      if (c !== undefined) {
        if (c < 200) bins[0].count++;
        else if (c < 240) bins[1].count++;
        else if (c <= 280) bins[2].count++;
        else bins[3].count++;
      }
    });
    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    return { bins, maxCount };
  }, [rows]);

  // 5. Maximum heart rate distribution (thalach)
  const thalachDistribution = useMemo(() => {
    const bins = [
      { label: '<120', count: 0, color: 'from-teal-400 to-teal-600' },
      { label: '120–139', count: 0, color: 'from-cyan-400 to-cyan-600' },
      { label: '140–159', count: 0, color: 'from-sky-400 to-sky-600' },
      { label: '160–179', count: 0, color: 'from-emerald-400 to-emerald-600' },
      { label: '≥180', count: 0, color: 'from-green-500 to-emerald-700' },
    ];
    rows.forEach((r) => {
      const t = r['thalach'];
      if (t !== undefined) {
        if (t < 120) bins[0].count++;
        else if (t < 140) bins[1].count++;
        else if (t < 160) bins[2].count++;
        else if (t < 180) bins[3].count++;
        else bins[4].count++;
      }
    });
    const maxCount = Math.max(...bins.map((b) => b.count), 1);
    return { bins, maxCount };
  }, [rows]);

  // 6. Simple Pearson correlation heatmap
  const correlationMatrix = useMemo(() => {
    const numericCols = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', targetCol].filter(
      (c) => dataset.columns.includes(c)
    );

    const matrix: { x: string; y: string; value: number }[] = [];
    const means: Record<string, number> = {};
    numericCols.forEach((col) => {
      const sum = rows.reduce((acc, r) => acc + (r[col] ?? 0), 0);
      means[col] = sum / (rows.length || 1);
    });

    for (let i = 0; i < numericCols.length; i++) {
      for (let j = 0; j < numericCols.length; j++) {
        const col1 = numericCols[i];
        const col2 = numericCols[j];

        let num = 0;
        let den1 = 0;
        let den2 = 0;

        rows.forEach((r) => {
          const dx = (r[col1] ?? 0) - means[col1];
          const dy = (r[col2] ?? 0) - means[col2];
          num += dx * dy;
          den1 += dx * dx;
          den2 += dy * dy;
        });

        const denom = Math.sqrt(den1 * den2);
        const corr = denom === 0 ? 0 : Math.round((num / denom) * 100) / 100;
        matrix.push({ x: col1, y: col2, value: corr });
      }
    }

    return { cols: numericCols, matrix };
  }, [dataset.columns, rows, targetCol]);

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner with Richer Gradient */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Exploratory Data Visualization
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Interactive clinical charts illustrating patient distributions, demographic trends,
              and feature relationships.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Charts with Vibrant Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHART 1: Heart Disease Target Distribution */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                1. Heart Disease Distribution (Target)
              </h3>
              <span className="text-[11px] font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                Binary Target
              </span>
            </div>

            {/* Visual Bar / Ratio */}
            <div className="space-y-5 my-6">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 text-rose-700">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    Heart Disease Present (Target = 1)
                  </span>
                  <span className="font-mono text-rose-700">
                    {targetStats.disease} patients ({targetStats.diseasePct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${targetStats.diseasePct}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    No Heart Disease (Target = 0)
                  </span>
                  <span className="font-mono text-emerald-700">
                    {targetStats.noDisease} patients ({targetStats.noDiseasePct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${targetStats.noDiseasePct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl text-xs text-rose-950">
            <span className="font-bold block mb-0.5">Explanation:</span>
            In this dataset, roughly {targetStats.diseasePct}% of patients have heart disease and{' '}
            {targetStats.noDiseasePct}% do not. The classes are relatively well-balanced, meaning
            models won&apos;t easily suffer from severe majority-class bias.
          </div>
        </div>

        {/* CHART 2: Age Distribution */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                2. Age Distribution
              </h3>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                5 Age Bins
              </span>
            </div>

            {/* Vibrant Multi-Color Bars */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {ageDistribution.bins.map((bin) => {
                const heightPct = Math.round((bin.count / ageDistribution.maxCount) * 100);
                return (
                  <div
                    key={bin.label}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                  >
                    <span className="text-xs font-black text-slate-700 group-hover:scale-110 transition-transform">
                      {bin.count}
                    </span>
                    <div
                      className={`w-full bg-gradient-to-t ${bin.color} rounded-t-xl transition-all duration-500 shadow-sm group-hover:opacity-90`}
                      style={{ height: `${Math.max(10, heightPct)}%` }}
                    ></div>
                    <span className="text-[11px] text-slate-700 font-bold whitespace-nowrap">
                      {bin.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl text-xs text-indigo-950">
            <span className="font-bold block mb-0.5">Explanation:</span>
            Most people in this dataset belong to the 40–60 age group. Younger adults under 40 and
            seniors over 70 form a smaller fraction of the sample cohort.
          </div>
        </div>

        {/* CHART 3: Gender Distribution */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                3. Gender Distribution
              </h3>
              <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                Sex (0: F, 1: M)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="p-5 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 text-center space-y-1 shadow-2xs">
                <span className="text-xs font-extrabold uppercase text-blue-800 tracking-wider">
                  Male Patients (1)
                </span>
                <div className="text-3xl font-black text-blue-950 font-mono">
                  {genderStats.maleTotal}
                </div>
                <div className="text-xs font-bold text-blue-600">
                  {genderStats.malePct}% of dataset
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  {genderStats.maleDisease} positive diagnoses
                </div>
              </div>

              <div className="p-5 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 text-center space-y-1 shadow-2xs">
                <span className="text-xs font-extrabold uppercase text-purple-800 tracking-wider">
                  Female Patients (0)
                </span>
                <div className="text-3xl font-black text-purple-950 font-mono">
                  {genderStats.femaleTotal}
                </div>
                <div className="text-xs font-bold text-purple-600">
                  {genderStats.femalePct}% of dataset
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  {genderStats.femaleDisease} positive diagnoses
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl text-xs text-blue-950">
            <span className="font-bold block mb-0.5">Explanation:</span>
            The dataset contains more male participants ({genderStats.malePct}%) than female
            participants ({genderStats.femalePct}%). This reflects the demographic composition of
            the clinical study sample.
          </div>
        </div>

        {/* CHART 4: Cholesterol Distribution */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                4. Cholesterol Distribution
              </h3>
              <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                Serum Chol (mg/dl)
              </span>
            </div>

            {/* Binned bars with individual gradients */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {cholDistribution.bins.map((bin) => {
                const heightPct = Math.round((bin.count / cholDistribution.maxCount) * 100);
                return (
                  <div
                    key={bin.label}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                  >
                    <span className="text-xs font-black text-slate-700 group-hover:scale-110 transition-transform">
                      {bin.count}
                    </span>
                    <div
                      className={`w-full bg-gradient-to-t ${bin.color} rounded-t-xl transition-all duration-500 shadow-sm`}
                      style={{ height: `${Math.max(10, heightPct)}%` }}
                    ></div>
                    <div className="text-center leading-tight">
                      <div className="text-[11px] text-slate-800 font-bold">{bin.label}</div>
                      <div className="text-[9px] text-slate-500">{bin.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-xs text-amber-950">
            <span className="font-bold block mb-0.5">Explanation:</span>
            A large number of patients have borderline or elevated serum cholesterol (&gt;200 mg/dl).
            However, elevated cholesterol appears in both healthy and diagnosed patients, showing it
            must be evaluated alongside other factors.
          </div>
        </div>

        {/* CHART 5: Maximum Heart Rate Distribution */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                5. Maximum Heart Rate (thalach)
              </h3>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                Exercise BPM
              </span>
            </div>

            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {thalachDistribution.bins.map((bin) => {
                const heightPct = Math.round((bin.count / thalachDistribution.maxCount) * 100);
                return (
                  <div
                    key={bin.label}
                    className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                  >
                    <span className="text-xs font-black text-slate-700 group-hover:scale-110 transition-transform">
                      {bin.count}
                    </span>
                    <div
                      className={`w-full bg-gradient-to-t ${bin.color} rounded-t-xl transition-all duration-500 shadow-sm`}
                      style={{ height: `${Math.max(10, heightPct)}%` }}
                    ></div>
                    <span className="text-[11px] text-slate-700 font-bold text-center">
                      {bin.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
            <span className="font-bold block mb-0.5">Explanation:</span>
            Maximum heart rate achieved during exercise ranges between 71 and 202 bpm, with the peak
            density occurring in the 140–179 bpm range.
          </div>
        </div>

        {/* CHART 6: Correlation Heatmap with Cell Hover Details */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                6. Correlation Heatmap
              </h3>
              <span className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                Pearson r (-1 to +1)
              </span>
            </div>

            {/* Interactive Heatmap Grid */}
            <div className="overflow-x-auto py-2">
              <table className="mx-auto text-xs font-mono">
                <thead>
                  <tr>
                    <th className="p-1"></th>
                    {correlationMatrix.cols.map((col) => (
                      <th
                        key={col}
                        className="p-1.5 text-slate-700 font-bold text-center text-[10px]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlationMatrix.cols.map((colY) => (
                    <tr key={colY}>
                      <td className="p-1.5 text-slate-700 font-bold text-right text-[10px] pr-2">
                        {colY}
                      </td>
                      {correlationMatrix.cols.map((colX) => {
                        const cell = correlationMatrix.matrix.find(
                          (m) => m.x === colX && m.y === colY
                        );
                        const val = cell?.value ?? 0;

                        // Vivid color scheme for correlations
                        let bgClass = 'bg-slate-100 text-slate-700';
                        if (val === 1) {
                          bgClass = 'bg-indigo-600 text-white font-black shadow-xs';
                        } else if (val > 0.3) {
                          bgClass = 'bg-blue-300 text-blue-950 font-bold';
                        } else if (val > 0.1) {
                          bgClass = 'bg-blue-100 text-blue-900';
                        } else if (val < -0.3) {
                          bgClass = 'bg-rose-300 text-rose-950 font-bold';
                        } else if (val < -0.1) {
                          bgClass = 'bg-rose-100 text-rose-900';
                        }

                        return (
                          <td key={colX} className="p-1 text-center">
                            <button
                              onMouseEnter={() =>
                                setActiveHeatmapCell({ x: colX, y: colY, val })
                              }
                              className={`inline-block w-10 py-1 rounded-md text-[10px] cursor-pointer hover:scale-110 transition-transform ${bgClass}`}
                            >
                              {val > 0 ? `+${val}` : val}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeHeatmapCell && (
              <div className="text-center text-[11px] font-semibold text-purple-800 bg-purple-50 py-1 rounded-lg border border-purple-200 mt-1">
                Selected: <strong>{activeHeatmapCell.y}</strong> vs{' '}
                <strong>{activeHeatmapCell.x}</strong> &rarr; r ={' '}
                <strong>{activeHeatmapCell.val}</strong>
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl text-xs text-purple-950">
            <span className="font-bold block mb-0.5">Explanation:</span>
            Displays linear correlation between numeric features. Values near +1 or -1 indicate
            strong association, while values near 0 show low linear correlation. Correlation does
            not imply direct causation.
          </div>
        </div>
      </div>
    </div>
  );
};
