const http = require("http");
const WebSocketServer = require("websocket").server
const colors = require('./colors')
var KalmanFilter = require('kalmanjs');
var kf = new KalmanFilter({R: 0.01, Q: 3});

let connection = null;
let counter = 0;
var start;
let Ax, Ay, Az, Gx, Gy, Gz = undefined;
const AccelScaleFactor = 16384;
const GyroScaleFactor = 131;
const httpserver = http.createServer((req, res) => 
                console.log(`${colors.Hidden}we have received a request${colors.Reset}`))

const websocket = new WebSocketServer({
    "httpServer": httpserver
})


httpserver.listen(5000, () => console.log(`${colors.BgWhite+colors.FgGreen}\nMy server is listening on port 5000\nRunning on http://localhost:5000${colors.Reset}`))

websocket.on("request", request=> {
    connection = request.accept(null, request.origin)
    connection.on("close", () => console.log(`${colors.FgRed}Connection Closed${colors.Reset}`))
    connection.on("open", () => console.log(`${colors.FgGreen}Connection Opened${colors.Reset}`))
    connection.on('ping', () => {console.log(colors.FgYellow + 'got a ping' + colors.Reset); start = Date.now()})
    connection.on("message", message => {
        counter+=1
        jsonData = JSON.parse(message.utf8Data);
        Ax = (kf.filter(jsonData.Ax, 1)/AccelScaleFactor).toFixed(4); Ay = (kf.filter(jsonData.Ay, 1)/AccelScaleFactor).toFixed(4); Az = (kf.filter(jsonData.Az, 1)/AccelScaleFactor).toFixed(4);
        Gx = (kf.filter(jsonData.Gx, 1)/GyroScaleFactor).toFixed(4); Gy = (kf.filter(jsonData.Gy, 1)/GyroScaleFactor).toFixed(4); Gz = (kf.filter(jsonData.Gz, 1)/GyroScaleFactor).toFixed(4);
        
        console.log(`Ax: ${Ax}g Ay: ${Ay}g Az: ${Az}g Gx: ${Gx}°/s Gy: ${Gy}°/s Gz: ${Gz}°/s`)
    })
   //sendevery5seconds();
})

var elapsed_time = () => {
    var elapsed = Date.now() - start
    return elapsed;
}

process.on("SIGINT", () => {
    let finishTime = elapsed_time();
  console.log(`${colors.FgGreen}Recieved ${counter} messages in ${finishTime}ms, avg ms/msg:${(finishTime/counter).toFixed(4)}`);
  process.exit();
} );

function sendevery5seconds(){
    connection.send(`Message ${Math.random(10)}\n`);
    setTimeout(sendevery5seconds, 5000);
}