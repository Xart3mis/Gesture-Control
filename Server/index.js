const http = require("http");
const WebSocketServer = require("websocket").server
const colors = require('./colors')
let connection = null;

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
    connection.on('ping', ()=> console.log(colors.FgYellow+'got a ping'+colors.Reset))
    connection.on("message", message => {
        console.log(`${colors.BgWhite+colors.FgBlack}Received message: ${message.utf8Data} ${colors.Reset}`)
        connection.send(`got your message: ${message.utf8Data}`)
    })


   //sendevery5seconds();
})
 
function sendevery5seconds(){
    connection.send(`Message ${Math.random(10)}\n`);
    setTimeout(sendevery5seconds, 5000);
}