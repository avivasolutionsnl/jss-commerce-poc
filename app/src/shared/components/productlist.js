import React from 'react';
import ProductSummary from './productsummary';

const ProductList = ({products}) => {
    return <div className='productlist'>
        {products && products.map(product => <ProductSummary path={product.path} 
            productId={product.productId} 
            displayName={product.displayName} 
            description={product.description} 
            imageId={product.imageId} />)}
    </div>
}

export default ProductList;