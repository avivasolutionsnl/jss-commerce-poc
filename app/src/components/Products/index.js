import React from 'react';
import ProductList from '../../shared/components/productlist';
import { loader as gqlLoader } from 'graphql.macro';
import GraphQLData from '../../lib/GraphQLData';

const GetProductsQuery = gqlLoader('./query.graphql');

const ProductCluster = ({title, children}) => {
  return <div className='productcluster'>
    <h1 className='productcluster__title'>{title}</h1>
    {children}
  </div>
}

const Products = (props) => {
  // Retrieve products from resolved datasource
  if (props.fields.products) {
    return <ProductCluster title={props.fields.heading}>
      {<ProductList products={props.fields.products}/>}
    </ProductCluster>
  }

  // Retrieve product using GraphQL
  const graphQLResult = props.getProductsQuery;

  const { error, loading } = graphQLResult;

  // Query results load in using the name of their root field (see query.graphql)
  const { item } = graphQLResult;

  const products = item && item.children && item.children.map(p => ({
    path: p.path,
    productId: p.productId.value,
    displayName: p.displayName,
    description: p.description.value,
    imageId: p.images.value,
    variantId: p.children.length > 0 ? p.children[0].name : ''
  }));

  return <ProductCluster>
    {loading && <p className="alert alert-info">Loading products...</p>}
    {error && <p className="alert alert-danger">Error while loading products: {error.toString()}</p>}

    {products && <ProductList products={products}/>}
  </ProductCluster>
};

export default GraphQLData(GetProductsQuery, { name: 'getProductsQuery' })(Products);
