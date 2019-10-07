# JSS-Commerce
Proof of concept for using JSS with Commerce.

## Prerequisites
- Windows 10 update 1809
- Docker for Windows version >= 18.09.1
- Visual Studio 15.5.3
- Node > 10.0.0

## Getting Started
- Open a console en navigate to the repository root folder.

- Build the project in Visual Studio and publish the projects to the \build folder

- Copy your Sitecore license file (license.xml) to the .\license folder

- Login in to the Docker repository using your Aviva credentials:
```
PS> az acr login --name avivasolutionsnl
```

- Spin up the environment, make sure you are using windows and not linux containers:
```
PS> docker-compose up
```

To set the Docker container service names as DNS names on your host edit your `hosts` file. 
A convenient tool to automatically do this is [whales-names](https://github.com/gregolsky/whales-names).

Synchronize the development content by running Unicorn: [http://sitecore/unicorn.aspx?verb=sync](http://sitecore/unicorn.aspx?verb=sync).

- Install the JSS CLI

`npm install -g @sitecore-jss/sitecore-jss-cli`

- Deploy the JSS app by opening a console in the app folder and running:
    - `NPM install`
    - `jss deploy config`
    - `jss deploy files`

> The JSS content is already deployed by Unicorn

## API Gateway
The API Gateway provides anonymous users a JWT which can be used to access Cart functionalities.

Run the API Gateway from the `server/Gateway` folder:

```
PS> dotnet watch run
```

## Build docker images
- Add the Habitat images package to the `.\files` folder
- Run the docker script `.\Build-docker-images.ps1 ` 
- Publish the docker images, for example:

docker push avivasolutionsnl.azurecr.io/jss-commerce-sitecore:9.1.0-20190528
docker push avivasolutionsnl.azurecr.io/jss-commerce-mssql:9.1.0-20190528
```

## Headless SSR mode
To use the [Headless mode](https://jss.sitecore.com/docs/techniques/ssr/headless-mode-ssr), build the application:
```
PS app> jss build
```

Next copy the build artefacts to a `dist` directory:
```
PS app> cp -R build/* dist/app/
```

The `dist/app` directory is configured as `sitecoreDistPath` and in `headless-ssr-proxy.js` and `headless-ssr-proxy-config.js`.

Next you can run the SSR proxy using:
```
PS app> npm run start:headless
```

This will start an [Express JS](https://expressjs.com/) server as reverse-proxy.

You can now navigate to http://localhost:3000 to visit the site.

More details about the various deployment modes you can find [here](https://www.youtube.com/watch?v=YUBpmZMi7R4).
