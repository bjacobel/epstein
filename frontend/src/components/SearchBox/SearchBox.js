import React, { useState } from 'react';

export default ({ initialValue, onClick }) => {
  const [searchQuery, updateSearchQuery] = useState(initialValue);

  const search = e => {
    e.preventDefault();
    onClick(searchQuery);
  };

  return (
    <form>
      <input
        placeholder="search"
        type="search"
        value={searchQuery || ''}
        onChange={e => updateSearchQuery(e.target.value)}
      />
      <button type="submit" onClick={search}>
        search
      </button>
    </form>
  );
};
