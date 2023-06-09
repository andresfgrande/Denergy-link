#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Network details
const char* ssid     = "SSID";
const char* password = "PASSWORD";

// The server URL for the api server: http://localhost:5339 locally
String serverUrl = "https://api-denergy-server.vercel.app";

// Function to read energy consumption from a sensor
float readEnergyConsumed() {
  // Generate a random float between 0.25 and 0.45 to simulate the data from the sensor every hour.
  // Average consumption 285kWh a month
  float energyConsumed = 0.25 + static_cast <float> (random(0, 200)) / 1000.0;
  return energyConsumed;
}

void setup () {

  Serial.begin(115200);
  delay(10);

  // Connect to WiFi
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

unsigned long previousMillis = 0;  // Last time the data was sent
const long interval = 3600000;  // Interval at which to send data (1 hour = 3600000 milliseconds)

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    // save the last time data was sent
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      float energyConsumed = readEnergyConsumed();

      // Register energy consumption calling API
      http.begin(serverUrl + "/registerEnergyConsumption");
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST("{\"consumedEnergy\":" + String(energyConsumed) + "}");
      String payload = http.getString();
      Serial.println("Energy Consumption: HTTP response code: " + String(httpCode));
      Serial.println(payload);
      http.end();
    }
  }
}