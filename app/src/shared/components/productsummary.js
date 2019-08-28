import React from 'react';
import {fromPath} from '../../lib/LinkBuilder';
import { Image } from '@sitecore-jss/sitecore-jss-react';
import { fromImageId } from '../../lib/LinkBuilder';
import useLivePrice from '../useLivePrice';
import Price from './price';
import { NavLink } from 'react-router-dom';
import AddToCartButton from './addtocart';

const Description = ({description}) => {

    function Truncate(value, length) {
        if(value.length <= length) {
            return value;
        }
        
        var trimmedString = value.substr(0, length);
        
        //re-trim if we are in the middle of a word
        return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "...";
    }

    const trimmedDescription = Truncate(description, 220);

    return <span className='productsummary__description'>{trimmedDescription}</span>
}

const ProductImage = ({imageId}) => {
    const imageUrl = fromImageId(imageId);
    return <Image className='productsummary__image' media={{src: imageUrl}} width={200} height={200} />
}

const ProductPrice = ({productId}) => {
    const {currencyCode, amount} = useLivePrice(productId);
    return <Price currencyCode={currencyCode} amount={amount} /> 
}

const Title = ({path, displayName}) => {
    const url = fromPath(path);
    return <span className='productsummary__name'>
        <NavLink to={url}>{displayName}</NavLink>
    </span>
}

const ProductSummary = ({path, displayName, description, imageId, productId, variantId}) => {
    return <article className='productsummary'>
      <Title path={path} displayName={displayName} />
      <Description description={description} />
      <ProductImage imageId={imageId}/>
      <ProductPrice productId={productId} /> 
      <AddToCartButton productId={productId} variantId={variantId} /> 
    </article>
}

export default ProductSummary;