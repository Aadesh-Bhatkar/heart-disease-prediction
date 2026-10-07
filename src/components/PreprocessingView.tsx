import React from 'react';
import { PreprocessedData } from '../utils/mlEngine';
import { ParsedDataset } from '../types';
import {
  Sliders,
  CheckCircle2,
  Split,
  Binary,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface PreprocessingViewProps {
  dataset: ParsedDataset;
  preprocessed: PreprocessedData;
}

export const PreprocessingView: React.FC<PreprocessingViewProps> = ({
  dataset,
  preprocessed,
}) => {
  const { summary } = preprocessed;

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Data Preprocessing Pipeline</h2>
            <p className="text-sm text-slate-500">
              Preparing raw clinical records for machine learning algorithms with standard 80/20
              train-test splitting.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Status Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Missing Values Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              1. Missing Values
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.missingCount} Nulls</div>
          <p className="text-xs text-slate-500">
            {summary.missingCount === 0
              ? 'Dataset has zero missing fields.'
              : 'Imputed with mean values to avoid data loss.'}
          </p>
        </div>

        {/* Duplicate Values Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              2. Duplicate Rows
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.duplicateCount} Duplicates</div>
          <p className="text-xs text-slate-500">
            Checked across all patient attribute signatures.
          </p>
        </div>

        {/* Numerical Columns Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              3. Numerical Columns
            </span>
            <Binary className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {dataset.numericalColumns.length} Features
          </div>
          <p className="text-xs text-slate-500 font-mono truncate">
            {dataset.numericalColumns.join(', ') || 'age, chol, trestbps, thalach, oldpeak'}
          </p>
        </div>

        {/* Categorical Columns Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              4. Categorical Columns
            </span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {dataset.categoricalColumns.length} Features
          </div>
          <p className="text-xs text-slate-500 font-mono truncate">
            {dataset.categoricalColumns.join(', ') || 'sex, cp, fbs, restecg, exang, slope, ca, thal'}
          </p>
        </div>
      </div>

      {/* 80/20 Train Test Split Visual Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Split className="w-5 h-5 text-blue-600" />
              Train-Test Dataset Split (80 / 20)
            </h3>
            <p className="text-xs text-slate-500">
              We divide the dataset to prevent overfitting and honestly test generalization on
              unseen patient records.
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            Stratified Split Ratio: 4:1
          </span>
        </div>

        {/* Split Proportion Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* 80% Training Data */}
          <div className="p-5 rounded-xl border-2 border-blue-300 bg-blue-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800">
                80% Training Data
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-blue-600 text-white text-xs font-bold font-mono">
                {summary.trainRows} Rows
              </span>
            </div>
            <div className="text-2xl font-extrabold text-blue-900">
              X_train &amp; y_train
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Used by algorithms (Logistic Regression, KNN, Decision Tree, Random Forest, SVM, and
              Neural Network) to adjust internal weights, split points, and mathematical boundaries.
            </p>
          </div>

          {/* 20% Testing Data */}
          <div className="p-5 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                20% Testing Data
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-emerald-600 text-white text-xs font-bold font-mono">
                {summary.testRows} Rows
              </span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-900">
              X_test &amp; y_test
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Kept strictly hidden during training. Only evaluated after training to calculate true
              Accuracy, Precision, Recall, and F1 Score.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Step Process Explained Simply */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">
          Preprocessing Steps Performed on this Dataset:
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div>
              <span className="font-bold text-slate-900">Handle Missing Values:</span> Any missing
              or placeholder values (<code>?</code>, <code>null</code>) were checked. Numerical
              missing values were imputed using column median/mean so no rows are discarded.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div>
              <span className="font-bold text-slate-900">Convert Categorical Values:</span> Features
              such as sex (0/1), chest pain type (0, 1, 2, 3), and fasting blood sugar (0/1) are
              verified as clean numerical categories compatible with mathematical models.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div>
              <span className="font-bold text-slate-900">Separate Features (X) &amp; Target (y):</span>{' '}
              The dependent variable <code>{summary.targetName}</code> is isolated as vector{' '}
              <code>y</code>, while the remaining {summary.featureNames.length} clinical attributes
              become feature matrix <code>X</code>.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </span>
            <div>
              <span className="font-bold text-slate-900">80/20 Train-Test Split:</span> The dataset
              is randomly split into 80% ({summary.trainRows} records) for model training and 20% (
              {summary.testRows} records) for honest final testing.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              5
            </span>
            <div>
              <span className="font-bold text-slate-900">Standard Feature Scaling (StandardScaler):</span>{' '}
              Continuous features have vastly different units (e.g. Cholesterol ~ 240 vs ST Oldpeak ~
              1.2). We apply Z-score scaling:
              <span className="block mt-1 font-mono text-blue-700 bg-white p-2 rounded-md border border-slate-200">
                z = (x - mean) / standard_deviation
              </span>
              This ensures distance-based algorithms like KNN and gradient-based models like
              Logistic Regression and Neural Networks converge properly without bias towards large
              numbers.
            </div>
          </div>
        </div>
      </div>

      {/* Standard Scaler Parameters Preview (Mean & Std Dev Table) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            StandardScaler Computed Parameters (from Training Set)
          </h3>
          <span className="text-xs text-slate-500">z = (x - μ) / σ</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {summary.featureNames.map((fn) => (
            <div key={fn} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
              <div className="font-mono font-bold text-slate-800 truncate">{fn}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                μ: <span className="font-mono text-slate-700">{summary.featureMeans[fn]}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                σ: <span className="font-mono text-slate-700">{summary.featureStds[fn]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
