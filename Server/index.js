const http = require("http");
const WebSocketServer = require("websocket").server
const colors = require('./colors')
var KalmanFilter = require('kalmanjs');
var kf = new KalmanFilter({R: 0.01, Q: 3});
const { keyboard } = require("@nut-tree/nut-js");


let connection = null;
let counter = 0;
//let GyroOffsetX, GyroOffsetY, GyroOffsetZ;
//const calibrationBuffer = 2000;
var start;
let Ax, Ay, Az, Gx, Gy, Gz, sGx, sGy, sGz;
let oldGx, oldGy, oldGz =0;
const AccelScaleFactor = 16384;
const GyroScaleFactor = 131;
const gyroHidThreshhold = 5;
const httpserver = http.createServer((req, res) => 
                console.log(`${colors.Hidden}we have received a request${colors.Reset}`))

const websocket = new WebSocketServer({
    "httpServer": httpserver
})


httpserver.listen(5000, () => console.log(`${colors.BgWhite+colors.FgGreen}\nMy server is listening on port 5000\nRunning on http://localhost:5000${colors.Reset}`))

function gyroSmoothen(rawGx, rawGy, rawGz) {
    if (!(rawGx >= 55 || rawGx <= -55)) { sGx = 0; }
    else { sGx = rawGx }
    if (!(rawGy >= 55 || rawGy <= -55)) { sGy = 0; }
    else { sGy = rawGy }
    if (!(rawGz >= 55 || rawGz <= -55)) { sGz = 0; }
    else { sGz = rawGz }
}

websocket.on("request", request=> {
    connection = request.accept(null, request.origin)
    connection.on("close", () => console.log(`${colors.FgRed}Connection Closed${colors.Reset}`))
    connection.on("open", () => console.log(`${colors.FgGreen}Connection Opened${colors.Reset}`))
    connection.on('ping', () => {console.log(colors.FgYellow + 'got a ping' + colors.Reset); start = Date.now()})
    connection.on("message", message => {
        counter+=1
        jsonData = JSON.parse(message.utf8Data);
        gyroSmoothen(jsonData.Gx, jsonData.Gy, jsonData.Gz);
        Ax = (kf.filter(jsonData.Ax, 1)/AccelScaleFactor).toFixed(3); Ay = (kf.filter(jsonData.Ay, 1)/AccelScaleFactor).toFixed(3); Az = (kf.filter(jsonData.Az, 1)/AccelScaleFactor).toFixed(3);
        Gx = (kf.filter(sGx, 1)/GyroScaleFactor).toFixed(0); Gy = (kf.filter(sGy, 1)/GyroScaleFactor).toFixed(0); Gz = (kf.filter(sGz, 1)/GyroScaleFactor).toFixed(0);
        if(Gy-oldGy==gyroHidThreshhold){keyboard.type("d")}
        if(oldGy-Gy==gyroHidThreshhold){keyboard.type("a")}
        /*
        if (counter <= calibrationBuffer) { GyroOffsetX += Gx; GyroOffsetY += Gy; GyroOffsetZ += Gz; console.log('calibrating' + counter) }
        if (counter == calibrationBuffer+1){GyroOffsetX /= calibrationBuffer; GyroOffsetY /= calibrationBuffer; GyroOffsetZ /= calibrationBuffer;}
        Gx -= GyroOffsetX; Gy -= GyroOffsetY; Gz -= GyroOffsetZ;
        */
        console.log(`Ax: ${Ax}g Ay: ${Ay}g Az: ${Az}g Gx: ${Gx}°/s Gy: ${Gy}°/s Gz: ${Gz}°/s`);
        //console.log(`Ax: ${jsonData.Ax}g Ay: ${jsonData.Ay}g Az: ${jsonData.Az}g Gx: ${jsonData.Gx}°/s Gy: ${jsonData.Gy}°/s Gz: ${jsonData.Gz}°/s`)
        oldGx = Gx; oldGy = Gy; oldGz = Gz;
    })
})

var elapsed_time = () => {
    var elapsed = Date.now() - start
    return elapsed;
}

process.on("SIGINT", () => {
    let finishTime = elapsed_time();
  console.log(`${colors.FgGreen}Recieved ${counter} messages in ${finishTime}ms, avg ms/msg:${(finishTime/counter).toFixed(4)}${colors.Reset}`);
  process.exit();
} );