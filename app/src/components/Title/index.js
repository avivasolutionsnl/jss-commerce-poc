import React from 'react';
import { Text, withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const Title = (props) => (
  <h1 className='product__title'>
    <Text field={props.sitecoreContext.route.fields.Name} />
  </h1>
);

export default withSitecoreContext()(Title);
