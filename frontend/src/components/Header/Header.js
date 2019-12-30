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
} from './style.css';
import { blacklink } from '../../stylesheets/shared.css';

const MenuButton = ({ toggleMenu, menuActive }) => {
  return (
    <button
      type="button"
      aria-label="expand mobile menu"
      className={mobileBurger}
      onClick={toggleMenu}
    >
      <span className={classNames(burgerLines, { [active]: menuActive })} />
    </button>
  );
};

export default () => {
  const [menuActive, toggleMenuActive] = useState(false);
  const menuCloseOnClick = () => {
    if (menuActive) toggleMenuActive(false);
  };
  return (
    <nav className={header}>
      <h1 className={title}>
        <Link className={blacklink} to="/">
          epstein.flights
        </Link>
      </h1>
      <MenuButton
        toggleMenu={() => toggleMenuActive(!menuActive)}
        aria-haspopup="true"
        aria-controls="menu-list"
        aria-expanded={menuActive} // @TODO: aria-expanded should be false when css viewport is big
        menuActive={menuActive}
      />
      <ul className={classNames(hotlinks, { [mobileHotlinks]: menuActive })}>
        <li className={hotlink} tabIndex="-1">
          <Link className={blacklink} to="/about" onClick={menuCloseOnClick}>
            About
          </Link>
        </li>
        <li className={hotlink} tabIndex="-1">
          <Link className={blacklink} to="/search" onClick={menuCloseOnClick}>
            Search
          </Link>
        </li>
      </ul>
    </nav>
  );
};
