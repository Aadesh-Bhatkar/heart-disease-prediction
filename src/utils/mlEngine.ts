import {
  ConfusionMatrix,
  DatasetRow,
  ModelMetrics,
  ModelResult,
  ParsedDataset,
  PatientInput,
  PredictionResult,
  PreprocessingSummary,
  TrainingEpoch,
} from '../types';

export interface PreprocessedData {
  summary: PreprocessingSummary;
  featureNames: string[];
  targetName: string;
  means: number[];
  stds: number[];
  X_train: number[][];
  y_train: number[];
  X_test: number[][];
  y_test: number[];
}

// Deterministic pseudo-random number generator for reproducible college lab results
class SeededRandom {
  private seed: number;
  constructor(seed = 42) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

/**
 * Preprocess parsed dataset:
 * 1. Extract feature matrix X and target vector y
 * 2. 80/20 train/test split
 * 3. Fit StandardScaler on train, transform train and test
 */
export function preprocessDataset(dataset: ParsedDataset): PreprocessedData {
  const targetCol = dataset.targetColumn;
  const featureNames = dataset.columns.filter((c) => c !== targetCol);

  // Check duplicate rows
  const rowStrings = new Set<string>();
  let duplicateCount = 0;
  for (const r of dataset.rows) {
    const key = featureNames.map((f) => r[f]).join('|');
    if (rowStrings.has(key)) {
      duplicateCount++;
    } else {
      rowStrings.add(key);
    }
  }

  const missingCount = Object.values(dataset.missingValues).reduce((a, b) => a + b, 0);

  // Separate X and y
  const allX: number[][] = [];
  const allY: number[] = [];

  for (const row of dataset.rows) {
    const feats = featureNames.map((fn) => row[fn] ?? 0);
    // target in heart disease is usually 0 (no disease) or 1 (disease present)
    const rawTarget = row[targetCol];
    const targetVal = rawTarget > 0 ? 1 : 0;
    allX.push(feats);
    allY.push(targetVal);
  }

  // Reproducible shuffle before 80/20 split
  const rng = new SeededRandom(42);
  const indices = allX.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const trainCount = Math.floor(allX.length * 0.8);
  const trainIndices = indices.slice(0, trainCount);
  const testIndices = indices.slice(trainCount);

  const rawTrainX = trainIndices.map((i) => allX[i]);
  const y_train = trainIndices.map((i) => allY[i]);
  const rawTestX = testIndices.map((i) => allX[i]);
  const y_test = testIndices.map((i) => allY[i]);

  // Compute Mean and Standard Deviation on Training Set
  const numFeatures = featureNames.length;
  const means: number[] = new Array(numFeatures).fill(0);
  const stds: number[] = new Array(numFeatures).fill(0);

  for (let f = 0; f < numFeatures; f++) {
    let sum = 0;
    for (let i = 0; i < rawTrainX.length; i++) {
      sum += rawTrainX[i][f];
    }
    means[f] = sum / (rawTrainX.length || 1);

    let varianceSum = 0;
    for (let i = 0; i < rawTrainX.length; i++) {
      varianceSum += Math.pow(rawTrainX[i][f] - means[f], 2);
    }
    const std = Math.sqrt(varianceSum / (rawTrainX.length || 1));
    stds[f] = std > 0.0001 ? std : 1; // avoid division by zero
  }

  // Standardize X_train and X_test: z = (x - mean) / std
  const X_train = rawTrainX.map((row) =>
    row.map((val, f) => (val - means[f]) / stds[f])
  );
  const X_test = rawTestX.map((row) =>
    row.map((val, f) => (val - means[f]) / stds[f])
  );

  const featureMeansMap: Record<string, number> = {};
  const featureStdsMap: Record<string, number> = {};
  featureNames.forEach((name, i) => {
    featureMeansMap[name] = Math.round(means[i] * 100) / 100;
    featureStdsMap[name] = Math.round(stds[i] * 100) / 100;
  });

  return {
    summary: {
      trainRows: X_train.length,
      testRows: X_test.length,
      trainRatio: 0.8,
      testRatio: 0.2,
      featureNames,
      targetName: targetCol,
      featureMeans: featureMeansMap,
      featureStds: featureStdsMap,
      missingCount,
      duplicateCount,
    },
    featureNames,
    targetName: targetCol,
    means,
    stds,
    X_train,
    y_train,
    X_test,
    y_test,
  };
}

/**
 * Calculate standard metrics from predicted and actual labels
 */
export function calculateMetrics(y_true: number[], y_pred: number[]): ModelMetrics {
  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  for (let i = 0; i < y_true.length; i++) {
    const actual = y_true[i];
    const pred = y_pred[i];
    if (actual === 1 && pred === 1) tp++;
    else if (actual === 0 && pred === 0) tn++;
    else if (actual === 0 && pred === 1) fp++;
    else if (actual === 1 && pred === 0) fn++;
  }

  const total = tp + tn + fp + fn || 1;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return {
    accuracy: Math.round(accuracy * 1000) / 1000,
    precision: Math.round(precision * 1000) / 1000,
    recall: Math.round(recall * 1000) / 1000,
    f1Score: Math.round(f1Score * 1000) / 1000,
    confusionMatrix: { tp, tn, fp, fn },
  };
}

// --------------------------------------------------------------------------
// 1. LOGISTIC REGRESSION
// --------------------------------------------------------------------------
export class LogisticRegressionModel {
  weights: number[] = [];
  bias: number = 0;

  train(X: number[][], y: number[], epochs = 120, lr = 0.08) {
    const numFeatures = X[0].length;
    this.weights = new Array(numFeatures).fill(0);
    this.bias = 0;

    for (let ep = 0; ep < epochs; ep++) {
      const gradW = new Array(numFeatures).fill(0);
      let gradB = 0;

      for (let i = 0; i < X.length; i++) {
        const z = this.dot(X[i], this.weights) + this.bias;
        const p = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
        const error = p - y[i];

        for (let f = 0; f < numFeatures; f++) {
          gradW[f] += error * X[i][f];
        }
        gradB += error;
      }

      const n = X.length || 1;
      for (let f = 0; f < numFeatures; f++) {
        this.weights[f] -= (lr * gradW[f]) / n;
      }
      this.bias -= (lr * gradB) / n;
    }
  }

  predictProb(x: number[]): number {
    const z = this.dot(x, this.weights) + this.bias;
    return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
  }

  predict(x: number[]): number {
    return this.predictProb(x) >= 0.5 ? 1 : 0;
  }

  private dot(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }
}

// --------------------------------------------------------------------------
// 2. K-NEAREST NEIGHBORS (KNN)
// --------------------------------------------------------------------------
export class KNNModel {
  k: number;
  X_train: number[][] = [];
  y_train: number[] = [];

  constructor(k = 5) {
    this.k = k;
  }

  train(X: number[][], y: number[]) {
    this.X_train = X;
    this.y_train = y;
  }

  predictProb(x: number[]): number {
    const distances = this.X_train.map((trainRow, idx) => {
      let sumSq = 0;
      for (let i = 0; i < x.length; i++) {
        const diff = x[i] - trainRow[i];
        sumSq += diff * diff;
      }
      return { dist: Math.sqrt(sumSq), label: this.y_train[idx] };
    });

    distances.sort((a, b) => a.dist - b.dist);
    const neighbors = distances.slice(0, this.k);
    const positiveCount = neighbors.filter((n) => n.label === 1).length;
    return positiveCount / this.k;
  }

  predict(x: number[]): number {
    return this.predictProb(x) >= 0.5 ? 1 : 0;
  }
}

// --------------------------------------------------------------------------
// 3. DECISION TREE
// --------------------------------------------------------------------------
interface TreeNode {
  isLeaf: boolean;
  prediction?: number;
  prob?: number;
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

export class DecisionTreeModel {
  maxDepth: number;
  minSamplesSplit: number;
  root: TreeNode | null = null;

  constructor(maxDepth = 4, minSamplesSplit = 4) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
  }

  train(X: number[][], y: number[]) {
    this.root = this.buildTree(X, y, 0);
  }

  private buildTree(X: number[][], y: number[], depth: number): TreeNode {
    const positiveCount = y.filter((val) => val === 1).length;
    const prob = positiveCount / (y.length || 1);
    const majorityClass = prob >= 0.5 ? 1 : 0;

    // Base condition for leaf
    if (depth >= this.maxDepth || y.length < this.minSamplesSplit || prob === 0 || prob === 1) {
      return { isLeaf: true, prediction: majorityClass, prob };
    }

    let bestGini = 1.0;
    let bestFeature = -1;
    let bestThreshold = 0;
    const numFeatures = X[0].length;

    for (let f = 0; f < numFeatures; f++) {
      const vals = X.map((r) => r[f]);
      vals.sort((a, b) => a - b);
      const thresholds: number[] = [];
      for (let i = 0; i < vals.length - 1; i += Math.max(1, Math.floor(vals.length / 10))) {
        thresholds.push((vals[i] + vals[i + 1]) / 2);
      }

      for (const t of thresholds) {
        let leftPos = 0, leftTotal = 0;
        let rightPos = 0, rightTotal = 0;

        for (let i = 0; i < X.length; i++) {
          if (X[i][f] <= t) {
            leftTotal++;
            if (y[i] === 1) leftPos++;
          } else {
            rightTotal++;
            if (y[i] === 1) rightPos++;
          }
        }

        if (leftTotal === 0 || rightTotal === 0) continue;

        const pL = leftPos / leftTotal;
        const giniL = 1 - (pL * pL + (1 - pL) * (1 - pL));
        const pR = rightPos / rightTotal;
        const giniR = 1 - (pR * pR + (1 - pR) * (1 - pR));

        const weightedGini = (leftTotal / X.length) * giniL + (rightTotal / X.length) * giniR;

        if (weightedGini < bestGini) {
          bestGini = weightedGini;
          bestFeature = f;
          bestThreshold = t;
        }
      }
    }

    if (bestFeature === -1) {
      return { isLeaf: true, prediction: majorityClass, prob };
    }

    const leftX: number[][] = [], leftY: number[] = [];
    const rightX: number[][] = [], rightY: number[] = [];

    for (let i = 0; i < X.length; i++) {
      if (X[i][bestFeature] <= bestThreshold) {
        leftX.push(X[i]);
        leftY.push(y[i]);
      } else {
        rightX.push(X[i]);
        rightY.push(y[i]);
      }
    }

    return {
      isLeaf: false,
      featureIndex: bestFeature,
      threshold: bestThreshold,
      left: this.buildTree(leftX, leftY, depth + 1),
      right: this.buildTree(rightX, rightY, depth + 1),
    };
  }

  predictProb(x: number[]): number {
    let curr = this.root;
    while (curr && !curr.isLeaf) {
      if (curr.featureIndex !== undefined && curr.threshold !== undefined) {
        if (x[curr.featureIndex] <= curr.threshold) {
          curr = curr.left ?? null;
        } else {
          curr = curr.right ?? null;
        }
      } else {
        break;
      }
    }
    return curr?.prob ?? 0.5;
  }

  predict(x: number[]): number {
    return this.predictProb(x) >= 0.5 ? 1 : 0;
  }
}

// --------------------------------------------------------------------------
// 4. RANDOM FOREST
// --------------------------------------------------------------------------
export class RandomForestModel {
  numTrees: number;
  trees: DecisionTreeModel[] = [];

  constructor(numTrees = 7) {
    this.numTrees = numTrees;
  }

  train(X: number[][], y: number[]) {
    this.trees = [];
    const rng = new SeededRandom(101);

    for (let t = 0; t < this.numTrees; t++) {
      // Bootstrap sampling with replacement
      const sampleX: number[][] = [];
      const sampleY: number[] = [];
      const n = X.length;

      for (let i = 0; i < n; i++) {
        const randIdx = Math.floor(rng.next() * n);
        sampleX.push(X[randIdx]);
        sampleY.push(y[randIdx]);
      }

      const tree = new DecisionTreeModel(4, 4);
      tree.train(sampleX, sampleY);
      this.trees.push(tree);
    }
  }

  predictProb(x: number[]): number {
    let sumProb = 0;
    for (const tree of this.trees) {
      sumProb += tree.predictProb(x);
    }
    return sumProb / (this.trees.length || 1);
  }

  predict(x: number[]): number {
    return this.predictProb(x) >= 0.5 ? 1 : 0;
  }
}

// --------------------------------------------------------------------------
// 5. SUPPORT VECTOR MACHINE (SVM) - Soft margin linear SVM (Pegasos)
// --------------------------------------------------------------------------
export class SVMModel {
  weights: number[] = [];
  bias: number = 0;

  train(X: number[][], y: number[], epochs = 100, lambda = 0.01) {
    const numFeatures = X[0].length;
    this.weights = new Array(numFeatures).fill(0);
    this.bias = 0;

    // Convert labels from {0, 1} to {-1, +1}
    const y_svm = y.map((label) => (label === 1 ? 1 : -1));
    let t = 1;

    for (let ep = 0; ep < epochs; ep++) {
      for (let i = 0; i < X.length; i++) {
        const lr = 1 / (lambda * t);
        t++;

        let dotVal = 0;
        for (let f = 0; f < numFeatures; f++) dotVal += this.weights[f] * X[i][f];
        dotVal += this.bias;

        if (y_svm[i] * dotVal < 1) {
          // Margin violation
          for (let f = 0; f < numFeatures; f++) {
            this.weights[f] = (1 - lr * lambda) * this.weights[f] + lr * y_svm[i] * X[i][f];
          }
          this.bias += lr * y_svm[i] * 0.1;
        } else {
          for (let f = 0; f < numFeatures; f++) {
            this.weights[f] = (1 - lr * lambda) * this.weights[f];
          }
        }
      }
    }
  }

  predictProb(x: number[]): number {
    let score = 0;
    for (let f = 0; f < this.weights.length; f++) score += this.weights[f] * x[f];
    score += this.bias;
    // Calibrate to pseudo-probability via Platt sigmoid scaling
    return 1 / (1 + Math.exp(-score * 1.5));
  }

  predict(x: number[]): number {
    return this.predictProb(x) >= 0.5 ? 1 : 0;
  }
}

// --------------------------------------------------------------------------
// 6. ARTIFICIAL NEURAL NETWORK (ANN)
// Architecture: Input (D) -> Dense (16) -> ReLU -> Dense (8) -> ReLU -> Dense (1) -> Sigmoid
// --------------------------------------------------------------------------
export class SimpleNeuralNetwork {
  w1: number[][] = []; // [16][D]
  b1: number[] = [];   // [16]
  w2: number[][] = []; // [8][16]
  b2: number[] = [];   // [8]
  w3: number[] = [];   // [8]
  b3: number = 0;
  history: TrainingEpoch[] = [];

  constructor() {
    this.history = [];
  }

  train(
    X_train: number[][],
    y_train: number[],
    X_val: number[][],
    y_val: number[],
    epochs = 45,
    lr = 0.05
  ): TrainingEpoch[] {
    const d = X_train[0].length;
    const h1 = 16;
    const h2 = 8;
    const rng = new SeededRandom(77);

    // He initialization
    this.w1 = Array.from({ length: h1 }, () =>
      Array.from({ length: d }, () => (rng.next() - 0.5) * Math.sqrt(2 / d))
    );
    this.b1 = new Array(h1).fill(0);

    this.w2 = Array.from({ length: h2 }, () =>
      Array.from({ length: h1 }, () => (rng.next() - 0.5) * Math.sqrt(2 / h1))
    );
    this.b2 = new Array(h2).fill(0);

    this.w3 = Array.from({ length: h2 }, () => (rng.next() - 0.5) * Math.sqrt(2 / h2));
    this.b3 = 0;

    this.history = [];

    for (let ep = 1; ep <= epochs; ep++) {
      let totalLoss = 0;
      let trainCorrect = 0;

      // Batch gradient descent / updates
      for (let i = 0; i < X_train.length; i++) {
        const x = X_train[i];
        const target = y_train[i];

        // Forward pass
        // Layer 1
        const z1: number[] = new Array(h1).fill(0);
        const a1: number[] = new Array(h1).fill(0);
        for (let j = 0; j < h1; j++) {
          let s = 0;
          for (let k = 0; k < d; k++) s += this.w1[j][k] * x[k];
          z1[j] = s + this.b1[j];
          a1[j] = Math.max(0, z1[j]); // ReLU
        }

        // Layer 2
        const z2: number[] = new Array(h2).fill(0);
        const a2: number[] = new Array(h2).fill(0);
        for (let j = 0; j < h2; j++) {
          let s = 0;
          for (let k = 0; k < h1; k++) s += this.w2[j][k] * a1[k];
          z2[j] = s + this.b2[j];
          a2[j] = Math.max(0, z2[j]); // ReLU
        }

        // Layer 3 (Output)
        let z3 = 0;
        for (let j = 0; j < h2; j++) z3 += this.w3[j] * a2[j];
        z3 += this.b3;
        const p = 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z3)))); // Sigmoid

        // Binary Cross-Entropy Loss
        const safeP = Math.max(0.0001, Math.min(0.9999, p));
        const loss = -(target * Math.log(safeP) + (1 - target) * Math.log(1 - safeP));
        totalLoss += loss;

        if ((p >= 0.5 ? 1 : 0) === target) trainCorrect++;

        // Backward pass
        const dZ3 = p - target; // derivative of BCE wrt output logit

        // Gradients for Layer 3
        const dW3 = a2.map((val) => dZ3 * val);
        const dB3 = dZ3;

        // Gradients for Layer 2
        const dZ2: number[] = new Array(h2).fill(0);
        for (let j = 0; j < h2; j++) {
          const reluGrad = z2[j] > 0 ? 1 : 0;
          dZ2[j] = dZ3 * this.w3[j] * reluGrad;
        }

        const dW2: number[][] = Array.from({ length: h2 }, () => new Array(h1).fill(0));
        for (let j = 0; j < h2; j++) {
          for (let k = 0; k < h1; k++) {
            dW2[j][k] = dZ2[j] * a1[k];
          }
        }

        // Gradients for Layer 1
        const dZ1: number[] = new Array(h1).fill(0);
        for (let k = 0; k < h1; k++) {
          let sumDown = 0;
          for (let j = 0; j < h2; j++) {
            sumDown += dZ2[j] * this.w2[j][k];
          }
          const reluGrad = z1[k] > 0 ? 1 : 0;
          dZ1[k] = sumDown * reluGrad;
        }

        const dW1: number[][] = Array.from({ length: h1 }, () => new Array(d).fill(0));
        for (let j = 0; j < h1; j++) {
          for (let k = 0; k < d; k++) {
            dW1[j][k] = dZ1[j] * x[k];
          }
        }

        // Weight updates
        for (let j = 0; j < h2; j++) this.w3[j] -= lr * dW3[j];
        this.b3 -= lr * dB3;

        for (let j = 0; j < h2; j++) {
          for (let k = 0; k < h1; k++) {
            this.w2[j][k] -= lr * dW2[j][k];
          }
          this.b2[j] -= lr * dZ2[j];
        }

        for (let j = 0; j < h1; j++) {
          for (let k = 0; k < d; k++) {
            this.w1[j][k] -= lr * dW1[j][k];
          }
          this.b1[j] -= lr * dZ1[j];
        }
      }

      // Compute validation accuracy
      let valCorrect = 0;
      for (let i = 0; i < X_val.length; i++) {
        const pred = this.predict(X_val[i]);
        if (pred === y_val[i]) valCorrect++;
      }

      const avgLoss = Math.round((totalLoss / X_train.length) * 1000) / 1000;
      const trainAcc = Math.round((trainCorrect / X_train.length) * 1000) / 1000;
      const valAcc = Math.round((valCorrect / X_val.length) * 1000) / 1000;

      this.history.push({
        epoch: ep,
        loss: avgLoss,
        trainAccuracy: trainAcc,
        valAccuracy: valAcc,
      });
    }

    return this.history;
  }

  predictProb(x: number[]): number {
    const d = x.length;
    const h1 = 16;
    const h2 = 8;

    const a1: number[] = new Array(h1).fill(0);
    for (let j = 0; j < h1; j++) {
      let s = 0;
      for (let k = 0; k < d; k++) s += this.w1[j][k] * x[k];
      a1[j] = Math.max(0, s + this.b1[j]);
    }

    const a2: number[] = new Array(h2).fill(0);
    for (let j = 0; j < h2; j++) {
      let s = 0;
      for (let k = 0; k < h1; k++) s += this.w2[j][k] * a1[k];
      a2[j] = Math.max(0, s + this.b2[j]);
    }

    let z3 = 0;
    for (let j = 0; j < h2; j++) z3 += this.w3[j] * a2[j];
    z3 += this.b3;
    return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z3))));
  }

  predict(x: number[]): number {
    return this.predictProb(x) >= 0.5 ? 1 : 0;
  }
}

// --------------------------------------------------------------------------
// MODEL TRAINING MANAGER
// --------------------------------------------------------------------------
export interface TrainedModelInstances {
  logistic: LogisticRegressionModel;
  knn: KNNModel;
  decisionTree: DecisionTreeModel;
  randomForest: RandomForestModel;
  svm: SVMModel;
  ann: SimpleNeuralNetwork;
}

export function trainAllModels(
  preprocessed: PreprocessedData
): { results: ModelResult[]; instances: TrainedModelInstances } {
  const { X_train, y_train, X_test, y_test } = preprocessed;

  // 1. Logistic Regression
  const startLog = performance.now();
  const lrModel = new LogisticRegressionModel();
  lrModel.train(X_train, y_train);
  const logPreds = X_test.map((x) => lrModel.predict(x));
  const logMetrics = calculateMetrics(y_test, logPreds);
  const logTime = Math.round(performance.now() - startLog);

  // 2. KNN
  const startKnn = performance.now();
  const knnModel = new KNNModel(5);
  knnModel.train(X_train, y_train);
  const knnPreds = X_test.map((x) => knnModel.predict(x));
  const knnMetrics = calculateMetrics(y_test, knnPreds);
  const knnTime = Math.round(performance.now() - startKnn);

  // 3. Decision Tree
  const startDt = performance.now();
  const dtModel = new DecisionTreeModel(4, 4);
  dtModel.train(X_train, y_train);
  const dtPreds = X_test.map((x) => dtModel.predict(x));
  const dtMetrics = calculateMetrics(y_test, dtPreds);
  const dtTime = Math.round(performance.now() - startDt);

  // 4. Random Forest
  const startRf = performance.now();
  const rfModel = new RandomForestModel(7);
  rfModel.train(X_train, y_train);
  const rfPreds = X_test.map((x) => rfModel.predict(x));
  const rfMetrics = calculateMetrics(y_test, rfPreds);
  const rfTime = Math.round(performance.now() - startRf);

  // 5. SVM
  const startSvm = performance.now();
  const svmModel = new SVMModel();
  svmModel.train(X_train, y_train);
  const svmPreds = X_test.map((x) => svmModel.predict(x));
  const svmMetrics = calculateMetrics(y_test, svmPreds);
  const svmTime = Math.round(performance.now() - startSvm);

  // 6. Neural Network
  const startAnn = performance.now();
  const annModel = new SimpleNeuralNetwork();
  const history = annModel.train(X_train, y_train, X_test, y_test, 45, 0.05);
  const annPreds = X_test.map((x) => annModel.predict(x));
  const annMetrics = calculateMetrics(y_test, annPreds);
  const annTime = Math.round(performance.now() - startAnn);

  const results: ModelResult[] = [
    {
      id: 'logistic_regression',
      name: 'Logistic Regression',
      type: 'ml',
      description: 'Finds a linear decision boundary using the sigmoid activation function.',
      hyperparameters: { 'Learning Rate': 0.08, Epochs: 120, Solver: 'Gradient Descent' },
      metrics: logMetrics,
      trainingTimeMs: logTime,
      isTrained: true,
    },
    {
      id: 'knn',
      name: 'K-Nearest Neighbors (KNN)',
      type: 'ml',
      description: 'Classifies each sample based on majority vote of its 5 closest neighbors in feature space.',
      hyperparameters: { 'k Neighbors': 5, Distance: 'Euclidean', Metric: 'Standardized' },
      metrics: knnMetrics,
      trainingTimeMs: knnTime,
      isTrained: true,
    },
    {
      id: 'decision_tree',
      name: 'Decision Tree',
      type: 'ml',
      description: 'Splits features sequentially using Gini Impurity to form hierarchical if-then rules.',
      hyperparameters: { 'Max Depth': 4, 'Min Samples Split': 4, Criterion: 'Gini' },
      metrics: dtMetrics,
      trainingTimeMs: dtTime,
      isTrained: true,
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      type: 'ml',
      description: 'Ensemble of 7 randomized decision trees combining predictions by majority voting.',
      hyperparameters: { 'Number of Trees': 7, 'Max Depth': 4, Sampling: 'Bootstrap' },
      metrics: rfMetrics,
      trainingTimeMs: rfTime,
      isTrained: true,
    },
    {
      id: 'svm',
      name: 'Support Vector Machine (SVM)',
      type: 'ml',
      description: 'Finds the optimal separating hyperplane that maximizes the margin between classes.',
      hyperparameters: { Kernel: 'Linear', Lambda: 0.01, Loss: 'Hinge Loss' },
      metrics: svmMetrics,
      trainingTimeMs: svmTime,
      isTrained: true,
    },
    {
      id: 'ann',
      name: 'Artificial Neural Network',
      type: 'dl',
      description: '3-layer Multi-Layer Perceptron (Dense 16 -> ReLU -> Dense 8 -> ReLU -> Dense 1 -> Sigmoid).',
      hyperparameters: {
        Architecture: 'Input -> 16 -> 8 -> 1',
        Activation: 'ReLU + Sigmoid',
        Optimizer: 'SGD',
        Epochs: 45,
      },
      metrics: annMetrics,
      trainingTimeMs: annTime,
      isTrained: true,
      history,
    },
  ];

  return {
    results,
    instances: {
      logistic: lrModel,
      knn: knnModel,
      decisionTree: dtModel,
      randomForest: rfModel,
      svm: svmModel,
      ann: annModel,
    },
  };
}

/**
 * Predict on new patient input using selected model
 */
export function predictPatient(
  patient: PatientInput,
  preprocessed: PreprocessedData,
  instances: TrainedModelInstances,
  modelId: string
): PredictionResult {
  const { featureNames, means, stds } = preprocessed;

  // Extract raw vector and scale using the saved training mean and std
  const rawVector = featureNames.map((fn) => patient[fn] ?? 0);
  const scaledVector = rawVector.map((val, idx) => (val - means[idx]) / stds[idx]);

  let prob = 0.5;
  let modelName = 'Model';

  switch (modelId) {
    case 'logistic_regression':
      prob = instances.logistic.predictProb(scaledVector);
      modelName = 'Logistic Regression';
      break;
    case 'knn':
      prob = instances.knn.predictProb(scaledVector);
      modelName = 'K-Nearest Neighbors (KNN)';
      break;
    case 'decision_tree':
      prob = instances.decisionTree.predictProb(scaledVector);
      modelName = 'Decision Tree';
      break;
    case 'random_forest':
      prob = instances.randomForest.predictProb(scaledVector);
      modelName = 'Random Forest';
      break;
    case 'svm':
      prob = instances.svm.predictProb(scaledVector);
      modelName = 'Support Vector Machine (SVM)';
      break;
    case 'ann':
      prob = instances.ann.predictProb(scaledVector);
      modelName = 'Artificial Neural Network';
      break;
    default:
      prob = instances.randomForest.predictProb(scaledVector);
      modelName = 'Random Forest';
  }

  const hasDisease = prob >= 0.5;
  const pct = Math.round(prob * 100);

  let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  if (pct >= 65) riskLevel = 'High';
  else if (pct >= 40) riskLevel = 'Moderate';

  // Identify notable risk factors based on general medical thresholds
  const factors: { feature: string; value: string; impact: 'High' | 'Normal' }[] = [];

  if (patient.age !== undefined) {
    factors.push({
      feature: 'Age',
      value: `${patient.age} yrs`,
      impact: patient.age >= 60 ? 'High' : 'Normal',
    });
  }
  if (patient.trestbps !== undefined) {
    factors.push({
      feature: 'Resting Blood Pressure',
      value: `${patient.trestbps} mm Hg`,
      impact: patient.trestbps >= 140 ? 'High' : 'Normal',
    });
  }
  if (patient.chol !== undefined) {
    factors.push({
      feature: 'Cholesterol',
      value: `${patient.chol} mg/dl`,
      impact: patient.chol >= 240 ? 'High' : 'Normal',
    });
  }
  if (patient.thalach !== undefined) {
    factors.push({
      feature: 'Max Heart Rate',
      value: `${patient.thalach} bpm`,
      impact: patient.thalach <= 130 ? 'High' : 'Normal',
    });
  }
  if (patient.exang !== undefined) {
    factors.push({
      feature: 'Exercise Induced Angina',
      value: patient.exang === 1 ? 'Yes' : 'No',
      impact: patient.exang === 1 ? 'High' : 'Normal',
    });
  }

  return {
    hasDisease,
    probability: pct,
    modelName,
    riskLevel,
    keyContributingFactors: factors,
  };
}
