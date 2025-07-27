import { useEffect, useRef, type HTMLAttributes, useState } from "react";
//import { GoChevronDown, GoChevronLeft } from 'react-icons/go';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Dropdown.module.scss'
import Button from "./Button";

export interface Option {
  label: string;
  value: string;
}

function Dropdown(
  { value, onChange, options, ...rest }:
    Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
      value: Option | null;
      onChange: Function;
      options: Option[];
    }) {
  const [isOpen, setIsOpen] = useState(false);
  const divEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!divEl.current) {
        return;
      }

      if (!divEl.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handler, true);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  }

  const renderedOptions = options.map((option) => {
    let active = "";
    if (value?.label === option.label) {
      active = "is-active ";
    }
    return (
      <div className={`dropdown-item is-size-6 ${styles.selectItem} ${active} `}
        onClick={() => handleOptionClick(option)}
        key={option.value}>
        {option.label}
      </div>
    )
  });

  const icon = <span className="is-size-5">
    {/* {isOpen ? <i className="fas fa-angle-down" aria-hidden="true"></i> : <i className="fas fa-angle-down" aria-hidden="true"></i>} */}
    {isOpen ? 'v' : '<'}
  </span>

  return (
    <div ref={divEl} {...rest} className="dropdown is-active" >
      <div className="dropdown-trigger">
        <Button type="button" success className="pt-1 pb-0">
          <div
            className={`columns is-mobile`}
            onClick={() => setIsOpen((current) => !current)}
          >
            <div className="column">{value?.label || 'Select... '}</div>
            <div className="column is-narrow"><span className="icon">{icon}</span></div>
          </div>
        </Button>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            {renderedOptions}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;