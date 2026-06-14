import Table, { type ConfigTable } from "./Table";
//import { GoArrowUp, GoArrowDown } from "react-icons/go";
import useSort from "../hooks/use-sort";
import style from './SortableTable.module.scss';
//
function SortableTable<T>(props: {
  data: T[];
  config: ConfigTable<T>,
  keyFn: (item: T) => string | number;
}) {
  const { config, data } = props;
  const { sortOrder, sortBy, sortedData, setSortColumn } = useSort(data, config.columns);

  const updateConfig = config.columns.map((column) => {
    if (!column.sortValue) {
      return column;
    }

    return {
      ...column,
      header: () => (
        <th
          className={`${style.sortableHeader} ${sortBy === column.label ? style.sortableHeaderActive : ""}`}
          onClick={() => setSortColumn(column.label)}
        >
          <div className={style.control}>
            <span className={style.columnName}>{column.label}</span>
            {getIcon(column.label, sortBy, sortOrder)}
          </div>
        </th>
      ),
    };
  });

  const newConfig = {
    ...config,
    columns: updateConfig
  };

  return <Table {...props} data={sortedData} config={newConfig} />;

}

const SvgUp = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    style={{ display: "block" }}
  >
    <path d="M5 2 L2 6 H8 Z" fill="currentColor" />
  </svg>
);

const SvgDown = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    style={{ display: "block" }}
  >
    <path d="M5 8 L2 4 H8 Z" fill="currentColor" />
  </svg>
);

function getIcon(label: string, sortBy: string | null, sortOrder: string | null) {
  // Not sorted on this column
  if (label !== sortBy || sortOrder === null) {
    return (
      <div className={style.arrowContainer}>
        <SvgUp />
        <SvgDown />
      </div>
    );
  }

  // Sorted ascending
  if (sortOrder === "asc") {
    return (
      <div className={style.arrowContainer}>
        <SvgUp />
      </div>
    );
  }

  // Sorted descending
  return (
    <div className={style.arrowContainer}>
      <SvgDown />
    </div>
  );
}

export default SortableTable;