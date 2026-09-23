'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Filter } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKeys?: (keyof T | string)[];
  searchPlaceholder?: string;
  filters?: {
    label: string;
    key: keyof T | string;
    options: { label: string; value: string }[];
  }[];
  actions?: React.ReactNode;
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKeys = [],
  searchPlaceholder = 'Search records...',
  filters = [],
  actions,
  defaultSortKey,
  defaultSortDir = 'asc',
  onRowClick,
  isLoading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle Filter Change
  const handleFilterChange = (key: string, val: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: val,
    }));
    setCurrentPage(1);
  };

  // Filter & Search Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search matching
      if (search.trim()) {
        const query = search.toLowerCase();
        const matches = searchKeys.some((k) => {
          const val = item[k as string];
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(query);
          return String(val).toLowerCase().includes(query);
        });
        if (!matches) return false;
      }

      // Filter matching
      for (const [fKey, fVal] of Object.entries(selectedFilters)) {
        if (!fVal || fVal === 'ALL') continue;
        const itemVal = String(item[fKey]);
        if (itemVal.toLowerCase() !== fVal.toLowerCase()) return false;
      }

      return true;
    });
  }, [data, search, searchKeys, selectedFilters]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Toggle Sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col select-none">
      {/* Search and Filters Bar */}
      <div className="p-3 sm:p-4 border-b border-neutral-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900/80 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <div key={f.key as string} className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs">
              <Filter className="w-3 h-3 text-neutral-500" />
              <select
                value={selectedFilters[f.key as string] || 'ALL'}
                onChange={(e) => handleFilterChange(f.key as string, e.target.value)}
                className="bg-transparent text-neutral-300 focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL" className="bg-neutral-950 text-neutral-400">All {f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-neutral-950 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-800/80 bg-neutral-900/40 text-neutral-400 uppercase tracking-wider text-[11px] font-semibold">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-4 ${col.className || ''} ${
                    col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown className="w-3 h-3 text-neutral-600 group-hover:text-white" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/80">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16 text-neutral-500">
                  <div className="inline-block w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="mt-2 text-xs">Loading records...</p>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16 text-neutral-500">
                  <p className="text-sm font-semibold text-neutral-400">No records found</p>
                  <p className="text-xs text-neutral-600 mt-1">Try refining your search query or active filters.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors hover:bg-neutral-900/50 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`py-3 px-4 text-neutral-300 ${col.className || ''}`}>
                      {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white text-xs focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>per page • Showing {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-mono text-neutral-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
