const express = require('express')
const http = require('http')
const pty = require('node-pty')
const app = express();
const {Server:socketServer} = require('socket.io');
const server = http.createServer(app);
var ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd:   process.env.INIT_CWD,
    env: process.env
  });
const io = new socketServer({
    cors:'*'
})

io.attach(server)
ptyProcess.onData(data => {
    io.emit('terminal:data', data)
})


io.on('connection',(socket)=>{
    console.log("socket connected with id : ",socket.id)

    socket.on('terminal:write',(data)=>{
        ptyProcess.write(data)
    })
})



server.listen(3000,()=>console.log("docker server running on port 3000"))
