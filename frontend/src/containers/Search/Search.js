import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import SearchBox from '../../components/SearchBox';

export default () => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search).get('q');

  const updateSavedSearch = searchQuery => {
    history.push({
      pathname: location.pathname,
      search: `?${new URLSearchParams({ q: searchQuery }).toString()}`,
    });
  };

  return <SearchBox initialValue={query} searchComplete={updateSavedSearch} />;
};
