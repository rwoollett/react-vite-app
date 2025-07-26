import { Fragment, useEffect, useState, type JSX } from "react";
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

  const [tableMode, setTableMode] = useState(TABLE_VIEW);
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);
  const [selectAll, setSelectedAll] = useState(false);
  const [selectIndex, setSelectIndex] = useState<{ [key: string | number]: boolean }>({});

  useEffect(() => {
    setEditable(config.edit.length > 0);
    setEdit(tableMode === TABLE_EDIT);
    setSelectedAll(false);
    setSelectIndex({});
  }, [tableMode, config.edit]);

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
    [style.editCell]: edit
  });

  const renderedRows = data.map((rowData) => {
    const renderedCells = config.columns.map((column: ConfigColumn<T>) => {
      return (
        <td key={column.label}>
          {column.render(rowData)}
        </td>
      );
    });

    const selector = <td key={`selector_${keyFn(rowData)}`}
      className={editClasses}>
      <div>
        {!selectIndex[keyFn(rowData)] && <Button onClick={() => handleSelectIndex(keyFn(rowData))} className={style.control}>+</Button>}
        {selectIndex[keyFn(rowData)] && <Button onClick={() => handleSelectIndex(keyFn(rowData))} className={style.control}>-</Button>}
      </div>
    </td>;

    const classes = className({
      [style.editRowSelect]: edit
    });

    return (
      <tr className={classes}
        onClick={() => handleSelectIndex(keyFn(rowData))}
        key={keyFn(rowData)}>
        {edit && selector}{renderedCells}
      </tr>
    );
  });

  const selectorAll = <th key={`selectorAll`}
    className={editClasses}>
    <div>
      {!selectAll && <Button onClick={handleSelectAll} className={style.control}>+</Button>}
      {selectAll && <Button onClick={handleSelectAll} className={style.control}>-</Button>}
    </div>
  </th>;

  const handleEdit = () => {
    setTableMode(TABLE_EDIT);
  };

  const handleCancel = () => {
    setTableMode(TABLE_VIEW);
  };

  const renderEditCancelButton = edit === false
    ? <Button onClick={handleEdit} secondary outline>Edit</Button>
    : <Button onClick={handleCancel} primary>Cancel</Button>;

  const isSelectedEdit = Object.values(selectIndex)
    .reduce((prev, curr) => curr === true ? true : prev, false);

  const renderedEditable = config.edit.map((command) => {
    return (
      <td key={command.label}><Button onClick={() => {
        data.forEach((rowData) => {
          selectIndex[keyFn(rowData)] === true && command.execute(rowData);
        });
        setTableMode(TABLE_VIEW);
      }} primary outline>{command.label}</Button></td>
    );
  });

  const renderedAction = config.action.map((command) => {
    return (
      <td key={command.label}><Button onClick={() => {
        command.execute();
        setTableMode(TABLE_VIEW);
      }} primary outline>{command.label}</Button></td>
    );
  });

  return (
    <div>
      <div>
        {editable && renderEditCancelButton}
      </div>
      <table className={style.tableLayout}>
        <thead>
          <tr>{edit && selectorAll}{renderedHeader}</tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
      <div>
        {edit && <table><tbody><tr>{renderedAction}<td/>{isSelectedEdit && renderedEditable}</tr></tbody></table>}
      </div>
    </div>
  );

}

export default Table;