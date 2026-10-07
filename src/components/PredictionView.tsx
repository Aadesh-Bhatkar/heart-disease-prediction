import React, { useState } from 'react';
import { PatientInput, PredictionResult } from '../types';
import { PreprocessedData, TrainedModelInstances, predictPatient } from '../utils/mlEngine';
import {
  UserCheck,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Activity,
  Zap,
} from 'lucide-react';

interface PredictionViewProps {
  preprocessed: PreprocessedData;
  instances: TrainedModelInstances;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  preprocessed,
  instances,
}) => {
  const defaultPatient: PatientInput = {
    age: 52,
    sex: 1, // Male
    cp: 0, // Typical angina
    trestbps: 130,
    chol: 225,
    fbs: 0, // <= 120
    restecg: 1,
    thalach: 160,
    exang: 0, // No
    oldpeak: 1.0,
    slope: 2,
    ca: 0,
    thal: 2,
  };

  const [patient, setPatient] = useState<PatientInput>(defaultPatient);
  const [selectedModel, setSelectedModel] = useState<string>('random_forest');
  const [prediction, setPrediction] = useState<PredictionResult | null>(() => {
    return predictPatient(defaultPatient, preprocessed, instances, 'random_forest');
  });

  const availableModels = [
    { id: 'logistic_regression', label: 'Logistic Regression', color: 'blue' },
    { id: 'knn', label: 'KNN', color: 'purple' },
    { id: 'decision_tree', label: 'Decision Tree', color: 'amber' },
    { id: 'random_forest', label: 'Random Forest', color: 'emerald' },
    { id: 'svm', label: 'SVM', color: 'indigo' },
    { id: 'ann', label: 'Neural Network', color: 'pink' },
  ];

  const handlePredict = (e?: React.FormEvent, modelIdToUse?: string) => {
    if (e) e.preventDefault();
    const model = modelIdToUse || selectedModel;
    const res = predictPatient(patient, preprocessed, instances, model);
    setPrediction(res);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    const res = predictPatient(patient, preprocessed, instances, modelId);
    setPrediction(res);
  };

  // 4 Presets
  const applyPreset = (preset: PatientInput) => {
    setPatient(preset);
    const res = predictPatient(preset, preprocessed, instances, selectedModel);
    setPrediction(res);
  };

  const handleInputChange = (field: keyof PatientInput, val: number) => {
    const updated = { ...patient, [field]: val };
    setPatient(updated);
    // Instant live update!
    const res = predictPatient(updated, preprocessed, instances, selectedModel);
    setPrediction(res);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner with Rich Rose/Amber Gradient */}
      <div className="bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs">
              <HeartPulse className="w-3.5 h-3.5" />
              Interactive Clinical Simulator
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Patient Heart Disease Prediction
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Adjust patient parameters with live sliders or choose presets to see model predictions
              instantly.
            </p>
          </div>

          {/* 4 Interactive Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 32,
                  sex: 0,
                  cp: 1,
                  trestbps: 110,
                  chol: 175,
                  fbs: 0,
                  restecg: 0,
                  thalach: 180,
                  exang: 0,
                  oldpeak: 0.0,
                  slope: 2,
                  ca: 0,
                  thal: 2,
                })
              }
              className="px-3 py-1.5 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-extrabold hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs hover:scale-105"
            >
              Young Healthy
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 62,
                  sex: 0,
                  cp: 2,
                  trestbps: 125,
                  chol: 205,
                  fbs: 0,
                  restecg: 0,
                  thalach: 165,
                  exang: 0,
                  oldpeak: 0.4,
                  slope: 2,
                  ca: 0,
                  thal: 2,
                })
              }
              className="px-3 py-1.5 rounded-xl border-2 border-blue-300 bg-blue-50 text-blue-800 text-xs font-extrabold hover:bg-blue-100 transition-all cursor-pointer shadow-2xs hover:scale-105"
            >
              Active Senior
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 55,
                  sex: 1,
                  cp: 0,
                  trestbps: 140,
                  chol: 245,
                  fbs: 0,
                  restecg: 1,
                  thalach: 145,
                  exang: 1,
                  oldpeak: 1.6,
                  slope: 1,
                  ca: 1,
                  thal: 2,
                })
              }
              className="px-3 py-1.5 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-800 text-xs font-extrabold hover:bg-amber-100 transition-all cursor-pointer shadow-2xs hover:scale-105"
            >
              Moderate Risk
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  age: 65,
                  sex: 1,
                  cp: 0,
                  trestbps: 165,
                  chol: 295,
                  fbs: 1,
                  restecg: 2,
                  thalach: 110,
                  exang: 1,
                  oldpeak: 3.6,
                  slope: 1,
                  ca: 3,
                  thal: 3,
                })
              }
              className="px-3 py-1.5 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-800 text-xs font-extrabold hover:bg-rose-100 transition-all cursor-pointer shadow-2xs hover:scale-105"
            >
              High Risk
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Patient Input Form (7 columns) */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handlePredict} className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Patient Health Parameters
                </h3>
                <p className="text-xs text-slate-500">
                  Sliders update probability calculation live in real-time
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">13 Features</span>
            </div>

            {/* Model Selector Pills & Dropdown (Required in brief) */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl space-y-3">
              <label className="block text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                Select Model for Inference:
              </label>

              {/* Fast interactive model switcher */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableModels.map((m) => {
                  const isCur = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleModelChange(m.id)}
                      className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                        isCur
                          ? 'bg-blue-600 text-white shadow-md scale-105'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Standard HTML Select Dropdown as required by prompt */}
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full bg-white border-2 border-blue-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="logistic_regression">Logistic Regression</option>
                <option value="knn">K-Nearest Neighbors (KNN)</option>
                <option value="decision_tree">Decision Tree</option>
                <option value="random_forest">Random Forest</option>
                <option value="svm">Support Vector Machine (SVM)</option>
                <option value="ann">Neural Network (ANN)</option>
              </select>
            </div>

            {/* Form Fields with Sliders for Key Measurements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Age with Slider */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>Age</span>
                  <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {patient.age} yrs
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={patient.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Sex */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="font-bold text-slate-800 block">Sex</label>
                <select
                  value={patient.sex}
                  onChange={(e) => handleInputChange('sex', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={1}>Male (1)</option>
                  <option value={0}>Female (0)</option>
                </select>
              </div>

              {/* Chest Pain Type */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 sm:col-span-2">
                <label className="font-bold text-slate-800 block">Chest Pain Type (cp)</label>
                <select
                  value={patient.cp}
                  onChange={(e) => handleInputChange('cp', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={0}>Typical Angina (0)</option>
                  <option value={1}>Atypical Angina (1)</option>
                  <option value={2}>Non-anginal Pain (2)</option>
                  <option value={3}>Asymptomatic (3)</option>
                </select>
              </div>

              {/* Resting Blood Pressure with Slider */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>Resting Blood Pressure</span>
                  <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {patient.trestbps} mm Hg
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="200"
                  value={patient.trestbps}
                  onChange={(e) => handleInputChange('trestbps', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Serum Cholesterol with Slider */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>Serum Cholesterol (chol)</span>
                  <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {patient.chol} mg/dl
                  </span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="450"
                  value={patient.chol}
                  onChange={(e) => handleInputChange('chol', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Maximum Heart Rate with Slider */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>Max Heart Rate (thalach)</span>
                  <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {patient.thalach} bpm
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="210"
                  value={patient.thalach}
                  onChange={(e) => handleInputChange('thalach', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* ST Depression Oldpeak with Slider */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>ST Depression (oldpeak)</span>
                  <span className="font-mono text-rose-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {patient.oldpeak} mm
                  </span>
                </div>
                <input
                  type="range"
                  step="0.1"
                  min="0"
                  max="6"
                  value={patient.oldpeak}
                  onChange={(e) => handleInputChange('oldpeak', Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Fasting Blood Sugar */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Fasting Blood Sugar</label>
                <select
                  value={patient.fbs}
                  onChange={(e) => handleInputChange('fbs', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={0}>&le; 120 mg/dl (0)</option>
                  <option value={1}>&gt; 120 mg/dl (1)</option>
                </select>
              </div>

              {/* Resting ECG */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Resting ECG</label>
                <select
                  value={patient.restecg}
                  onChange={(e) => handleInputChange('restecg', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={0}>Normal (0)</option>
                  <option value={1}>ST-T Wave Abnormality (1)</option>
                  <option value={2}>Left Ventricular Hypertrophy (2)</option>
                </select>
              </div>

              {/* Exercise Induced Angina */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Exercise Induced Angina</label>
                <select
                  value={patient.exang}
                  onChange={(e) => handleInputChange('exang', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={0}>No (0)</option>
                  <option value={1}>Yes (1)</option>
                </select>
              </div>

              {/* Slope */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Slope of Peak ST</label>
                <select
                  value={patient.slope}
                  onChange={(e) => handleInputChange('slope', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={0}>Upsloping (0)</option>
                  <option value={1}>Flat (1)</option>
                  <option value={2}>Downsloping (2)</option>
                </select>
              </div>

              {/* Major Vessels */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Major Vessels (ca)</label>
                <select
                  value={patient.ca}
                  onChange={(e) => handleInputChange('ca', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={0}>0 vessels</option>
                  <option value={1}>1 vessel</option>
                  <option value={2}>2 vessels</option>
                  <option value={3}>3 vessels</option>
                </select>
              </div>

              {/* Thalassemia */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Thalassemia (thal)</label>
                <select
                  value={patient.thal}
                  onChange={(e) => handleInputChange('thal', Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white font-semibold focus:outline-blue-500 cursor-pointer"
                >
                  <option value={1}>Normal (1)</option>
                  <option value={2}>Fixed Defect (2)</option>
                  <option value={3}>Reversible Defect (3)</option>
                </select>
              </div>
            </div>

            {/* Predict Button (Required in brief) */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <HeartPulse className="w-5 h-5" />
                Predict Heart Disease Status
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Result Display (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg">Prediction Result</h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {prediction?.modelName}
              </span>
            </div>

            {prediction && (
              <div className="space-y-6">
                {/* Result Pill / Banner with Glowing Animation */}
                <div
                  className={`p-6 rounded-3xl border-2 text-center space-y-4 shadow-sm ${
                    prediction.hasDisease
                      ? 'border-rose-400 bg-gradient-to-b from-rose-50/90 to-red-100/50 text-rose-950'
                      : 'border-emerald-400 bg-gradient-to-b from-emerald-50/90 to-teal-100/50 text-emerald-950'
                  }`}
                >
                  <div className="flex justify-center">
                    {prediction.hasDisease ? (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-200 animate-pulse">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                      Diagnosis Classification
                    </div>
                    <div className="text-xl sm:text-2xl font-black mt-1">
                      {prediction.hasDisease
                        ? 'Prediction: Heart Disease Detected'
                        : 'Prediction: No Heart Disease Detected'}
                    </div>
                  </div>

                  {/* Probability Bar */}
                  <div className="pt-3 border-t border-slate-200/60 space-y-2">
                    <div className="flex justify-between text-xs font-black">
                      <span>Calculated Probability:</span>
                      <span className="font-mono text-base">{prediction.probability}%</span>
                    </div>

                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          prediction.hasDisease
                            ? 'bg-gradient-to-r from-orange-500 to-rose-600'
                            : 'bg-gradient-to-r from-teal-400 to-emerald-500'
                        }`}
                        style={{ width: `${prediction.probability}%` }}
                      ></div>
                    </div>

                    <div className="text-[11px] font-bold text-slate-500 flex justify-between">
                      <span className="text-emerald-700">0% (Low Risk)</span>
                      <span>50% Threshold</span>
                      <span className="text-rose-700">100% (High Risk)</span>
                    </div>
                  </div>
                </div>

                {/* Factors Summary */}
                <div className="space-y-2 text-xs">
                  <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    Key Health Indicators Recorded:
                  </div>
                  <div className="space-y-2">
                    {prediction.keyContributingFactors.map((f, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 px-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs"
                      >
                        <span className="text-slate-600 font-medium">{f.feature}</span>
                        <span
                          className={`font-mono font-black ${
                            f.impact === 'High' ? 'text-rose-600' : 'text-slate-900'
                          }`}
                        >
                          {f.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CRITICAL Required Disclaimer */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              IMPORTANT DISCLAIMER
            </div>
            <p className="text-xs text-amber-950 font-bold leading-relaxed">
              &ldquo;This project is for educational purposes only and is not a medical
              diagnosis.&rdquo;
            </p>
            <p className="text-[11px] text-amber-800 leading-normal">
              It is created as a demonstration of machine learning classification techniques for
              academic viva examinations. Real clinical diagnosis requires medical specialists and
              angiography.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
