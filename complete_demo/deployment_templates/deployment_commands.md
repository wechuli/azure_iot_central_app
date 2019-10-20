## Create a Resource Group and Choose a Region
az group create --name ExampleGroup --location "East US"

## Deploy both templates using the filled in parameters

az group deployment create --name ExampleDeployment --resource-group ExampleGroup --template-file template.json --parameters parameters.json

## Create an IoT Central application

az iotcentral app create --resource-group "ExampleGroup" --name "myiotcentralapp67ramds" --subdomain "csubdoird256" --sku S1 --template "b922fba8-b44c-46e9-8e1f-c44b95bac98a" --display-name "HumidityandTempSensor"

## Delete Resource Group

az group delete --name ExampleGroup