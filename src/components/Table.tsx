import { Fragment, useEffect, useState, type JSX } from "react";
import { useLocation } from "react-router-dom";
import style from './Table.module.scss';
//import { RxCircle, RxCheckCircled } from 'react-icons/rx';
import Button from "./Button";
import className from 'classnames';

export interface ConfigColumn<T> {
  label: string;
  render: (item: T) => JSX.Element | string | number;
  header?: () => JSX.Element;
  sortValue?: (item: T) => string | number;
}

export const TABLE_VIEW = 'VIEW';
export const TABLE_EDIT = 'EDIT';

export interface ConfigEdit<T> {
  label: string;
  execute: (item: T) => void;
}

export interface ConfigAction {
  label: string;
  execute: () => void;
}

export interface ConfigTable<T> {
  columns: ConfigColumn<T>[];
  edit: ConfigEdit<T>[];
  action: ConfigAction[];
}

function Table<T>({ data, config, keyFn }: {
  data: T[];
  config: ConfigTable<T>,
  keyFn: (item: T) => string | number;
}) {

  const location = useLocation();
  const initialMode = location.state?.tableMode ?? TABLE_VIEW;

  const [tableMode, setTableMode] = useState(initialMode);
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);
  const [selectAll, setSelectedAll] = useState(false);
  const [selectIndex, setSelectIndex] = useState<{ [key: string | number]: boolean }>({});
  const selectedCount = Object.values(selectIndex).filter(Boolean).length;

  useEffect(() => {
    if (location.state?.tableMode) {
      setTableMode(location.state.tableMode);
      setEdit(location.state.tableMode === TABLE_EDIT);
    }
  }, [location.state]);

  useEffect(() => {
    setEditable(config.edit.length > 0);
    setEdit(tableMode === TABLE_EDIT);
    setSelectedAll(false);
    setSelectIndex({});
  }, [tableMode, config.edit]);

  useEffect(() => {
    if (selectedCount == 0) {
      setSelectedAll(false);
    } else if (selectedCount == Object.values(selectIndex).length) {
      setSelectedAll(true);
    }
  }, [selectIndex]);

  const handleSelectIndex = (index: string | number) => {
    if (edit) {
      setSelectIndex((prev) => {
        return {
          ...prev,
          [index]: !prev[index]
        };
      });
    }
  };

  const handleSelectAll = () => {
    const prevAll = selectAll;
    setSelectedAll((prevAll) => !prevAll);
    data.forEach((rowData) => {
      setSelectIndex((prev) => {
        return {
          ...prev,
          [keyFn(rowData)]: !prevAll
        };
      });
    });
  };


  const renderedHeader = config.columns.map((column) => {
    if (column.header) {
      return (
        <Fragment key={column.label}>{column.header()}</Fragment>
      );
    }
    return (
      <th key={column.label}>{column.label}</th>
    );
  });

  const editClasses = className({
    [style.editCell]: edit,
    [style.editCellPlaceholder]: true
  });

  const renderedRows = data.map((rowData) => {
    const renderedCells = config.columns.map((column: ConfigColumn<T>) => {
      return (
        <td key={column.label}>
          {column.render(rowData)}
        </td>
      );
    });

    const selector = <td key={`selector_${keyFn(rowData)}`} className={editClasses}>
      <div className={style.selectorContainer}>
        {edit && <input
          type="checkbox"
          checked={!!selectIndex[keyFn(rowData)]}
          onChange={() => handleSelectIndex(keyFn(rowData))}
        />}
        {edit && <i className={style.selectedCount}>&nbsp;</i>}
      </div>
    </td>

    const classes = className({
      [style.rowSelect]: !edit
    });

    return (
      <tr className={classes}
        key={keyFn(rowData)}>
        {selector}
        {renderedCells}
      </tr>
    );
  });

  const selectorAll = <th key={`selectorAll`} className={editClasses}>
    <div className={style.selectorContainer}>
      {edit && <input
        type="checkbox"
        checked={selectAll}
        onChange={() => handleSelectAll()}
      />}
      {edit && selectedCount > 0 && <i className={style.selectedCount}>{selectedCount}</i>}
      {edit && selectedCount == 0 && <i className={style.selectedCount}>&nbsp;</i>}
    </div>
  </th>;

  const handleEdit = () => {
    setTableMode(TABLE_EDIT);
  };

  const handleCancel = () => {
    setTableMode(TABLE_VIEW);
  };

  const renderEditCancelButton = edit === false
    ? <Button type="button" onClick={handleEdit} secondary outline>Edit</Button>
    : <></>

  const isSelectedEdit = Object.values(selectIndex)
    .reduce((prev, curr) => curr === true ? true : prev, false);

  const renderedEditable = config.edit.map((command) => {
    return (
      <div key={command.label}><Button type="button" onClick={() => {
        data.forEach((rowData) => {
          selectIndex[keyFn(rowData)] === true && command.execute(rowData);
        });
        setTableMode(TABLE_VIEW);
      }} secondary >{command.label} {selectedCount}</Button></div>
    );
  });

  const renderedAction = config.action.map((command) => {
    return (
      <div key={command.label}><Button type="button" onClick={() => {
        command.execute();
        setTableMode(TABLE_VIEW);
      }} secondary outline>{command.label}</Button></div>
    );
  });

  return (
    <div>
      <table className={style.tableLayout}>
        <colgroup>
          <col className={style.selectorColumn} />
          {config.columns.map((col) => (
            <col key={col.label} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {selectorAll}
            {renderedHeader}
            <th className={style.editButtonCell}>
              {editable && renderEditCancelButton}
            </th>
          </tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
      <div>
        {edit && (
          <div className={style.editFooter}>
            {/* <span>Selected: {selectedCount}</span> */}
            {isSelectedEdit && renderedEditable}
            {renderedAction}
            <Button type="button" onClick={handleCancel} secondary outline>Exit Edit</Button>
          </div>
        )}
      </div>
    </div>
  );

}

export default Table;