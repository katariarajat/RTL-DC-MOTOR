#include <WiFiClientSecure.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "mbedtls/md.h"

// Motor 
int motor1Pin1 = 27; 
int motor1Pin2 = 26; 
int currentSensorPin = 35;
int voltageSensorPin = 34;
int irSensorPin = 32;
int enable1Pin = 14; 
const char* ssid = "KISHAN";
const char* password = "Megha@1997";
String experiment_id;
bool experimentStarted = false;
int numberOfDataInstance = 0;

// Setting PWM properties
const int freq = 30000;
const int pwmChannel = 0;
const int resolution = 8;
int dutyCycle = 0;

AsyncWebServer server(80);

//SERVER IP ADDRESS
//For Local host: 1) If you are using Windows OS then use command "ipconfig" in Command Prompt to find IPV4 address and use that. 
//                2) If you are using Linux OS then use command "ifconfig" in terminal to find IPV4 address and use that. 
const char*  IIITserver = "esw-onem2m.iiit.ac.in";
// #######################################################

int WIFI_DELAY  = 100; //ms

// oneM2M : CSE params
String CSE_NAME    = "in-name";
String CSE_M2M_ORIGIN  = "ob3PvRNzkq:RaX61@EpnN";
String TEAM_NUMBER = "Team-22";

// oneM2M : resources' params
int TY_AE  = 2;
int TY_CNT = 3;
int TY_CI  = 4;
int TY_SUB = 23;

// HTTP constants
int LOCAL_PORT = 9999;
char* HTTP_CREATED = "HTTP/1.1 201 Created";
char* HTTP_OK    = "HTTP/1.1 200 OK\r\n";
int REQUEST_TIME_OUT = 5000; //ms

const char* test_root_ca= \
"-----BEGIN CERTIFICATE-----\n" \
"MIIDdTCCAl2gAwIBAgILBAAAAAABFUtaw5QwDQYJKoZIhvcNAQEFBQAwVzELMAkG\n" \ 
"A1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExEDAOBgNVBAsTB1Jv\n" \
"b3QgQ0ExGzAZBgNVBAMTEkdsb2JhbFNpZ24gUm9vdCBDQTAeFw05ODA5MDExMjAw\n" \
"MDBaFw0yODAxMjgxMjAwMDBaMFcxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9i\n" \ 
"YWxTaWduIG52LXNhMRAwDgYDVQQLEwdSb290IENBMRswGQYDVQQDExJHbG9iYWxT\n" \
"aWduIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDaDuaZ\n" \
"jc6j40+Kfvvxi4Mla+pIH/EqsLmVEQS98GPR4mdmzxzdzxtIK+6NiY6arymAZavp\n" \
"xy0Sy6scTHAHoT0KMM0VjU/43dSMUBUc71DuxC73/OlS8pF94G3VNTCOXkNz8kHp\n" \
"1Wrjsok6Vjk4bwY8iGlbKk3Fp1S4bInMm/k8yuX9ifUSPJJ4ltbcdG6TRGHRjcdG\n" \
"snUOhugZitVtbNV4FpWi6cgKOOvyJBNPc1STE4U6G7weNLWLBYy5d4ux2x8gkasJ\n" \
"U26Qzns3dLlwR5EiUWMWea6xrkEmCMgZK9FGqkjWZCrXgzT/LCrBbBlDSgeF59N8\n" \
"9iFo7+ryUp9/k5DPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8E\n" \
"BTADAQH/MB0GA1UdDgQWBBRge2YaRQ2XyolQL30EzTSo//z9SzANBgkqhkiG9w0B\n" \
"AQUFAAOCAQEA1nPnfE920I2/7LqivjTFKDK1fPxsnCwrvQmeU79rXqoRSLblCKOz\n" \
"yj1hTdNGCbM+w6DjY1Ub8rrvrTnhQ7k4o+YviiY776BQVvnGCv04zcQLcFGUl5gE\n" \
"38NflNUVyRRBnMRddWQVDf9VMOyGj/8N7yy5Y0b2qvzfvGn9LhJIZJrglfCm7ymP\n" \
"AbEVtQwdpf5pLGkkeB6zpxxxYu7KyJesF12KwvhHhm4qxFYxldBniYUr+WymXUad\n" \
"DKqC5JlR3XC321Y9YeRq4VzW9v493kHMB65jUr9TU/Qr6cf9tveCX4XSQRjbgbME\n" \
"HMUfpIBvFSDJ3gyICh3WZlXi/EjJKSZp4A==\n" \
"-----END CERTIFICATE-----\n";


// Method for creating an HTTP POST with preconfigured oneM2M headers
// param : url  --> the url path of the targted oneM2M resource on the remote CSE
// param : ty --> content-type being sent over this POST request (2 for ae, 3 for cnt, etc.)
// param : rep  --> the representaton of the resource in JSON format
String doPOST(String url, int ty, String rep) {
  // Connect to the CSE address
   // Get a client
  WiFiClientSecure client;
  client.setCACert(test_root_ca);
  String Link = "https://esw-onem2m.iiit.ac.in/~/in-cse"+url;
  if (!client.connect(IIITserver , 443)) {
    Serial.println("Connection failed !");
    return "error";
  }
  // if connection succeeds, we show the request to be send
  String postRequest = String() + "POST " + Link + " HTTP/1.1\r\n" +
                       "Host: " + IIITserver +"\r\n" +
                       "X-M2M-Origin: " + CSE_M2M_ORIGIN + "\r\n" +
                       "Content-Type: application/json;ty=" + ty + "\r\n" +
                       "Content-Length: " + rep.length() + "\r\n"
                       "Connection: close\r\n\n" +
                       rep;

  // Send the HTTP POST request
  client.println(postRequest);

  // Manage a timeout
  while (client.connected()) {
      String line = client.readStringUntil('\n');
      if (line == "\r") {
        Serial.println("headers received");
        break;
      }
    }
    while (client.available()) {
      char c = client.read();
    }

    client.stop();
    return "Done";
}

String hashData( String inputData){
  const char *payload = inputData.c_str();
  byte shaResult[32];

  mbedtls_md_context_t ctx;
  mbedtls_md_type_t md_type = MBEDTLS_MD_SHA256;

  const size_t payloadLength = strlen(payload);         

  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, mbedtls_md_info_from_type(md_type), 0);
  mbedtls_md_starts(&ctx);
  mbedtls_md_update(&ctx, (const unsigned char *) payload, payloadLength);
  mbedtls_md_finish(&ctx, shaResult);
  mbedtls_md_free(&ctx);
  
  String hashed = "";
  for(int i= 0; i< sizeof(shaResult); i++){
      char str[3];

      sprintf(str, "%02x", (int)shaResult[i]);
      hashed += str;
  }
  Serial.println();
  Serial.print(hashed);
  return hashed;
}

String encryptData( String inputData){
    String finalData = "";
    String encryptedData = "";
    for(int i=0;i<inputData.length();i++){
      finalData+=inputData[i];
      finalData+=char(random(97,122));
      finalData+=char(random(97,122));
      finalData+=char(random(97,122));
      finalData+=char(random(97,122));
      finalData+=char(random(97,122));  
    }
    Serial.println("Final Data = "+finalData);
    for(int i=0;i<finalData.length();i++){
        int temp = finalData[i];
        temp+=7;
        encryptedData += char(temp);
    }
    Serial.println("encrypted Data = "+encryptedData);
    return encryptedData;
}

String decryptData(String cryptedData){
  String finalData = "";
  for(int i=0;i<cryptedData.length();i+=6){
      int temp = cryptedData[i];
      temp -= 7;
      finalData+=char(temp);
  }  
  Serial.println("DecryptedData = "+finalData);
}

String createCI(String ae, String cnt1, String ciContent) {
  String encryptedData = encryptData(ciContent);
  String hashedData = hashData(ciContent);
  Serial.println("Data="+ciContent);
  Serial.println("Hashed data="+hashedData);
//  decryptData(encryptedData);
//  Serial.println("Encrypted data="+encryptedData);

  String dataToSend = encryptedData + " " + hashedData;
  
  String ciRepresentation =
    "{\"m2m:cin\": {"
    "\"con\":\"" + dataToSend + "\""
    "}}";
  
  return doPOST("/" + CSE_NAME + "/" + ae + "/" + cnt1 , TY_CI, ciRepresentation);
}

void setup() {
  Serial.begin(115200);
  // sets the pins as outputs:
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(enable1Pin, OUTPUT);
  pinMode(currentSensorPin, INPUT);
  pinMode(voltageSensorPin, INPUT);
  // configure LED PWM functionalitites
  ledcSetup(pwmChannel, freq, resolution);
  
  // attach the channel to the GPIO to be controlled
  ledcAttachPin(enable1Pin, pwmChannel);
  ledcWrite(pwmChannel, dutyCycle);
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);

  WiFi.begin(ssid, password); 
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected..! Got IP: ");
  Serial.println(WiFi.localIP());
  
  // setting up the webserver
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200,"text/plain","Hello world");
  });
  server.begin();
  Serial.println("HTTP server started");

  // testing
  Serial.print("Testing DC Motor...");
  server.on("/voltage",HTTP_GET,[](AsyncWebServerRequest *request){
    String voltage;
    float volts;
    if(request->hasParam("voltage") && request->hasParam("experiment_id")){
      voltage = request->getParam("voltage")->value();
      experiment_id = request->getParam("experiment_id")->value();
      volts = voltage.toFloat();
      if(volts){
        if(volts >= 0.01 && volts <= 12){
          //  createCI("AE-RTL-MOTOR","ESP32","Hello world");
          dutyCycle = int((volts-0.01)*255/11.99);
          
          ledcWrite(pwmChannel, dutyCycle);
          Serial.print("Duty: ");
          Serial.println(dutyCycle);
          experimentStarted = true;
          numberOfDataInstance = 0;
          request->send(200, "text/plain", "OK");  
        } else{
          request->send(400, "text/plain", "Unacceptable value");
        }
      }else{
          request->send(400, "text/plain", "Unacceptable value");
      }  
    }else{
      request->send(400, "text/plain", "No voltage sent");
    }
    Serial.println(voltage);
    Serial.println(volts);
  });
}

float adcRes = 4095.0;
float maxCur = 0.0;
float minCur = 4095.0;

void loop() {
  float avgCurrent = 0.0,avgVoltage = 0.0;
  float totalCurrent = 0.0, totalVoltage = 0.0;
  float actualCurrent = 0.0, actualVoltage = 0.0;
  for(int i=0;i<150;i++){
    float current = analogRead(currentSensorPin);
    current = (current - 2900)/(3400 - 2900);
    totalCurrent = totalCurrent + (current);
    if(minCur > current)
      minCur = current;
    if(maxCur < current)
      maxCur = current;
    delay(1);
  }
  for(int i=0;i<150;i++){
    float voltage = analogRead(voltageSensorPin);
    totalVoltage = totalVoltage + (16.5/adcRes)*voltage;
    delay(1);
  }
  int counter = 0;
  int prevTime = millis();
  int prevReading = 0, currReading = 0;
  while(millis() - prevTime <= 1000){
    currReading = analogRead(irSensorPin);
    if(currReading == 4095 && prevReading != 4095){
      counter++;
    }
    prevReading = currReading;
  }
  int rpm = int((counter*60)/7);
  avgCurrent = totalCurrent/150.0;
  avgVoltage = totalVoltage/150.0;
  Serial.print("Current: ");
  Serial.println(avgCurrent);
  Serial.print("Voltage: ");
  Serial.println(avgVoltage);
  Serial.print("RPM: ");
  Serial.println(rpm);
  if(experimentStarted){
    String response = String(rpm) + " " + String(avgVoltage) + " " + String(avgCurrent);
    createCI(TEAM_NUMBER,experiment_id,response);
    numberOfDataInstance++;
    if(numberOfDataInstance>8){
      numberOfDataInstance = 0;
      dutyCycle = 0;
      experimentStarted = false;
      ledcWrite(pwmChannel, dutyCycle);
    }
  }
  delay(700);
}
