import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import styles from '../stylesheets/notFound.css';
import { link } from '../stylesheets/link.css';
import { center, roboto } from '../stylesheets/shared.css';

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
