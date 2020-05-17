import React, { useState } from 'react';

import { form, input, button } from './style.css';

export default ({ initialValue, onClick }) => {
  const [searchQuery, updateSearchQuery] = useState(initialValue);

  const search = e => {
    e.preventDefault();
    onClick(searchQuery);
  };

  return (
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
  );
};
