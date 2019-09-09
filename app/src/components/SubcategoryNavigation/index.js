import React from 'react';
import {fromPath} from '../../lib/LinkBuilder';
import { NavLink } from 'react-router-dom';

const SubCategoryNavItem = ({path, displayName, active}) => {
  const url = fromPath(path);

  let classNames = ['subcategorynavigation__navitem'];
  
  if(active) {
    classNames.push('active');
  }

  return <li className={classNames}><NavLink to={url}>{displayName}</NavLink></li>;
} 

const SubcategoryNavigation = (props) => (
  <nav className='subcategorynavigation'>
    <ul>
      {props.fields.categories.map((c, i) => <SubCategoryNavItem key={i} {...c} />)}
    </ul>
  </nav>
);

export default SubcategoryNavigation;
