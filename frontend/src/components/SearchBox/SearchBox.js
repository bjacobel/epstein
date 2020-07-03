import React, { useState } from 'react';

import { form, input, button, errorText } from './style.css';

export default ({ initialValue, onClick }) => {
  const [searchQuery, updateSearchQuery] = useState(initialValue);
  const [validationError, setValidationError] = useState();

  const search = e => {
    e.preventDefault();
    if (!searchQuery || searchQuery.length < 1) {
      setValidationError('Search query is required.');
      return;
    }
    onClick(searchQuery);
  };

  return (
    <>
      <form className={form}>
        <input
          className={input}
          placeholder="passenger name"
          type="search"
          value={searchQuery || ''}
          onChange={e => updateSearchQuery(e.target.value)}
        />
        <button className={button} type="submit" onClick={search}>
          search
        </button>
      </form>
      <div className={errorText}>
        <p>{validationError}</p>
      </div>
    </>
  );
};
