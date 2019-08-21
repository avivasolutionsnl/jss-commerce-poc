import fetch from 'node-fetch';
import React, {useContext, useEffect, useState} from 'react';
import { withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';
import { gatewayUrl } from '../../temp/config';

const Price = (props) => {

  const catalogId = 'Habitat_Master';
  const productId = props.sitecoreContext.route.fields.ProductId.value;

  const [productData, setProductData] = useState();

  useEffect(() => {
    async function fetchData() {
      fetch(`${gatewayUrl}/api/catalog/${catalogId}/sellableitems/${productId}`)
        .then(res => res.json())
        .then(data => setProductData(data))
    }

    fetchData();
  }, []);

  return (
    <div className='product-price'>
      <span className='currency'>
        {productData && productData.ListPrice && productData.ListPrice.CurrencyCode}
      </span>  
      <span className='price'>
        {productData && productData.ListPrice && productData.ListPrice.Amount}
      </span>
    </div>
  );
};

export default withSitecoreContext()(Price);
