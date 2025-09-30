"use client";

import clsx from "clsx";
import React, { useMemo, useState } from "react";
import CheckboxCheckedIcon from "@/assets/icon/checkbox_true.svg";
import CheckboxUncheckedIcon from "@/assets/icon/checkbox_false.svg";

export type SortDirection = "asc" | "desc";

export type AdminTableColumn<T> = {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
};

export type AdminDataTableProps<T> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey?: (row: T, index: number) => React.Key;
  selectable?: boolean;
  selectedRowKeys?: Array<React.Key>;
  onSelectionChange?: (keys: Array<React.Key>) => void;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSortChange?: (
    key: string,
    direction: SortDirection,
    column: AdminTableColumn<T>,
  ) => void;
  emptyText?: string;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
};

function SortIcon({ direction }: { direction?: SortDirection }) {
  return (
    <span className="ml-1 inline-flex flex-col leading-none text-[var(--color-gray-400)]">
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        className={clsx(
          "-translate-y-[1px]", 
          direction === "asc" ? "text-primary" : "text-[var(--color-gray-300)]",
        )}
        aria-hidden
      >
        <path d="M5 1L9 5H1L5 1Z" fill="currentColor" />
      </svg>
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        className={clsx(
          "translate-y-[1px]", 
          direction === "desc" ? "text-primary" : "text-[var(--color-gray-300)]",
        )}
        aria-hidden
      >
        <path d="M5 7L1 3H9L5 7Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  selectable = true,
  selectedRowKeys,
  onSelectionChange,
  sortKey,
  sortDirection,
  onSortChange,
  emptyText = "데이터가 없습니다.",
  rowClassName,
  onRowClick,
}: AdminDataTableProps<T>) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Array<React.Key>>([]);
  const resolvedSelectedKeys = selectedRowKeys ?? internalSelectedKeys;
  const selectedKeySet = useMemo(() => new Set(resolvedSelectedKeys), [resolvedSelectedKeys]);
  const rowCount = rows.length;
  const canSelect = selectable;
  const allSelected =
    canSelect && rowCount > 0 && rows.every((row, index) => {
      const key = rowKey ? rowKey(row, index) : index;
      return selectedKeySet.has(key);
    });

  const toggleAll = () => {
    if (!canSelect) return;
    const setSelection = onSelectionChange ?? setInternalSelectedKeys;
    if (allSelected) {
      setSelection([]);
      return;
    }
    const nextKeys = rows.map((row, index) => (rowKey ? rowKey(row, index) : index));
    setSelection(nextKeys);
  };

  const toggleRow = (key: React.Key) => {
    if (!canSelect) return;
    const setSelection = onSelectionChange ?? setInternalSelectedKeys;
    const next = new Set(selectedKeySet);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelection(Array.from(next));
  };

  const handleSort = (column: AdminTableColumn<T>) => {
    if (!onSortChange || !column.sortable) return;
    const key = String(column.key);
    const nextDirection: SortDirection =
      sortKey === key ? (sortDirection === "asc" ? "desc" : "asc") : "asc";
    onSortChange(key, nextDirection, column);
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <colgroup>
          {canSelect && <col className="w-12" />}
          {columns.map((column) => (
            <col key={String(column.key)} className={column.width} />
          ))}
        </colgroup>
        <thead className="bg-[var(--color-gray-20)]">
          <tr>
            {canSelect && (
              <th className="px-4 py-3">
                <label
                  className="flex h-6 w-6 cursor-pointer items-center justify-center"
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="전체 선택"
                  />
                  {allSelected ? (
                    <CheckboxCheckedIcon className="h-6 w-6" aria-hidden />
                  ) : (
                    <CheckboxUncheckedIcon className="h-6 w-6" aria-hidden />
                  )}
                </label>
              </th>
            )}
            {columns.map((column) => {
              const key = String(column.key);
              const isSorted = sortKey === key;
              return (
                <th
                  key={key}
                  className={clsx(
                    "px-4 py-3 text-md font-medium uppercase tracking-[0.5px] text-[var(--color-gray-600)]",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className={clsx(
                        "flex w-full items-center gap-1 text-[var(--color-gray-700)]",
                        column.align === "center" && "justify-center text-center",
                        column.align === "right" && "justify-end text-right",
                      )}
                    >
                      <span>{column.header}</span>
                      <SortIcon direction={isSorted ? sortDirection : undefined} />
                    </button>
                  ) : (
                    <span
                      className={clsx(
                        "block w-full",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {column.header}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rowCount === 0 && (
            <tr>
              <td
                className="px-4 py-12 text-center text-sm text-[var(--color-gray-500)]"
                colSpan={columns.length + (canSelect ? 1 : 0)}
              >
                {emptyText}
              </td>
            </tr>
          )}

          {rows.map((row, index) => {
            const key = rowKey ? rowKey(row, index) : index;
            const isSelected = canSelect && selectedKeySet.has(key);
            const additionalRowClass = rowClassName?.(row, index) ?? "";
            const disableDefaultHover = /(?:^|\s)hover:/.test(additionalRowClass);
            return (
              <tr
                key={key}
                className={clsx(
                  "border-t border-[var(--color-gray-100)]",
                  isSelected
                    ? "bg-[var(--color-primary-10)]"
                    : disableDefaultHover
                      ? ""
                      : "hover:bg-[var(--color-gray-10)]",
                  additionalRowClass,
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row)}
              >
                {canSelect && (
                  <td className="px-4 py-3">
                    <label
                      className="flex h-6 w-6 cursor-pointer items-center justify-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={(event) => {
                          event.stopPropagation();
                          toggleRow(key);
                        }}
                        aria-label="행 선택"
                      />
                      {isSelected ? (
                        <CheckboxCheckedIcon className="h-6 w-6" aria-hidden />
                      ) : (
                        <CheckboxUncheckedIcon className="h-6 w-6" aria-hidden />
                      )}
                    </label>
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={clsx(
                      "px-4 py-3 align-middle text-sm text-[var(--color-gray-800)]",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.className,
                    )}
                  >
                    {column.render?.(row, index) ??
                      ((row as Record<string, unknown>)[String(column.key)] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
