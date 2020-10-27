#include <Arduino.h>
#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

int ledState = LOW;

const char *ssid = "DiabFam";
const char *password = "Yaso$M_M#1804";
const char *websockets_server = "ws://192.168.1.103:5000";

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
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++)
  {
    Serial.print("+-+");
    delay(1000);
  }
  Serial.println(">>");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  client.connect(websockets_server);
  client.ping();
  pinMode(LED_BUILTIN, OUTPUT);
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
unsigned int interval = 1000;
unsigned long int counter = 0;

void loop()
{
  if ((millis() - prevMillis) > interval - 1)
  {
    client.send("POGGERS");
    //client.ping();
    flashLed();
    prevMillis = millis();
  }
  client.poll();
}