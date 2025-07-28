import React, { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import style from "./SearchBar.module.scss";

function SearchBar({ onSubmit }: { onSubmit: (term: string) => Promise<void> }) {
  const [term, setTerm] = useState('');

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(term);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  return (
    <div className={`${style.searchBar}`}>
      <form onSubmit={handleFormSubmit}>
        <label>Enter Search Term</label>
        <input type='text' name=  'image search' value={term} onChange={handleChange}/>
      </form>
    </div>
  );
}

export default SearchBar;
