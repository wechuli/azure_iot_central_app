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
    return temp * (9 / 5) + 32;
  }
  tempInFarenheight = calculateTempInFahr(temperature);

  let output = {
    deviceId,
    temperature,
    humidity,
    tempStatus,
    chanceOfRain,
    tempInFarenheight
  };

  context.log(`Output content: ${output}`);

  context.bindings.outputDocument = output;

  context.done();
};
