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

const CategoryNavigation = (props) => (
  <nav className='categorynavigation'>
    <ul>
      {props.fields.categories.map(c => <CategoryNavItem {...c} />)}
    </ul>
  </nav>
);

export default CategoryNavigation;
