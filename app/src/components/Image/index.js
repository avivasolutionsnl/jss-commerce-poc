import React from 'react';
import config from '../../temp/config';
import { Image, withSitecoreContext } from '@sitecore-jss/sitecore-jss-react';

/*
A hack to get the image url from the image id. Normally the json serializer returns 
the image url in the props, when it is a Image field. In the commerce connect case
it is a TreeList pointing to images. The MultilistFieldSerializer only returns the 
fields of the related images and not the URL's. Probably we should extend JSS
on the server side to include the image url.
*/
function getImageUrlFromId(id) {
  const idWithoutDashes = id.replace(/-/g, "");
  return `${config.sitecoreApiHost}/~/media/${idWithoutDashes}.ashx`;
}

const ProductImage = (props) => {
  const images = props.sitecoreContext.route.fields.Images;

  if(!images || images.length == 0) {
    return null;
  }

  const url = getImageUrlFromId(images[0].id)
  const alt = images[0].fields.Alt.value;
  const field = {value:{src: url, alt: alt}};
      
  return <div className='product__image'><Image media={field} /></div>
};

export default withSitecoreContext()(ProductImage);
