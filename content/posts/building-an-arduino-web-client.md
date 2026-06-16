---
title: "Building an Arduino Web Client"
date: 2026-04-10
desc: I built an Arduino web client for the Uno R4 Wifi that fetches the temperature
---

I recently built a small Arduino project called WeatherDisplay. The goal was to connect an Arduino UNO R4 WiFi to the internet, fetch the current temperature, and show it on the board’s built-in LED matrix.

This was mostly a learning project, but a fun one. It combines WiFi, HTTPS requests, JSON parsing, and displaying text on the LED matrix.

## Keeping WiFi credentials out of source control

The sketch expects WiFi credentials to live in a separate `arduino_secrets.h` file:

```cpp
#define SECRET_SSID "your-wifi-name"
#define SECRET_PASS "your-wifi-password"
````

Then the main sketch can include those values without hardcoding secrets directly into the project:

```cpp
#include "arduino_secrets.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
```

## Connecting to WiFi

The board connects using the built-in WiFi support on the UNO R4 WiFi using `WiFiS3.h`

```cpp
Serial.begin(9600);
while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
}

// check for the WiFi module:
if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
}

String fv = WiFi.firmwareVersion();
if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
}

// attempt to connect to WiFi network:
while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);
    if (status == WL_CONNECTED){
        init_matrix();
        scroll_to_led("connected");
    }
    // wait 1 seconds for connection:
    delay(1000);
}
```

Once connected, the project can start making requests to the weather API.

## Calling the weather API

The sketch uses `WiFiSSLClient` so it can make an HTTPS request:

```cpp
WiFiSSLClient client;

if (client.connect("api.weather.gov", 443)) {
  client.println("GET /stations/YOUR_STATION_ID/observations/latest HTTP/1.1");
  client.println("Host: api.weather.gov");
  client.println("User-Agent: ArduinoWeatherDisplay");
  client.println("Connection: close");
  client.println();
}
```

That was one of the more satisfying parts of the project. The board is not just blinking lights; it is actually talking to a real API.

## Parsing the JSON response

After getting the response back, the sketch finds the JSON body and deserializes it using `ArduinoJson.h`:

```cpp
if (client.available()){
    char response_buf[BUF_SIZE];  // holds the raw response and headers
    JsonDocument doc;             // wraps the actual request body in managed object
    int index = 0;                // where to start reading (aka the body)
    bool load = false;            // when to start reading

    // advance the client cursor to the line where the JSON starts
    for(int i = 0; client.available() && i < BUF_SIZE; i++){
        char c = client.read();
        if (c == '{' && !load){
            load = true;
            index = i;
        }
        if (load) response_buf[i - index] = c;
    }

    // parse the JSON
    deserializeJson(doc, response_buf);
    float temp = doc["properties"]["temperature"]["value"];
    if (temp != 0) temperature = String(c_to_f(temp)); // guard for temp: null
} else{
    scroll_to_led("no data");
}
```

This was a good reminder that embedded development makes you think about things you normally ignore, like response size, memory, and buffers. I actually had to carefully chose which weather API I used because I was exhausting the available memory on the board.

## Displaying the temperature

Finally, the temperature gets written to the LED matrix on a regular interval. 

```cpp
if (millis()-last_time_stamp>poll_interval){
    get_temperature();
    print_to_led(temperature);
    last_time_stamp = millis();
}
```
The full code can be read [here](https://github.com/BenHeil26/WeatherDisplay) on my Github
## What I’d add next

There are a few obvious improvements I could make:

* Move the weather station ID into configuration
* Show more weather data like humidity or wind
* Rotate between multiple values on the display
* Improve error handling

For now, though, I’m happy with it. It is a small project, but it touches a bunch of useful concepts: WiFi, HTTPS, JSON, and hardware display output.

