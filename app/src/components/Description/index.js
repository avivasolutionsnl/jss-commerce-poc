import React from 'react';
import { Text, withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const Description = (props) => (
  <div className='product__description'>
    <Text field={props.sitecoreContext.route.fields.Description} />
  </div>
);

export default withSitecoreContext()(Description);
