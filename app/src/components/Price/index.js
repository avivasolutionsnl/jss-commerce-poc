import fetch from 'node-fetch';
import React, { useEffect, useState} from 'react';
import { withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';
import { gatewayUrl, productCatalog } from '../../temp/config';

const Price = ({productId}) => {
  const [productData, setProductData] = useState();

  useEffect(() => {
    async function fetchData() {
      fetch(`${gatewayUrl}/api/catalog/${productCatalog}/sellableitems/${productId}`)
        .then(res => res.json())
        .then(data => setProductData(data))
    }

    fetchData();
  }, []);

  return (
    <div className='product__price'>
      <span className='product__price__currency'>
        {productData && productData.ListPrice && productData.ListPrice.CurrencyCode}
      </span>  
      <span className='product__price__price'>
        {productData && productData.ListPrice && productData.ListPrice.Amount}
      </span>
    </div>
  );
};

export {Price};

const DefaultPrice = (props) => {
  return <Price productId={props.sitecoreContext.route.fields.ProductId.value} />
}

export default withSitecoreContext()(DefaultPrice);
