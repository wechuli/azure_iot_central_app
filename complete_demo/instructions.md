# Azure IoT Central PoC Demo

This is a demo to show how Azure IoT Hub and Azure IoT Central Services can be used to deliver an end-to-end IoT solution, from devices to visualization in IoT Central dashboard.

## What You'll need

- Azure account with a subscription
- A text editor
- Deployment code and files found in this folder

## Instructions

1

## Note
- Make use of the azure cli top create the devices
- Install the Azure Iot Hub Cli using - 
        
        az extension add --name azure-cli-iot-ext

        az iot hub device-identity create --hub-name {YourIoTHubName} --device-id MyNodeDevice

        az iot hub device-identity show-connection-string --hub-name iotcentralhub --device-id temp_humidity_sensor

