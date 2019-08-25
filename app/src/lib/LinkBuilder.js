import {jssAppName, sitecoreApiHost} from '../temp/config';

function fromPath(path) {
    const appPath = `/sitecore/content/${jssAppName}/home`;

    return path.replace(appPath, '');
}

/*
A hack to get the image url from the image id. Normally the json serializer returns 
the image url in the props, when it is a Image field. In the commerce connect case
it is a TreeList pointing to images. The MultilistFieldSerializer only returns the 
fields of the related images and not the URL's. Probably we should extend JSS
on the server side to include the image url.
*/
function fromImageId(id) {
  const idWithoutDashes = id.replace(/-/g, "");
  return `${sitecoreApiHost}/~/media/${idWithoutDashes}.ashx`;
}

export {fromPath, fromImageId}