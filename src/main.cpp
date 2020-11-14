#include <Arduino.h>
#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

float gX, gY, gZ;
int ledState = LOW;
const int capacity = JSON_OBJECT_SIZE(3);
const char *ssid = "DiabFam";
const char *password = "Yaso$M_M#1804";
const char *websockets_server = "ws://192.168.1.103:5000";

String serializedSensorData; 

StaticJsonDocument<capacity> sensorJson;

bool isConnOpen = false;

using namespace websockets;
WebsocketsClient client;

void onMessageCallback(WebsocketsMessage message)
{
  Serial.print("Got Message: ");
  Serial.println(message.data());
}

void onEventsCallback(WebsocketsEvent event, String data)
{
  if (event == WebsocketsEvent::ConnectionOpened)
  {
    Serial.println("Connnection Opened");
  }
  else if (event == WebsocketsEvent::ConnectionClosed)
  {
    Serial.println("Connnection Closed");
    client.connect(websockets_server);
  }
  else if (event == WebsocketsEvent::GotPing)
  {
    Serial.println("Got a Ping!");
  }
  else if (event == WebsocketsEvent::GotPong)
  {
    Serial.println("Got a Pong!");
  }
}

void setup()
{
  Serial.begin(921600);
  //WiFi.begin(ssid, password);
  IPAddress ip(192, 168, 1, 118);
  IPAddress gateway(192, 168, 1, 1);
  Serial.print(F("Setting static ip to : "));
  Serial.println(ip);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.config(ip, gateway, subnet);

  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++)
  {
    Serial.print("+-+");
    delay(1000);
  }
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println(">>");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  //client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  client.connect(websockets_server);
  client.ping();
}

void flashLed()
{
  if (ledState == LOW)
  {
    ledState = HIGH;
  }
  else
  {
    ledState = LOW;
  }
  digitalWrite(LED_BUILTIN, ledState);
}

unsigned long long prevMillis = millis();
unsigned int interval = 0.2;
unsigned long long counter = 0;

void loop()
{
  if ((millis() - prevMillis) >= interval)
    {
      sensorJson["roll"] = 4.17;
      sensorJson["yaw"] = 0.00;
      sensorJson["pitch"] = 55.65;

      serializeJson(sensorJson, serializedSensorData);

      client.send(serializedSensorData);
      serializedSensorData = "";
      //client.ping();
      flashLed();
      prevMillis = millis();
      }
  client.poll();
}