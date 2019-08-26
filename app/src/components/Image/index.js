import React from 'react';
import { fromImageId } from '../../lib/LinkBuilder';
import { Image, withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

const DefaultProductImage = (props) => {

  const image = props.sitecoreContext.route.fields.Images.length > 0 && props.sitecoreContext.route.fields.Images[0];

  if(!image) {
    return null;
  }

  const url = fromImageId(image.id)
  const alt = image.fields.Alt.value;
  const field = {value:{src: url, alt: alt}};

  return <Image className='product__image' media={field} />
}

export default withSitecoreContext()(DefaultProductImage);
