Write-Host -ForegroundColor Yellow "Stopping Containers"

docker-compose -f docker-compose.yml -f docker-compose.build.yml down

Write-Host -ForegroundColor Yellow "Starting Containers"

docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d

Write-Host -ForegroundColor Yellow "Installing packages"

docker exec jss-commerce_sitecore_1 powershell c:\sitecore\Install-packages.ps1

Write-Host -ForegroundColor Yellow "Persisting databases"

docker-compose -f docker-compose.yml -f docker-compose.build.yml stop 

docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d mssql

Start-Sleep -Milliseconds 10000

docker exec jss-commerce_mssql_1 powershell c:\Persist-Databases.ps1

docker-compose -f docker-compose.yml -f docker-compose.build.yml stop 

Write-Host -ForegroundColor Yellow "Committing images"

docker commit jss-commerce_mssql_1 avivasolutionsnl.azurecr.io/jss-commerce-mssql:9.1-20190822
docker commit jss-commerce_sitecore_1 avivasolutionsnl.azurecr.io/jss-commerce-sitecore:9.1-20190822