#include <Arduino.h>
#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <secrets.h>

int ledState = LOW;
const int CALIBRATION_BUFFER = 2000;
const int capacity = JSON_OBJECT_SIZE(6);
const uint8_t MPU6050SlaveAddress = 0x68;

// sensitivity scale factor respective to full scale setting provided in datasheet 
const uint16_t AccelScaleFactor = 16384;
const uint16_t GyroScaleFactor = 131;

// MPU6050 few configuration register addresses
const uint8_t MPU6050_REGISTER_SMPLRT_DIV   =  0x19;
const uint8_t MPU6050_REGISTER_USER_CTRL    =  0x6A;
const uint8_t MPU6050_REGISTER_PWR_MGMT_1   =  0x6B;
const uint8_t MPU6050_REGISTER_PWR_MGMT_2   =  0x6C;
const uint8_t MPU6050_REGISTER_CONFIG       =  0x1A;
const uint8_t MPU6050_REGISTER_GYRO_CONFIG  =  0x1B;
const uint8_t MPU6050_REGISTER_ACCEL_CONFIG =  0x1C;
const uint8_t MPU6050_REGISTER_FIFO_EN      =  0x23;
const uint8_t MPU6050_REGISTER_INT_ENABLE   =  0x38;
const uint8_t MPU6050_REGISTER_ACCEL_XOUT_H =  0x3B;
const uint8_t MPU6050_REGISTER_SIGNAL_PATH_RESET  = 0x68;

int16_t AccelX, AccelY, AccelZ, Temperature, GyroX, GyroY, GyroZ; long GyroOffsetX, GyroOffsetY, GyroOffsetZ;

void I2C_Write(uint8_t deviceAddress, uint8_t regAddress, uint8_t data){
  Wire.beginTransmission(deviceAddress);
  Wire.write(regAddress);
  Wire.write(data);
  Wire.endTransmission();
  delay(1);
}

// read all 14 register
void Read_RawValue(uint8_t deviceAddress, uint8_t regAddress){
  Wire.beginTransmission(deviceAddress);
  Wire.write(regAddress);
  Wire.endTransmission();
  Wire.requestFrom(deviceAddress, (uint8_t)14);
  AccelX = (((int16_t)Wire.read()<<8) | Wire.read());
  AccelY = (((int16_t)Wire.read()<<8) | Wire.read());
  AccelZ = (((int16_t)Wire.read()<<8) | Wire.read());
  Temperature = (((int16_t)Wire.read()<<8) | Wire.read());
  GyroX = (((int16_t)Wire.read()<<8) | Wire.read());
  GyroY = (((int16_t)Wire.read()<<8) | Wire.read());
  GyroZ = (((int16_t)Wire.read()<<8) | Wire.read());
}

//configure MPU6050
void MPU6050_Init(){
  delay(150);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_SMPLRT_DIV, 0x07);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_PWR_MGMT_1, 0x01);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_PWR_MGMT_2, 0x00);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_CONFIG, 0x00);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_GYRO_CONFIG, 0x00);//set +/-250 degree/second full scale
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_ACCEL_CONFIG, 0x00);// set +/- 2g full scale
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_FIFO_EN, 0x00);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_INT_ENABLE, 0x01);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_SIGNAL_PATH_RESET, 0x00);
  I2C_Write(MPU6050SlaveAddress, MPU6050_REGISTER_USER_CTRL, 0x00);
  delay(150);
}

void CalibrateGyro(){
  Serial.print("Calibrating gyro");
  for (int i = 0; 100 && i <= (CALIBRATION_BUFFER+100) ; i++){      
    if(i % 125 == 0)Serial.print(".");                              
    Read_RawValue(MPU6050SlaveAddress, MPU6050_REGISTER_ACCEL_XOUT_H);                                            
    GyroOffsetX += GyroX;                                              
    GyroOffsetY += GyroY;                                              
    GyroOffsetZ += GyroZ;                                              
    delay(3);                                                          
  }
  GyroOffsetX /= CALIBRATION_BUFFER;                                                  
  GyroOffsetY /= CALIBRATION_BUFFER;
  GyroOffsetZ /= CALIBRATION_BUFFER;
  Serial.print("\nGyro Calibration Complete with offset X:"); Serial.print(GyroOffsetX);
  Serial.print(" Y:"); Serial.print(GyroOffsetY);
  Serial.print(" Z:"); Serial.println(GyroOffsetZ);
  delay(5000);
}

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
  Wire.begin();
  MPU6050_Init();
  WiFi.begin(SECRET_SSID, SECRET_PASS);
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++)
  {
    Serial.print("+-+");
    delay(1000);
  }
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println(">>");
  IPAddress ip(192, 168, 1, 32);
  IPAddress gateway(192, 168, 1, 1);
  Serial.print(F("Setting static ip to : "));
  Serial.println(ip);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.config(ip, gateway, subnet);
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  CalibrateGyro();
  client.onEvent(onEventsCallback);
  Serial.println("Connecting to Server");
  client.connect(SECRET_ENDPOINT);
  delay(1000);
  Serial.println("Pinging Server");
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

void loop()
{
  client.poll();
  Read_RawValue(MPU6050SlaveAddress, MPU6050_REGISTER_ACCEL_XOUT_H);
  GyroX -= GyroOffsetX;
  GyroY -= GyroOffsetY;
  GyroZ -= GyroOffsetZ;
  /*
  double Ax, Ay, Az, Gx, Gy, Gz;
  Ax = (double)AccelX/AccelScaleFactor;
  Ay = (double)AccelY/AccelScaleFactor;
  Az = (double)AccelZ/AccelScaleFactor;
  Gx = (double)GyroX/GyroScaleFactor;
  Gy = (double)GyroY/GyroScaleFactor;
  Gz = (double)GyroZ/GyroScaleFactor;
  
  Serial.print("Ax: "); Serial.print(Ax);
  Serial.print(" Ay: "); Serial.print(Ay);
  Serial.print(" Az: "); Serial.print(Az);
  Serial.print(" Gx: "); Serial.print(Gx);
  Serial.print(" Gy: "); Serial.print(Gy);
  Serial.print(" Gz: "); Serial.println(Gz);*/

  sensorJson["Ax"] = AccelX;
  sensorJson["Ay"] = AccelY;
  sensorJson["Az"] = AccelZ;
  sensorJson["Gx"] = GyroX;
  sensorJson["Gy"] = GyroY;
  sensorJson["Gz"] = GyroZ;
  
  serializeJson(sensorJson, serializedSensorData);

  client.send(serializedSensorData);
  serializedSensorData = "";
  //client.ping();
  flashLed();
}