export interface DatasetRow {
  [key: string]: number;
}

export interface ParsedDataset {
  filename: string;
  columns: string[];
  rows: DatasetRow[];
  totalRows: number;
  totalColumns: number;
  missingValues: Record<string, number>;
  numericalColumns: string[];
  categoricalColumns: string[];
  targetColumn: string;
}

export interface ConfusionMatrix {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: ConfusionMatrix;
}

export interface TrainingEpoch {
  epoch: number;
  loss: number;
  trainAccuracy: number;
  valAccuracy: number;
}

export interface ModelResult {
  id: string;
  name: string;
  type: 'ml' | 'dl';
  description: string;
  hyperparameters: Record<string, string | number>;
  metrics: ModelMetrics;
  trainingTimeMs: number;
  isTrained: boolean;
  history?: TrainingEpoch[];
}

export interface PreprocessingSummary {
  trainRows: number;
  testRows: number;
  trainRatio: number; // e.g. 0.8
  testRatio: number; // e.g. 0.2
  featureNames: string[];
  targetName: string;
  featureMeans: Record<string, number>;
  featureStds: Record<string, number>;
  missingCount: number;
  duplicateCount: number;
}

export interface PatientInput {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
  [key: string]: number;
}

export interface PredictionResult {
  hasDisease: boolean;
  probability: number;
  modelName: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  keyContributingFactors: { feature: string; value: string; impact: 'High' | 'Normal' }[];
}
