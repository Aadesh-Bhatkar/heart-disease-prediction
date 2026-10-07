import { DatasetRow, ParsedDataset } from '../types';

export function parseCSV(csvText: string, filename: string = 'Heart.csv'): ParsedDataset {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least 1 data row.');
  }

  // Parse header
  const headerParts = lines[0].split(',').map((c) => c.trim().toLowerCase());
  const columns = headerParts.map((col) => col.replace(/^["']|["']$/g, ''));

  const rows: DatasetRow[] = [];
  const missingValues: Record<string, number> = {};
  columns.forEach((col) => (missingValues[col] = 0));

  for (let i = 1; i < lines.length; i++) {
    const rawParts = lines[i].split(',').map((p) => p.trim());
    if (rawParts.length !== columns.length) {
      // tolerate trailing blanks or mismatched row lengths gracefully
      continue;
    }

    const rowObj: DatasetRow = {};
    for (let c = 0; c < columns.length; c++) {
      const colName = columns[c];
      const valStr = rawParts[c];

      if (
        valStr === '' ||
        valStr === '?' ||
        valStr.toLowerCase() === 'na' ||
        valStr.toLowerCase() === 'null' ||
        valStr.toLowerCase() === 'none'
      ) {
        missingValues[colName]++;
        rowObj[colName] = NaN;
      } else {
        const numVal = parseFloat(valStr);
        if (isNaN(numVal)) {
          missingValues[colName]++;
          rowObj[colName] = NaN;
        } else {
          rowObj[colName] = numVal;
        }
      }
    }
    rows.push(rowObj);
  }

  // Impute missing values (using column median/mean for continuous features)
  columns.forEach((col) => {
    const validVals = rows.map((r) => r[col]).filter((v) => !isNaN(v));
    const mean = validVals.length > 0 ? validVals.reduce((a, b) => a + b, 0) / validVals.length : 0;
    rows.forEach((r) => {
      if (isNaN(r[col])) {
        r[col] = Math.round(mean * 100) / 100;
      }
    });
  });

  // Determine target column
  let targetCol = columns[columns.length - 1];
  const targetCandidates = ['target', 'output', 'condition', 'num', 'heartdisease', 'diagnosis', 'label'];
  for (const candidate of targetCandidates) {
    if (columns.includes(candidate)) {
      targetCol = candidate;
      break;
    }
  }

  // Identify numerical vs categorical
  const categoricalCols: string[] = [];
  const numericalCols: string[] = [];

  columns.forEach((col) => {
    if (col === targetCol) return;
    const uniqueVals = new Set(rows.map((r) => r[col]));
    // If unique values <= 5 or integer binary
    if (uniqueVals.size <= 5) {
      categoricalCols.push(col);
    } else {
      numericalCols.push(col);
    }
  });

  return {
    filename,
    columns,
    rows,
    totalRows: rows.length,
    totalColumns: columns.length,
    missingValues,
    numericalColumns: numericalCols,
    categoricalColumns: categoricalCols,
    targetColumn: targetCol,
  };
}
