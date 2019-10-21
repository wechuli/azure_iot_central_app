# Azure IoT Central PoC Demo

This is a demo to show how Azure IoT Hub and Azure IoT Central Services can be used to deliver an end-to-end IoT solution, from devices to visualization in IoT Central dashboard.

## Overview of What We'll build

We will build a simple and common IoT flow, where we have a device (which we will simulate), it securely connects to an endpoint in the cloud and sends its telemetry. We will then process this telemetry and store the data in a database. Finally, we will visualize the transformed telemetry information for business intelligence.

To put the solution together, we will make use the following Azure services:

- **Azure IoT Hub** - IoT Hub is a managed service, hosted in the cloud, that acts as a central message hub for bi-directional communication between your IoT application and the devices it manages.
- **Azure IoT Central** - Azure IoT Central is a fully managed SaaS (software-as-a-service) solution that makes it easy to connect, monitor and manage your IoT assets at scale.
- **Azure Functions** - Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure.
- **Azure Cosmos DB** - Azure Cosmos DB is Microsoft’s globally distributed, multi-model database service for operational and analytics workloads. It offers multi-mastering feature by automatically scaling throughput, compute, and storage.

## What You'll need

- Azure account with a subscription
- A text editor
- Deployment code and files found in this folder
- Basic knowledge of any programming language

## Instructions

1.  We are going to use Azure CLI to deploy some of the resources.The Azure command-line interface (CLI) is Microsoft's cross-platform command-line experience for managing Azure resources. Head over to https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest and download the latest version of the Azure CLI appropriate for your operating system.
2.  After installing the Azure CLI, run

            $ az login

    This will log you in to the approriate azure account you want to use.

## Note

- Make use of the azure cli top create the devices
- Install the Azure Iot Hub Cli using -

  az extension add --name azure-cli-iot-ext

        az iot hub device-identity create --hub-name {YourIoTHubName} --device-id MyNodeDevice

        az iot hub device-identity show-connection-string --hub-name iotcentralhub --device-id temp_humidity_sensor
