$filesPath = "/files-mount"

# Use Commerce SIF modules to install packages
[Environment]::SetEnvironmentVariable('PSModulePath', $env:PSModulePath + ';' + "$env:INSTALL_TEMP/Modules");

Install-SitecoreConfiguration -Path '/sitecore/install-packages.json' `
    -HabitatImagesPackageFullPath "$filesPath/Sitecore.Commerce.Habitat.Images-1.0.0.zip" 