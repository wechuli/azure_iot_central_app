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
const registrationId = "1dd6930b-9b40-4622-81aa-db6c6aa49fbb";
const symmetricKey = "89Rm3ATnQj+Pzc9Pk/47wmvy37cvXSshoUFwVbVNT3w=";
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

const uuidv4 = require("uuid/v4");

module.exports = function(context, IoTHubMessages) {
  context.log(
    `JavaScript eventhub trigger function called for message array: ${IoTHubMessages}`
  );

  context.log(JSON.stringify(IoTHubMessages));

  // Received parameters
  let message = IoTHubMessages[0];
  let temperature = message.temperature;
  let humidity = message.humidity;
  let deviceId = message.deviceId;

  //calculated parameters
  let tempStatus;
  let chanceOfRain;
  let tempInFarenheight;

  // calculate whether status of temprature is high or low

  function returnTempStatus(temp) {
    if (temp > 26) {
      return "High";
    }
    return "Low";
  }
  tempStatus = returnTempStatus(temperature);

  //calculate the chance of rain
  function calculateChanceOfRain(temp, humidity) {
    if (temp > 26 && humidity > 75) {
      return parseFloat((50 + Math.random() * 49).toFixed(2));
    }
    return parseFloat((0 + Math.random() * 49).toFixed(2));
  }
  chanceOfRain = calculateChanceOfRain(temperature, humidity);

  //calculate temprature in Fanhrenheit
  function calculateTempInFahr(temp) {
    return parseFloat((temp * (9 / 5) + 32).toFixed(2));
  }
  tempInFarenheight = calculateTempInFahr(temperature);

  let output = {
    deviceId,
    temperature,
    humidity,
    tempStatus,
    chanceOfRain,
    tempInFarenheight,
    uniqueMsgString: uuidv4(),
    timeStamp: new Date()
  };

  // Code to send data to IoT central

  // Send device measurements.
  function sendTelemetry() {
    const data = JSON.stringify({
      temperature: tempInFarenheight,
      humidity,
      tempStatus,
      chanceOfRain
    });
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
  const settings = {
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
  const connectCallback = err => {
    if (err) {
      console.log(
        `Device could not connect to Azure IoT Central: ${err.toString()}`
      );
    } else {
      console.log("Device successfully connected to Azure IoT Central");

      // Create handler for countdown command
      hubClient.onDeviceMethod("echo", onCommandEcho);

      // Send telemetry measurements to Azure IoT Central every 1 second.
      // setInterval(sendTelemetry, 1000);
      sendTelemetry();

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

  context.log(`Output content: ${output}`);

  context.bindings.outputDocument = output;

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
      hubClient = Client.fromConnectionString(
        connectionString,
        iotHubTransport
      );

      hubClient.open(connectCallback);
      context.done();
    }
  });

  context.done();
};
