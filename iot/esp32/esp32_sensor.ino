#include <ArduinoJson.h>
#include <DHT.h>

#define DHTPIN 21
#define DHTTYPE DHT11
#define SOIL_PIN 4

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  // Delay initialisation so Serial Monitor can connect
  delay(1000); 
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int soilValue = analogRead(SOIL_PIN);

  // Error handling if DHT fails to read
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("{\"error\": \"Failed to read from DHT sensor\"}");
    delay(3000);
    return;
  }

  // Convert raw soil moisture (0-4095) to Percentage (0-100%)
  // Dry soil = high value (e.g., 4000), Wet soil = low value (e.g., 1000)
  // We need to constrain and map these values to get a sensible percentage
  int soilPercent = 0;
  if (soilValue == 0) {
    soilPercent = 0;
  } else if (soilValue > 3000) {
    soilPercent = constrain(map(soilValue, 1000, 4000, 0, 100), 0, 100);
  } else {
    soilPercent = constrain(map(soilValue, 3000, 1000, 0, 100), 0, 100);
  }

  // Create JSON document
  StaticJsonDocument<128> doc;
  doc["moisture"] = soilPercent;
  doc["temp"] = temperature;
  doc["humidity"] = humidity;

  // Serialize and send JSON over Serial USB
  serializeJson(doc, Serial);
  Serial.println(); // Adding newline for Python/Node parser to know when JSON ends

  // We are keeping a 3 second delay
  delay(3000);
}
