const http = require("http");
const WebSocketServer = require("websocket").server
const colors = require('./colors')
let connection = null;
let counter = 0;
var start;

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
        RawJson = JSON.parse(message.utf8Data)
        //console.log(`${colors.BgWhite+colors.FgBlack}Received message: ${message.utf8Data} ${colors.Reset}`)
        //connection.send(`got your message: ${JSON.parse(message.utf8Data)}\n`)
        console.log (`Ax:${RawJson.Ax}  Ay:${RawJson.Ay}    Az${RawJson.Az}\nGx:${RawJson.Gx}   Gy:${RawJson.Gy}    Gz:${RawJson.Gz}`)
        counter += 1
    })
   //sendevery5seconds();
})

var elapsed_time = () => {
    var elapsed = Date.now() - start
    return elapsed;
}

process.on("SIGINT", () => {
    let finishTime = elapsed_time();
  console.log(`Recieved ${counter} messages in ${finishTime}ms, avg ms/msg:${(counter/finishTime).toFixed(4)}`);
  process.exit();
} );

function sendevery5seconds(){
    connection.send(`Message ${Math.random(10)}\n`);
    setTimeout(sendevery5seconds, 5000);
}