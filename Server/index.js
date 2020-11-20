const http = require("http");
const WebSocketServer = require("websocket").server
const colors = require('./colors')
let connection = null;
let counter = 0;
let avgCounter = 0;
let AvgTimerCounter = 0;
var start;
let Ax, Ay, Az, Gx, Gy, Gz = undefined;
let Ax2, Ay2, Az2, Gx2, Gy2, Gz2 = undefined;
let Ax3, Ay3, Az3, Gx3, Gy3, Gz3 = undefined;
let fAx, fAy, fAz, fGx, fGy, fGz = undefined;
const AccelScaleFactor = 16384;
const GyroScaleFactor = 131;
const httpserver = http.createServer((req, res) => 
                console.log(`${colors.Hidden}we have received a request${colors.Reset}`))

const websocket = new WebSocketServer({
    "httpServer": httpserver
})


httpserver.listen(5000, () => console.log(`${colors.BgWhite+colors.FgGreen}\nMy server is listening on port 5000\nRunning on http://localhost:5000${colors.Reset}`))

const average = (x, y, z)=>{return ((x+y+z)/3)}
const resetTimernVars=()=>{avgCounter=0;Ax, Ay, Az, Gx, Gy, Gz, Ax2, Ay2, Az2, Gx2, Gy2, Gz2, Ax3, Ay3, Az3, Gx3, Gy3, Gz3 = undefined;}
websocket.on("request", request=> {
    connection = request.accept(null, request.origin)
    connection.on("close", () => console.log(`${colors.FgRed}Connection Closed${colors.Reset}`))
    connection.on("open", () => console.log(`${colors.FgGreen}Connection Opened${colors.Reset}`))
    connection.on('ping', () => {console.log(colors.FgYellow + 'got a ping' + colors.Reset); start = Date.now()})
    connection.on("message", message => {
        if(avgCounter==3){
            resetTimernVars();
            console.log (`Ax:${fAx}g  Ay:${fAy}g  Az${fAz}g Gx:${fGx}°/s  Gy:${fGy}°/s  Gz:${fGz}°/s`);
            fAx=(average(Ax, Ax2, Ax3)/AccelScaleFactor).toFixed(8);fAy=(average(Ay, Ay2, Ay3)/AccelScaleFactor).toFixed(8);fAz=(average(Az, Az2, Az3)/AccelScaleFactor).toFixed(8);
            fGx=(average(Gx, Gx2, Gx3)/GyroScaleFactor).toFixed(8);fGy=(average(Gy, Gy2, Gy3)/GyroScaleFactor).toFixed(8);fGz=(average(Gz, Gz2, Gz3)/GyroScaleFactor).toFixed(8);
            AvgTimerCounter += 1;
        }
        RawJson = JSON.parse(message.utf8Data)        
        if(Ax==undefined||Ay==undefined||Az==undefined||Gx==undefined||Gy==undefined||Gz==undefined){Ax=RawJson.Ax;Ay=RawJson.Ay;Az=RawJson.Az; Gx=RawJson.Gx;Gy=RawJson.Gy;Gz=RawJson.Gz;}
        if(Ax2==undefined||Ay2==undefined||Az2==undefined||Gx2==undefined||Gy2==undefined||Gz2==undefined){Ax2=RawJson.Ax;Ay2=RawJson.Ay;Az2=RawJson.Az; Gx2=RawJson.Gx;Gy2=RawJson.Gy;Gz2=RawJson.Gz;}
        if(Ax3==undefined||Ay3==undefined||Az3==undefined||Gx3==undefined||Gy3==undefined||Gz3==undefined){Ax3=RawJson.Ax;Ay3=RawJson.Ay;Az3=RawJson.Az; Gx3=RawJson.Gx;Gy3=RawJson.Gy;Gz3=RawJson.Gz;}
        counter += 1
        avgCounter += 1
    })
   //sendevery5seconds();
})

var elapsed_time = () => {
    var elapsed = Date.now() - start
    return elapsed;
}

process.on("SIGINT", () => {
    let finishTime = elapsed_time();
  console.log(`${colors.FgGreen}Recieved ${counter} messages in ${finishTime}ms, avg ms/msg:${(finishTime/counter).toFixed(4)}\navg ms/msg smoothed & scaled data:${(finishTime/AvgTimerCounter.toFixed(4))}`);
  process.exit();
} );

function sendevery5seconds(){
    connection.send(`Message ${Math.random(10)}\n`);
    setTimeout(sendevery5seconds, 5000);
}