import React from 'react';
import { useHistory } from 'react-router';

import SearchBox from '../../components/SearchBox';
import { container, heroCopy } from './style.css';

export default () => {
  const history = useHistory();

  return (
    <div className={container}>
      <p className={heroCopy}>{projectConfig.Description}</p>
      <SearchBox onClick={searchTerm => history.push(`/search/${searchTerm}`)} />
    </div>
  );
};
