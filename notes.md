## Defining a New Device Type

You can use a device template to define a new type of device in your Microsoft Azure IoT Central Application. A device template defines the telemetry, state, properties, and settings for your device type.

### references

- https://docs.microsoft.com/en-us/azure/iot-central/tutorial-define-device-type
- https://docs.microsoft.com/en-us/azure/iot-central/howto-set-up-template

## Add a Real Device

You can configure a real device to your Microsoft Azure IoT Central application. This should be after configuring a new device type (template) as shown from above

### references

- https://docs.microsoft.com/en-us/azure/iot-central/tutorial-add-device
- https://docs.microsoft.com/en-us/azure/iot-central/howto-connect-nodejs  - includes example of how to use the state.

## How to Trigger Azure Functions Using Webhook

- We can trigger an Azure Function using a web hook from the IoT Central Dashboard using a Trigger

### references

- https://docs.microsoft.com/en-us/azure/iot-central/howto-trigger-azure-functions

## Create a template from Custom File

You can also create your own application templates from existing IoT Central applications. You can then use your own application templates when you create new applications.

When you create an application template, it includes the following items from your existing application:

- The default application dashboard, including the dashboard layout and all the tiles you've defined.
- Device templates, including measurements, settings, properties, commands, and dashboard.
- Rules. All rule definitions are included. However actions, except for email actions, aren't included.
- Device sets, including their conditions and dashboards.

When you create an application template, it doesn't include the following items:

- Devices
- Users
- Job definitions
- Continuous data export definitions

### references

- https://docs.microsoft.com/en-us/azure/iot-central/howto-use-app-templates

## Device Group with Azure IoT Central Application

An operator can use device groups in the Azure IoT Central application. A device group is a list of devices that are grouped together because they match some specified criteria.

Note: - this feature is available only on the Azure IoT Central Preview application

### references

- https://docs.microsoft.com/en-us/azure/iot-central/howto-use-device-groups-pnp

## Connecting Azure IoT Hub with Azure Functions and CosmosDB Storage

### references

- https://docs.microsoft.com/en-ca/samples/azure-samples/functions-js-iot-hub-processing/processing-data-from-iot-hub-with-azure-functions/

## Setting Up IoT Hub and provisioning Devices

### references

- https://docs.microsoft.com/en-us/azure/iot-hub/quickstart-send-telemetry-node
