import React from 'react';
import { withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';
import AddToCartButton from '../../shared/components/addtocart';
import { loader as gqlLoader } from 'graphql.macro';
import GraphQLData from '../../lib/GraphQLData';

const GetVariantIdQuery = gqlLoader('./query.graphql');

const AddToCart = (props) => {
  const graphQLResult = props.getVariantIdQuery;

  const { item } = graphQLResult;

  const productId = props.sitecoreContext.route.fields.ProductId.value;
  const variantId = (item && item.children && item.children.length > 0) ? item.children[0].name : null;

  if(!variantId) {
    return null;
  }

  return <AddToCartButton productId={productId} variantId={variantId} />
};

export default GraphQLData(GetVariantIdQuery, { name: 'getVariantIdQuery' })(withSitecoreContext()(AddToCart));
