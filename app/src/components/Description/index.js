import React from 'react';
import { Text, withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const Description = (props) => {
  return <Text className='product__description' field={props.sitecoreContext.route.fields.Description} />
};

export default withSitecoreContext()(Description);
