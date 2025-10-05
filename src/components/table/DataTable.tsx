"use client";
import React from "react";

export type Column<T> = {
  key: keyof T | string;                 // 데이터 키
  header: string;                        // 헤더 라벨
  width?: string;                        // w-24, w-[80px] 등
  align?: "left" | "center" | "right";
  render?: (row: T, idx: number) => React.ReactNode; // 사용자 렌더
  className?: string;                    // td 커스텀 클래스
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey?: (row: T, idx: number) => React.Key;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T, idx: number) => string;       // 강조행 등
  emptyText?: string;
};

export function DataTable<T>({
  columns, rows, rowKey, onRowClick, rowClassName, emptyText = "데이터가 없습니다.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className={[
                    "px-4 py-3 border-b border-[var(--color-gray-100)] font-medium",
                    c.width ?? "",
                    c.align === "center" ? "text-center" : "",
                    c.align === "right" ? "text-right" : "",
                    ].join(" ")}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr className="border-b border-b-[var(--color-gray-200)]">
              <td className="pl-0 px-4 py-8  text-center text-[var(--color-gray-600)]" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}

          {rows.map((row, i) => {
            const key = rowKey ? rowKey(row, i) : i;
            const rcn = rowClassName?.(row, i) ?? "";
            const hasHover = /(?:^|\s)hover:/.test(rcn);
            return (
              <tr
                key={key}
                className={[
                  hasHover ? "" : "hover:bg-[var(--color-gray-10)]",
                  rcn,
                  onRowClick ? "cursor-pointer" : "",
                ].join(" ")}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className={[
                        "px-4 py-3 align-middle border-b border-[var(--color-gray-100)]",
                        c.width ?? "",
                        c.align === "center" ? "text-center" : "",
                        c.align === "right" ? "text-right" : "",
                        c.className ?? "",
                        ].join(" ")}
                  >
                    {c.render
                      ? c.render(row, i)
                      : ((row as Record<string, unknown>)[String(c.key)] as React.ReactNode)}
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
