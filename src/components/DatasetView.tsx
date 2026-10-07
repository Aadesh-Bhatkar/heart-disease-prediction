import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  RotateCcw,
  Download,
  AlertCircle,
  CheckCircle2,
  Table as TableIcon,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Eye,
  Info,
  Sparkles,
} from 'lucide-react';
import { ParsedDataset, DatasetRow } from '../types';
import { FEATURE_METADATA } from '../data/defaultDataset';

interface DatasetViewProps {
  dataset: ParsedDataset;
  onFileUpload: (file: File) => void;
  onResetDefault: () => void;
}

export const DatasetView: React.FC<DatasetViewProps> = ({
  dataset,
  onFileUpload,
  onResetDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDictionary, setShowDictionary] = useState<boolean>(true);
  const [rowsToDisplay, setRowsToDisplay] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [columnFilter, setColumnFilter] = useState<'all' | 'numerical' | 'categorical'>('all');
  const [selectedRow, setSelectedRow] = useState<DatasetRow | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const headers = dataset.columns.join(',');
    const rowsStr = dataset.rows
      .map((r) => dataset.columns.map((col) => r[col] ?? '').join(','))
      .join('\n');
    const csvContent = `${headers}\n${rowsStr}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Heart.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalMissing = Object.values(dataset.missingValues).reduce((a, b) => a + b, 0);

  // Filter columns based on columnFilter
  const visibleColumns = dataset.columns.filter((col) => {
    if (col === dataset.targetColumn) return true;
    if (columnFilter === 'numerical') return dataset.numericalColumns.includes(col);
    if (columnFilter === 'categorical') return dataset.categoricalColumns.includes(col);
    return true;
  });

  // Filter rows by search term
  const filteredRows = dataset.rows.filter((row) => {
    if (!searchTerm.trim()) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  });
  const displayedRows = filteredRows.slice(0, rowsToDisplay);

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner with Richer Gradient */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Source File: {dataset.filename}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Heart Disease Dataset Explorer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Inspect raw health features, verify column statistics, or upload your own{' '}
              <code className="bg-white px-1.5 py-0.5 rounded-md font-mono border border-slate-200">
                Heart.csv
              </code>
              .
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Heart.csv
            </button>
            <button
              onClick={onResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs cursor-pointer transition-all hover:scale-105"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              Load Cleveland (303 rows)
            </button>
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs cursor-pointer transition-all hover:scale-105"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats Cards with Vivid Colored Top Borders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="h-1.5 w-full bg-blue-500 absolute top-0 left-0" />
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Rows</div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 font-mono">
            {dataset.totalRows}
          </div>
          <div className="text-xs text-slate-500 mt-1">Patient records analyzed</div>
        </div>

        <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="h-1.5 w-full bg-indigo-500 absolute top-0 left-0" />
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Total Columns
          </div>
          <div className="text-3xl sm:text-4xl font-black text-indigo-600 mt-2 font-mono">
            {dataset.totalColumns}
          </div>
          <div className="text-xs text-slate-500 mt-1">13 Features + 1 Target</div>
        </div>

        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="h-1.5 w-full bg-emerald-500 absolute top-0 left-0" />
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Target Column
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2 font-mono truncate">
            {dataset.targetColumn}
          </div>
          <div className="text-xs text-slate-500 mt-1">0 = Healthy, 1 = Disease</div>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="h-1.5 w-full bg-amber-500 absolute top-0 left-0" />
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Missing Values
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-3xl sm:text-4xl font-black font-mono ${
                totalMissing === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {totalMissing}
            </span>
            {totalMissing === 0 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500" />
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {totalMissing === 0 ? 'Clean dataset (0 nulls)' : 'Cleaned & imputed'}
          </div>
        </div>
      </div>

      {/* Column Badges & Interactive Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-blue-600" />
            Detected Dataset Columns ({dataset.columns.length})
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              onClick={() => setColumnFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                columnFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({dataset.columns.length})
            </button>
            <button
              onClick={() => setColumnFilter('numerical')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                columnFilter === 'numerical'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              Numerical ({dataset.numericalColumns.length})
            </button>
            <button
              onClick={() => setColumnFilter('categorical')}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                columnFilter === 'categorical'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              Categorical ({dataset.categoricalColumns.length})
            </button>
          </div>
        </div>

        {/* Badges List with Vibrant Colors */}
        <div className="flex flex-wrap gap-2 pt-1">
          {visibleColumns.map((col) => {
            const isTarget = col === dataset.targetColumn;
            const isNum = dataset.numericalColumns.includes(col);
            const meta = FEATURE_METADATA[col];

            let badgeStyle =
              'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 hover:border-purple-300';
            if (isNum) {
              badgeStyle =
                'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 hover:border-sky-300';
            }
            if (isTarget) {
              badgeStyle =
                'bg-emerald-100 text-emerald-900 border-emerald-400 shadow-2xs font-extrabold';
            }

            return (
              <span
                key={col}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${badgeStyle}`}
                title={meta?.description ?? `Feature: ${col}`}
              >
                <span>{col}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-sans uppercase font-bold ${
                    isTarget
                      ? 'bg-emerald-600 text-white'
                      : isNum
                      ? 'bg-sky-200 text-sky-900'
                      : 'bg-purple-200 text-purple-900'
                  }`}
                >
                  {isTarget ? 'Target' : isNum ? 'Num' : 'Cat'}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* First 10 Rows Table with Color Highlights */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-blue-600" />
              First {rowsToDisplay} Rows of Dataset
            </h3>
            <p className="text-xs text-slate-500">
              Click any patient row to view full clinical details in the inspector card below
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Filter table values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-blue-500 w-40 sm:w-48 bg-white shadow-2xs"
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>Show:</span>
              <select
                value={rowsToDisplay}
                onChange={(e) => setRowsToDisplay(Number(e.target.value))}
                className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 shadow-2xs font-bold"
              >
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 text-slate-400 font-mono w-12 text-center">#</th>
                {dataset.columns.map((col) => (
                  <th
                    key={col}
                    className={`px-3 py-3 whitespace-nowrap ${
                      col === dataset.targetColumn ? 'text-emerald-800 font-extrabold bg-emerald-50' : ''
                    }`}
                  >
                    {col}
                  </th>
                ))}
                <th className="px-3 py-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={dataset.columns.length + 2} className="p-8 text-center text-slate-400">
                    No rows match your search filter.
                  </td>
                </tr>
              ) : (
                displayedRows.map((row, idx) => {
                  const targetVal = row[dataset.targetColumn];
                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedRow(row)}
                      className={`hover:bg-blue-50/70 transition-colors cursor-pointer ${
                        selectedRow === row ? 'bg-blue-50 ring-1 ring-blue-400' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 text-slate-400 text-center font-sans font-medium">
                        {idx + 1}
                      </td>
                      {dataset.columns.map((col) => {
                        const val = row[col];
                        const isTarget = col === dataset.targetColumn;

                        // Colorful values
                        let valStyle = '';
                        if (isTarget) {
                          valStyle =
                            val === 1
                              ? 'bg-rose-100 text-rose-800 font-extrabold rounded-md px-2 py-0.5'
                              : 'bg-emerald-100 text-emerald-800 font-extrabold rounded-md px-2 py-0.5';
                        } else if (col === 'chol' && val > 260) {
                          valStyle = 'text-amber-700 font-bold';
                        } else if (col === 'trestbps' && val >= 140) {
                          valStyle = 'text-rose-700 font-bold';
                        }

                        return (
                          <td key={col} className="px-3 py-2.5 whitespace-nowrap">
                            <span className={valStyle}>{val !== undefined ? val : '-'}</span>
                          </td>
                        );
                      })}
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(row);
                          }}
                          className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                          title="View patient card"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Displaying {displayedRows.length} of {dataset.totalRows} records
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Target = 0 (No Heart Disease)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Target = 1 (Heart Disease Detected)
            </span>
          </div>
        </div>
      </div>

      {/* Selected Row Interactive Detail Card */}
      {selectedRow && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                Patient Quick-Inspector Card
              </h4>
            </div>
            <button
              onClick={() => setSelectedRow(null)}
              className="text-xs text-slate-500 hover:text-slate-900 font-bold px-2 py-1 rounded-md bg-white border border-slate-200 cursor-pointer"
            >
              Close Inspector
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-xs font-mono pt-1">
            {dataset.columns.map((c) => {
              const isTarget = c === dataset.targetColumn;
              return (
                <div
                  key={c}
                  className={`p-2.5 rounded-xl border bg-white shadow-2xs ${
                    isTarget ? 'border-emerald-300 ring-2 ring-emerald-200' : 'border-slate-200'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 font-sans uppercase font-bold truncate">
                    {c}
                  </div>
                  <div
                    className={`text-sm font-black mt-0.5 ${
                      isTarget
                        ? selectedRow[c] === 1
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {selectedRow[c]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* College Viva Feature Dictionary Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <button
          onClick={() => setShowDictionary(!showDictionary)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Feature Guide &amp; Viva Dictionary (Cleveland UCI Dataset)
              </h3>
              <p className="text-xs text-slate-500">
                Click to expand clinical definitions of features frequently asked during viva
              </p>
            </div>
          </div>
          {showDictionary ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showDictionary && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {Object.entries(FEATURE_METADATA).map(([key, meta]) => {
                const isCat = meta.type === 'categorical';
                return (
                  <div
                    key={key}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-blue-700 text-xs">{meta.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCat ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {meta.type}
                      </span>
                    </div>
                    <div className="font-bold text-slate-800">{meta.label}</div>
                    <div className="text-slate-600 leading-relaxed">{meta.description}</div>
                    {meta.range && (
                      <div className="text-blue-600 font-semibold text-[11px]">
                        Normal range: {meta.range}
                      </div>
                    )}
                    {meta.options && (
                      <div className="text-slate-500 text-[11px] pt-1">
                        Encodings:{' '}
                        {meta.options.map((o) => `${o.value}: ${o.label}`).join(' | ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
