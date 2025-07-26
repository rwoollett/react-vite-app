import { useState } from "react";
import { type ConfigColumn } from "../components/Table";

function useSort<T>(data:T[], config:ConfigColumn<T>[]) {
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const setSortColumn = (label: string) => {
    if (sortBy && sortBy !== label) {
      setSortOrder('asc');
      setSortBy(label);
      return;
    }

    if (sortOrder === null) {
      setSortOrder('asc');
      setSortBy(label);
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
      setSortBy(label);
    } else if (sortOrder === 'desc') {
      setSortOrder(null);
      setSortBy(null);
    }
  };

  let sortedData = data;
  if (sortOrder && sortBy) {
    const columnConfig = config.find(column => column.label === sortBy);
    if (columnConfig) {
      sortedData = [...data].sort((a: T, b: T): number => {
        if (!columnConfig) {
          return 0;
        }
        if (!columnConfig.sortValue) {
          return 0;
        }
        const valueA = columnConfig.sortValue(a);
        const valueB = columnConfig.sortValue(b);

        const reverseOrder = sortOrder === 'asc' ? 1 : -1;

        if (typeof valueA === 'string') {
          return valueA.localeCompare(valueB as string) * reverseOrder;
        } else {
          return (valueA - (valueB as number)) * reverseOrder;
        }
      });
    }
  }

  return {
    sortOrder,
    sortBy,
    sortedData,
    setSortColumn
  }
}

export default useSort;