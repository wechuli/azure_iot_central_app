## De

## Note
- Make use of the azure cli top create the devices
- Install the Azure Iot Hub Cli using - 
        
        az extension add --name azure-cli-iot-ext

        az iot hub device-identity create --hub-name {YourIoTHubName} --device-id MyNodeDevice

        az iot hub device-identity show-connection-string --hub-name iotcentralhub --device-id temp_humidity_sensor

