import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import styles from './style.css';
import { center, roboto, link } from '../../stylesheets/shared.css';

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <h1 className={styles['not-found']}>404: page not found</h1>
        <Link className={classnames(center, link, roboto)} to="/">
          Home
        </Link>
      </div>
    );
  }
}
