const dgram = require('dgram');
const readline = require('readline');

const PORT = 41234;
const SERVER_IP = process.argv[2]; 
const username = process.argv[3] || "Anónimo";

if (!SERVER_IP) {
    console.log(" Uso: node chat_client.js <IP_DEL_SERVIDOR> <TuNombre>");
    process.exit(1);
}

const socket = dgram.createSocket('udp4');

socket.on('message', (msg) => {
    console.log(`\n ${msg.toString()}`);
    rl.prompt(true);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

rl.prompt();
rl.on('line', (line) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = `(${username}) [${timestamp}]: ${line.trim()}`;
    
    console.log(`Enviando: ${message}`);
    socket.send(message, PORT, SERVER_IP);
    rl.prompt();
});
