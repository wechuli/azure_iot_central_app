# Azure IoT Central PoC Demo

This is a demo to show how Azure IoT Hub and Azure IoT Central Services can be used to deliver an end-to-end IoT solution, from devices to visualization in IoT Central dashboard.

## Overview of What We'll build

We will build a simple and common IoT flow, where we have we have a device, it securely connects to an endpoint in the cloud and sends its telemetry. We will then process this telemetry and store the data in a database. Finally, we will visualize the transformed telemetry information for business for business intelligence.

## What You'll need

- Azure account with a subscription
- A text editor
- Deployment code and files found in this folder
- Basic knowledge of any programming language

## Instructions

1

## Note
- Make use of the azure cli top create the devices
- Install the Azure Iot Hub Cli using - 
        
        az extension add --name azure-cli-iot-ext

        az iot hub device-identity create --hub-name {YourIoTHubName} --device-id MyNodeDevice

        az iot hub device-identity show-connection-string --hub-name iotcentralhub --device-id temp_humidity_sensor

