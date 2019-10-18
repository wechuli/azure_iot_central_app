"use strict";

const iotHubTransport = require("azure-iot-device-mqtt").Mqtt;
const Client = require("azure-iot-device").Client;
const Message = require("azure-iot-device").Message;
const ProvisioningTransport = require("azure-iot-provisioning-device-mqtt")
  .Mqtt;
const SymmetricKeySecurityClient = require("azure-iot-security-symmetric-key")
  .SymmetricKeySecurityClient;
const ProvisioningDeviceClient = require("azure-iot-provisioning-device")
  .ProvisioningDeviceClient;

const provisioningHost = "global.azure-devices-provisioning.net";
const idScope = "0ne00086831";
const registrationId = "9a4e46f5-1b3c-4190-a7f0-4bdf48c7e68c";
const symmetricKey = "QqTwuRXnEqDasLuM9kWZmdIXSJc1vcF2Wrd6r2BWpo8=";
const provisioningSecurityClient = new SymmetricKeySecurityClient(
  registrationId,
  symmetricKey
);
const provisioningClient = ProvisioningDeviceClient.create(
  provisioningHost,
  idScope,
  new ProvisioningTransport(),
  provisioningSecurityClient
);
let hubClient;
let targetTemperature = 0;

// Send device measurements.
function sendTelemetry() {
  var temperature = targetTemperature + Math.random() * 15;
  var data = JSON.stringify({ temperature: temperature });
  var message = new Message(data);
  hubClient.sendEvent(message, (err, res) =>
    console.log(
      `Sent message: ${message.getData()}` +
        (err ? `; error: ${err.toString()}` : "") +
        (res ? `; status: ${res.constructor.name}` : "")
    )
  );
}

// Send device properties
function sendDeviceProperties(twin) {
  var properties = {
    firmwareVersion: "9.75",
    serialNumber: "10001"
  };
  twin.properties.reported.update(properties, errorMessage =>
    console.log(
      ` * Sent device properties ` +
        (errorMessage ? `Error: ${errorMessage.toString()}` : `(success)`)
    )
  );
}

// Add any settings your device supports
// mapped to a function that is called when the setting is changed.
var settings = {
  setTemperature: (newValue, callback) => {
    // Simulate the temperature setting taking two steps.
    setTimeout(() => {
      targetTemperature =
        targetTemperature + (newValue - targetTemperature) / 2;
      callback(targetTemperature, "pending");
      setTimeout(() => {
        targetTemperature = newValue;
        callback(targetTemperature, "completed");
      }, 5000);
    }, 5000);
  }
};

// Handle settings changes that come from Azure IoT Central via the device twin.
function handleSettings(twin) {
  twin.on("properties.desired", function(desiredChange) {
    for (let setting in desiredChange) {
      if (settings[setting]) {
        console.log(
          `Received setting: ${setting}: ${desiredChange[setting].value}`
        );
        settings[setting](
          desiredChange[setting].value,
          (newValue, status, message) => {
            var patch = {
              [setting]: {
                value: newValue,
                status: status,
                desiredVersion: desiredChange.$version,
                message: message
              }
            };
            twin.properties.reported.update(patch, err =>
              console.log(
                `Sent setting update for ${setting}; ` +
                  (err ? `error: ${err.toString()}` : `status: success`)
              )
            );
          }
        );
      }
    }
  });
}

// Respond to the echo command
function onCommandEcho(request, response) {
  // Display console info
  console.log(" * Echo command received");
  // Respond
  response.send(10, "Success", function(errorMessage) {});
}

// Handle device connection to Azure IoT Central.
var connectCallback = err => {
  if (err) {
    console.log(
      `Device could not connect to Azure IoT Central: ${err.toString()}`
    );
  } else {
    console.log("Device successfully connected to Azure IoT Central");

    // Create handler for countdown command
    hubClient.onDeviceMethod("echo", onCommandEcho);

    // Send telemetry measurements to Azure IoT Central every 1 second.
    setInterval(sendTelemetry, 1000);

    // Get device twin from Azure IoT Central.
    hubClient.getTwin((err, twin) => {
      if (err) {
        console.log(`Error getting device twin: ${err.toString()}`);
      } else {
        // Send device properties once on device start up.
        sendDeviceProperties(twin);

        // Apply device settings and handle changes to device settings.
        handleSettings(twin);
      }
    });
  }
};

// Start the device (connect it to Azure IoT Central).
provisioningClient.register((err, result) => {
  if (err) {
    console.log("error registering device: " + err);
  } else {
    console.log("registration succeeded");
    console.log("assigned hub=" + result.assignedHub);
    console.log("deviceId=" + result.deviceId);
    var connectionString =
      "HostName=" +
      result.assignedHub +
      ";DeviceId=" +
      result.deviceId +
      ";SharedAccessKey=" +
      symmetricKey;
    hubClient = Client.fromConnectionString(connectionString, iotHubTransport);

    hubClient.open(connectCallback);
  }
});
