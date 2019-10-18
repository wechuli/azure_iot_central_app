# Ideas NotePad

## Enrinching Data and Displaying it on the Azure Central App

- Have two different application, one simulated directly from the Azure IoT Central application and one "real" but simulated from an Azure function.
- The simulated app is in charge of generating the desired values, a rule is attached to this simulated app which connects to a Webhook and sends all information received to the Azure Function
- The Azure Function's work is to take the data from the WebHook, enrich the data however we may define (possibly store it), and then mimick a real device that is sending data to a distinct application on the Azure Central application so we can use the predefined visualizations of the Azure IoT Central to graph and analyse the enriched values
