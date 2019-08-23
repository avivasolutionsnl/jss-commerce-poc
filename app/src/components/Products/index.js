import React from 'react';
import {ProductImage} from '../Image';
import {Price} from '../Price';
import { loader as gqlLoader } from 'graphql.macro';
import GraphQLData from '../../lib/GraphQLData';
import {fromPath} from '../../lib/LinkBuilder';

const GetProductsQuery = gqlLoader('./query.graphql');

function Truncate(value, length) {
  if(value.length <= length) {
    return value;
  }

  var trimmedString = value.substr(0, length);

  //re-trim if we are in the middle of a word
  return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "...";
}

const Product = (props) => {
  const description = Truncate(props.description.value, 220);
  const url = fromPath(props.path);

  return <article className='productcluster__product'>
    <span className='productcluster__product__name'>
      <a href={url}>{props.displayName}</a>
    </span>
    <span className='productcluster__product__description'>{description}</span>
    <ProductImage imageId={props.images.value} className='productcluster__product__image' width={200} height={200} />
    <Price productId={props.productId.value} /> 
  </article>
}

const Products = (props) => {
  const graphQLResult = props.getProductsQuery;

  const { error, loading } = graphQLResult;

  // Query results load in using the name of their root field (see query.graphql)
  const { item } = graphQLResult;

  return <div className='productcluster'>
    {loading && <p className="alert alert-info">Loading products...</p>}
    {error && <p className="alert alert-danger">Error while loading products: {error.toString()}</p>}

    {item && item.children && item.children.map(p => <Product {...p} />)}
  </div>
};

export default GraphQLData(GetProductsQuery, { name: 'getProductsQuery' })(Products);;
