import React from 'react';
import { withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';
import useLivePrice from '../../shared/useLivePrice';
import Price from '../../shared/components/price';

const ProductPrice = (props) => {
  const {currencyCode, amount} = useLivePrice(props.sitecoreContext.route.fields.ProductId.value);

  return <Price currencyCode={currencyCode} amount={amount} />
}

export default withSitecoreContext()(ProductPrice);
