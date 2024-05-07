export const pearsonCorrelation = (data, prop1, prop2) => {
    let xi = 0;
    let yi = 0;
    let xi2 = 0;
    let yi2 = 0;
    let xiyi = 0;
    let n = data.length;

    for (let i = 0; i < n; i++) {
        const x = data[i][prop1];
        const y = data[i][prop2];

        xi += x;
        yi += y;
        xi2 += x * x;
        yi2 += y * y;
        xiyi += x * y;
    }

    const prodSum = n * xiyi;
    const xSum = xi * yi;
    const xSumSquares = n * xi2 - xi * xi;
    const ySumSquares = n * yi2 - yi * yi;

    const numerator = prodSum - xSum;
    const denominator = Math.sqrt(xSumSquares * ySumSquares);

    if (denominator === 0) return 0;

    return numerator / denominator;
};