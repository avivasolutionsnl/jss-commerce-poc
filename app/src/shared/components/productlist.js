import React from 'react';
import ProductSummary from './productsummary';

const ProductList = ({products}) => {
    return <div className='productlist'>
        {products && products.map(product => <ProductSummary {...product} />)}
    </div>
}

export default ProductList;