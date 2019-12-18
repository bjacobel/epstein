import React, { useState } from 'react';
import classNames from 'classnames';

import Loading from '../Loading';
import { hidden } from '../../stylesheets/shared.css';
import { pageControl, controls, browser, pageCount } from './style.css';

export default ({ ids, totalAvailable, pageSize, fetchMore, browserComponent }) => {
  const pages = Math.ceil(totalAvailable / pageSize);

  const [page, setPage] = useState(0);
  const currentIds = ids.slice(pageSize * page, pageSize * (page + 1));

  const [doneMap, setDone] = useState(
    ids.reduce((prev, curr) => ({ ...prev, [curr]: false }), {}),
  );
  const allDone = currentIds.every(id => !!doneMap[id]);

  const decrementSet = () => {
    if (page === 0) return;
    setPage(page - 1);
  };
  const incrementSet = async () => {
    if (page + 1 === pages) return Promise.resolve();

    if (ids.length < pageSize * (page + 2)) {
      await fetchMore();
    }
    return Promise.resolve(setPage(page + 1));
  };

  if (!currentIds) return null;

  return (
    <div className={browser}>
      <div className={controls}>
        <button
          type="button"
          className={pageControl}
          onClick={decrementSet}
          aria-label="previous page of flights"
          aria-controls="detailsList"
          disabled={page === 0}
        >
          ◀ prev
        </button>
        <span className={pageCount}>{`${page + 1} / ${pages}`}</span>
        <button
          type="button"
          className={pageControl}
          onClick={incrementSet}
          aria-label="next page of flights"
          aria-controls="detailsList"
          disabled={page + 1 === pages}
        >
          next ▶
        </button>
      </div>
      <div className={classNames({ [hidden]: allDone })}>
        <Loading />
      </div>
      <div
        className={classNames({ [hidden]: !allDone })}
        role="region"
        id="detailsList"
        aria-live="polite"
      >
        {currentIds.map(id =>
          React.createElement(browserComponent, {
            id,
            key: id,
            done: () => setDone(done => ({ ...done, [id]: true })),
          }),
        )}
      </div>
    </div>
  );
};
