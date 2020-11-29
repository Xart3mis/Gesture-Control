const http = require("http");
const WebSocketServer = require("websocket").server
const colors = require('./colors')
var KalmanFilter = require('kalmanjs');

const fs = require('fs');

let connection = null;
let counter = 0;
let offset = { OffsetX: 0, OffsetY: 0, OffsetZ: 0 };
const calibrationBuffer = 2000;
let ValuesGx = []; let ValuesGy = []; let ValuesGz = [];
var start;
let Ax, Ay, Az, Gx, Gy, Gz;
const AccelScaleFactor = 16384;
const GyroScaleFactor = 131;

const kf = new KalmanFilter({R: 0.01, Q: 3});

const httpserver = http.createServer((req, res) => 
console.log(`${colors.Hidden}we have received a request${colors.Reset}`))

const websocket = new WebSocketServer({
    "httpServer": httpserver
})


httpserver.listen(5000, () => console.log(`${colors.BgWhite+colors.FgGreen}\nMy server is listening on port 5000\nRunning on http://localhost:5000${colors.Reset}`))

function calculateGyroOffset(count) {
    for (var x = 0; x < ValuesGx.length; x++) { offset.OffsetX += ValuesGx[x]; };
    for (var y = 0; y < ValuesGy.length; y++) { offset.OffsetY += ValuesGy[y]; };
    for (var z = 0; z < ValuesGz.length; z++) { offset.OffsetZ += ValuesGz[z]; };
    //console.log(`sumX:${offset.OffsetX} sumY:${offset.OffsetY}  sumZ:${offset.OffsetZ}`);
    offset.OffsetX /= count; offset.OffsetX = offset.OffsetX.toFixed(0); 
    offset.OffsetY /= count; offset.OffsetY = offset.OffsetY.toFixed(0);
    offset.OffsetZ /= count; offset.OffsetZ = offset.OffsetZ.toFixed(0);
    console.log(offset)
    fs.writeFileSync("offsets.json", JSON.stringify(offset))
}

websocket.on("request", request=> {
    connection = request.accept(null, request.origin)
    connection.on("close", () => console.log(`${colors.FgRed}Connection Closed${colors.Reset}`))
    connection.on("open", () => console.log(`${colors.FgGreen}Connection Opened${colors.Reset}`))
    connection.on('ping', () => {console.log(colors.FgYellow + 'got a ping' + colors.Reset); start = Date.now()})
    connection.on("message", message => {
        counter+=1
        jsonData = JSON.parse(message.utf8Data);
        Ax = (kf.filter(jsonData.Ax, 1)/AccelScaleFactor).toFixed(3); Ay = (kf.filter(jsonData.Ay, 1)/AccelScaleFactor).toFixed(3); Az = (kf.filter(jsonData.Az, 1)/AccelScaleFactor).toFixed(3);
        Gx = parseInt((kf.filter(jsonData.Gx, 1) / GyroScaleFactor).toFixed(0)); Gy = parseInt((kf.filter(jsonData.Gy, 1) / GyroScaleFactor).toFixed(0)); Gz = parseInt((kf.filter(jsonData.Gz, 1) / GyroScaleFactor).toFixed(0));
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Ax: ${Ax}g Ay: ${Ay}g Az: ${Az}g Gx: ${Gx}°/s Gy: ${Gy}°/s Gz: ${Gz}°/s`);
        ValuesGx.push(Gx); ValuesGy.push(Gy); ValuesGz.push(Gz);
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
    console.log(`\n${colors.FgGreen}Recieved ${counter} messages in ${finishTime}ms, avg ms/msg:${(finishTime/counter).toFixed(4)}${colors.Reset}`);
    calculateGyroOffset(counter)
    process.exit();
});
