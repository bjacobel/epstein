import React from 'react';

export default ({ fetchMore, offset, updateQuery }) => {
  return (
    <button
      type="button"
      onClick={() =>
        fetchMore({
          variables: { offset },
          updateQuery,
        })
      }
    >
      Fetch More
    </button>
  );
};
