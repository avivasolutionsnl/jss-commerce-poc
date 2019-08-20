import React from 'react';
import { withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const Price = (props) => (
  <div className='product-price'>
    <div className='currency'>
      {props.fields.listprice.currency}
    </div>  
    <div className='price'>
      {props.fields.listprice.value}
    </div>
  </div>
);

export default withSitecoreContext()(Price);
