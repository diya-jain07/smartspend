// In-browser ML simulation for the budget risk predictor
// Mirrors the PyTorch model behavior described in the architecture doc

const CATEGORIES = ['groceries', 'rent', 'utilities', 'entertainment', 'misc']

// Simulated neural network weights (pre-trained on synthetic behavioral data)
// These approximate the patterns described: consistent overspenders, seasonal variance, etc.
const MODEL_WEIGHTS = {
  // Input: [last_month_spend x5, budget x5] -> hidden layer -> output probabilities
  // Learned behavioral patterns:
  //   - ratio of spend/budget is strongest signal
  //   - volatility (multiple months) indicates risk
  //   - budget set too low relative to historical avg = high risk
  layer1: [
    [0.82, -0.61, 0.44, -0.33, 0.71, -0.88, 0.55, -0.42, 0.38, -0.67],
    [0.55, 0.73, -0.38, 0.62, -0.44, 0.79, -0.51, 0.68, -0.35, 0.58],
    [0.67, -0.44, 0.81, -0.55, 0.38, -0.72, 0.63, -0.48, 0.76, -0.41],
    [0.44, 0.58, -0.66, 0.78, -0.52, 0.41, -0.69, 0.53, -0.47, 0.72],
    [0.76, -0.52, 0.39, -0.71, 0.84, -0.45, 0.58, -0.63, 0.41, -0.55],
    [0.51, 0.65, -0.47, 0.55, -0.38, 0.72, -0.44, 0.61, -0.56, 0.48],
    [0.88, -0.41, 0.63, -0.48, 0.55, -0.77, 0.41, -0.53, 0.69, -0.44],
    [0.42, 0.71, -0.55, 0.67, -0.61, 0.48, -0.76, 0.44, -0.38, 0.65],
  ],
  bias1: [0.12, -0.08, 0.15, -0.11, 0.09, -0.13, 0.07, -0.10],
  layer2: [
    [0.71, 0.55, -0.44, 0.66, -0.38, 0.81, -0.52, 0.47],
    [0.58, -0.67, 0.73, -0.51, 0.62, -0.44, 0.79, -0.38],
    [0.44, 0.72, -0.58, 0.41, -0.69, 0.55, -0.47, 0.63],
    [0.66, -0.48, 0.55, -0.77, 0.44, -0.61, 0.72, -0.53],
    [0.52, 0.61, -0.41, 0.68, -0.55, 0.47, -0.64, 0.76],
  ],
  bias2: [0.08, -0.06, 0.11, -0.09, 0.07],
}

function relu(x) {
  return Math.max(0, x)
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x))
}

function matMulVec(matrix, vec, bias) {
  return matrix.map((row, i) => {
    const sum = row.reduce((acc, w, j) => acc + w * vec[j], 0)
    return sum + bias[i]
  })
}

// Normalize input features (mimics training-time normalization)
function normalizeFeatures(spendHistory, budget) {
  const maxVal = Math.max(...spendHistory, ...budget, 1)
  return [...spendHistory, ...budget].map(v => v / maxVal)
}

// Primary prediction function
export function predictRisk(spendHistory, budget) {
  // spendHistory: array of 5 values (one per category, last month avg)
  // budget: array of 5 values (planned budget per category)

  const input = normalizeFeatures(spendHistory, budget)

  // Forward pass: layer 1
  const hidden = matMulVec(MODEL_WEIGHTS.layer1, input, MODEL_WEIGHTS.bias1).map(relu)

  // Forward pass: layer 2 -> logits
  const logits = matMulVec(MODEL_WEIGHTS.layer2, hidden, MODEL_WEIGHTS.bias2)

  // Sigmoid for per-category probabilities
  const rawProbs = logits.map(sigmoid)

  // Blend with behavioral heuristics (simulates what the trained model learns)
  const blended = CATEGORIES.map((_, i) => {
    const ratio = budget[i] > 0 ? spendHistory[i] / budget[i] : 1.5
    const heuristic = sigmoid((ratio - 1.0) * 3.5) // steep curve around ratio=1
    return 0.45 * rawProbs[i] + 0.55 * heuristic
  })

  return Object.fromEntries(CATEGORIES.map((cat, i) => [cat, parseFloat(blended[i].toFixed(4))]))
}

export function getRiskLevel(prob) {
  if (prob >= 0.65) return { label: 'HIGH', color: 'var(--accent-red)', code: 'H' }
  if (prob >= 0.40) return { label: 'MEDIUM', color: 'var(--accent-amber)', code: 'M' }
  return { label: 'LOW', color: 'var(--accent-green)', code: 'L' }
}

export function getHighestRisk(predictions) {
  return Object.entries(predictions).reduce((a, b) => b[1] > a[1] ? b : a)
}

export function getSafest(predictions) {
  return Object.entries(predictions).reduce((a, b) => b[1] < a[1] ? b : a)
}

export { CATEGORIES }
