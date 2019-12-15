import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import {
  title,
  header,
  hotlinks,
  hotlink,
  mobileBurger,
  burgerLines,
  active,
  mobileHotlinks,
} from '../stylesheets/header.css';
import { blacklink } from '../stylesheets/link.css';

const MenuButton = ({ toggleMenu, menuActive }) => {
  return (
    <button type="button" className={mobileBurger} onClick={toggleMenu}>
      <span className={classNames(burgerLines, { [active]: menuActive })} />
    </button>
  );
};

export default () => {
  const [menuActive, toggleMenuActive] = useState(false);
  return (
    <nav className={header}>
      <h1 className={title}>
        <Link className={blacklink} to="/">
          epstein.flights
        </Link>
      </h1>
      <ul className={classNames(hotlinks, { [mobileHotlinks]: menuActive })}>
        <li className={hotlink}>
          <Link className={blacklink} to="/about">
            About
          </Link>
        </li>
        <li className={hotlink}>
          <Link className={blacklink} to="/search">
            Search
          </Link>
        </li>
      </ul>
      <MenuButton
        toggleMenu={() => toggleMenuActive(!menuActive)}
        menuActive={menuActive}
      />
    </nav>
  );
};
