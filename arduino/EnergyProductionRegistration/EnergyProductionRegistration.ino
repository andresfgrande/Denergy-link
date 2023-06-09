#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Network details
const char* ssid     = "SSID";
const char* password = "PASSWORD";

// The server URL for the api server: http://localhost:5339 locally
String serverUrl = "https://api-denergy-server.vercel.app";

// Function to read energy production from a sensor
float readEnergyProduced() {
  // Generate a random float between 5.0 and 15.0 to simulate the data from the sensor every hour.
  // Average production 10.000kwh a month
  float energyProduced = 5.0 + static_cast <float> (random(0, 100)) / 10.0;
  return energyProduced;
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

      float energyProduced = readEnergyProduced();
      float energyConsumed = readEnergyConsumed();

      // Register energy production calling API
      http.begin(serverUrl + "/registerEnergyProduction");
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST("{\"energyProduced\":" + String(energyProduced) + "}");
      String payload = http.getString();
      Serial.println("Energy Production: HTTP response code: " + String(httpCode));
      Serial.println(payload);
      http.end();
    }
  }
}