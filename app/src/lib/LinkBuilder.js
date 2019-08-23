import {jssAppName} from '../temp/config';

const fromPath = path => {
    const appPath = `/sitecore/content/${jssAppName}/home`;

    return path.replace(appPath, '');
}

export {fromPath}