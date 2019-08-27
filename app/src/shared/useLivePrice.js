import { useState, useEffect } from 'react';
import { gatewayUrl, productCatalog } from '../temp/config';

function useLivePrice(productId) {
    const [productData, setProductData] = useState();

    useEffect(() => {
      async function fetchData() {
        fetch(`${gatewayUrl}/api/catalog/${productCatalog}/sellableitems/${productId}`)
          .then(res => res.json())
          .then(data => setProductData(data))
      }
  
      fetchData();
    }, []);

    if(!productData) {
      return {};
    }

    return { 
        currencyCode: productData.ListPrice.CurrencyCode,  
        amount: productData.ListPrice.Amount
    };
}

export default useLivePrice;