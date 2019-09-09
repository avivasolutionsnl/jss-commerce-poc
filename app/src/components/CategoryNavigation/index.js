import React from 'react';
import {fromPath} from '../../lib/LinkBuilder';
import { NavLink } from 'react-router-dom';

const CategoryNavItem = ({path, displayName, active}) => {
  const url = fromPath(path);

  let classNames = ['categorynavigation__navitem'];
  
  if(active) {
    classNames.push('active');
  }

  return <li className={classNames}><NavLink to={url}>{displayName}</NavLink></li>;
} 

const CategoryNavigation = ({fields}) => {
  const items = fields.categories ? fields.categories.map((c, i) => <CategoryNavItem key={i} {...c} />) : null;

  return (
    <nav className='categorynavigation'>
      <ul>
        {items}
      </ul>
    </nav>
  );
};

export default CategoryNavigation;
