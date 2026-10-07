import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DatasetView } from './components/DatasetView';
import { VisualizationView } from './components/VisualizationView';
import { PreprocessingView } from './components/PreprocessingView';
import { ModelsView } from './components/ModelsView';
import { DeepLearningView } from './components/DeepLearningView';
import { ComparisonView } from './components/ComparisonView';
import { PredictionView } from './components/PredictionView';
import { AboutView } from './components/AboutView';
import { SAMPLE_HEART_CSV } from './data/defaultDataset';
import { parseCSV } from './utils/csvParser';
import {
  preprocessDataset,
  trainAllModels,
  PreprocessedData,
  TrainedModelInstances,
  SimpleNeuralNetwork,
  calculateMetrics,
} from './utils/mlEngine';
import { ModelResult, ParsedDataset } from './types';
import { HeartPulse, GraduationCap, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Initialize dataset from default Cleveland CSV
  const [dataset, setDataset] = useState<ParsedDataset>(() => {
    return parseCSV(SAMPLE_HEART_CSV, 'Heart.csv');
  });

  // Preprocessed data
  const preprocessed = useMemo<PreprocessedData>(() => {
    return preprocessDataset(dataset);
  }, [dataset]);

  // Model results & instances
  const [modelState, setModelState] = useState<{
    results: ModelResult[];
    instances: TrainedModelInstances;
  }>(() => {
    const initialPrep = preprocessDataset(parseCSV(SAMPLE_HEART_CSV, 'Heart.csv'));
    return trainAllModels(initialPrep);
  });

  // Re-train when dataset changes
  useEffect(() => {
    const trained = trainAllModels(preprocessed);
    setModelState(trained);
  }, [preprocessed]);

  // Handle CSV file upload
  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text, file.name);
        setDataset(parsed);
        setFeedbackMessage(`Successfully uploaded "${file.name}" with ${parsed.totalRows} rows!`);
        setTimeout(() => setFeedbackMessage(null), 4000);
      } catch (err: any) {
        alert(err.message || 'Error parsing CSV file. Please make sure it is a valid CSV.');
      }
    };
    reader.readAsText(file);
  }, []);

  // Handle resetting to default dataset
  const handleResetDefault = useCallback(() => {
    const defaultData = parseCSV(SAMPLE_HEART_CSV, 'Heart.csv');
    setDataset(defaultData);
    setFeedbackMessage('Reset back to standard Cleveland Heart Dataset (303 rows).');
    setTimeout(() => setFeedbackMessage(null), 4000);
  }, []);

  // Train a single ML model
  const handleTrainModel = useCallback(
    (modelId: string) => {
      setIsTraining(true);
      setTimeout(() => {
        const trained = trainAllModels(preprocessed);
        setModelState((prev) => {
          const updatedResults = prev.results.map((m) =>
            m.id === modelId ? trained.results.find((tr) => tr.id === modelId) || m : m
          );
          return {
            results: updatedResults,
            instances: {
              ...prev.instances,
              [modelId]: (trained.instances as any)[modelId] || (prev.instances as any)[modelId],
            },
          };
        });
        setIsTraining(false);
        setFeedbackMessage(`Model trained successfully!`);
        setTimeout(() => setFeedbackMessage(null), 3000);
      }, 150);
    },
    [preprocessed]
  );

  // Train all models
  const handleTrainAll = useCallback(() => {
    setIsTraining(true);
    setTimeout(() => {
      const trained = trainAllModels(preprocessed);
      setModelState(trained);
      setIsTraining(false);
      setFeedbackMessage('All 6 models re-trained on 80% train / 20% test split!');
      setTimeout(() => setFeedbackMessage(null), 3500);
    }, 200);
  }, [preprocessed]);

  // Train Artificial Neural Network
  const handleTrainANN = useCallback(() => {
    setIsTraining(true);
    setTimeout(() => {
      const { X_train, y_train, X_test, y_test } = preprocessed;
      const start = performance.now();
      const ann = new SimpleNeuralNetwork();
      const history = ann.train(X_train, y_train, X_test, y_test, 45, 0.05);
      const preds = X_test.map((x) => ann.predict(x));
      const metrics = calculateMetrics(y_test, preds);
      const timeMs = Math.round(performance.now() - start);

      setModelState((prev) => {
        const updated = prev.results.map((m) => {
          if (m.id === 'ann') {
            return {
              ...m,
              metrics,
              trainingTimeMs: timeMs,
              history,
            };
          }
          return m;
        });
        return {
          results: updated,
          instances: {
            ...prev.instances,
            ann,
          },
        };
      });

      setIsTraining(false);
      setFeedbackMessage('Artificial Neural Network trained across 45 epochs!');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }, 150);
  }, [preprocessed]);

  const annModel = modelState.results.find((m) => m.id === 'ann');
  const modelsTrainedCount = modelState.results.filter((m) => m.isTrained).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        datasetRowsCount={dataset.totalRows}
        modelsTrainedCount={modelsTrainedCount}
      />

      {/* Floating Notification */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <HeartPulse className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={setCurrentTab}
            datasetRowsCount={dataset.totalRows}
            modelsTrainedCount={modelsTrainedCount}
          />
        )}

        {currentTab === 'dataset' && (
          <DatasetView
            dataset={dataset}
            onFileUpload={handleFileUpload}
            onResetDefault={handleResetDefault}
          />
        )}

        {currentTab === 'visualization' && <VisualizationView dataset={dataset} />}

        {currentTab === 'preprocessing' && (
          <PreprocessingView dataset={dataset} preprocessed={preprocessed} />
        )}

        {currentTab === 'models' && (
          <ModelsView
            modelResults={modelState.results}
            onTrainModel={handleTrainModel}
            onTrainAll={handleTrainAll}
            isTraining={isTraining}
          />
        )}

        {currentTab === 'deeplearning' && (
          <DeepLearningView
            annResult={annModel}
            onTrainANN={handleTrainANN}
            isTraining={isTraining}
          />
        )}

        {currentTab === 'comparison' && <ComparisonView modelResults={modelState.results} />}

        {currentTab === 'prediction' && (
          <PredictionView preprocessed={preprocessed} instances={modelState.instances} />
        )}

        {currentTab === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  Heart Disease Prediction using Machine Learning
                </div>
                <div className="text-xs text-slate-500">
                  College Data Science / Machine Learning Final Year Project
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center sm:text-right">
              Supervised Learning Workflow: CSV Upload &rarr; EDA &rarr; Preprocessing &rarr; 5 ML +
              ANN &rarr; Comparison &rarr; Inference
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-700">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Project Objective:</strong> To compare different machine learning and deep
                learning algorithms for heart disease prediction and identify which model performs best
                on the given dataset.
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] font-medium">
                Educational project only. Not for medical diagnosis.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
