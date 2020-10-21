

1. Para configuración de envios con formato: application/x-www-form-urlencoded

//EJEMPLO ENVIO ESP32. Incluyendo la libreria "Arduino_JSON"
http.addHeader("Content-Type", "application/x-www-form-urlencoded");
// Data to send with HTTP POST
String httpRequestData = "api_key=tPmAT5Ab3j7F9&sensor=BME280&value1=24.25&value2=49.54&value3=1005.14";           
// Send HTTP POST request
int httpResponseCode = http.POST(httpRequestData);


