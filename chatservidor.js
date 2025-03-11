const dgram = require('dgram');
const readline = require('readline');

const PORT = 41234;
const server = dgram.createSocket('udp4');
const clients = new Set();
const username = process.argv[2] || "Servidor";

server.on('listening', () => {
    const address = server.address();
    console.log(` Servidor iniciado en ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
    const message = msg.toString();
    console.log(` ${message}`);
    
    clients.add(`${rinfo.address}:${rinfo.port}`);

    clients.forEach(client => {
        const [ip, port] = client.split(':');
        if (ip !== rinfo.address || port !== rinfo.port) {
            server.send(message, port, ip);
        }
    });
});

server.bind(PORT);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

rl.prompt();
rl.on('line', (line) => {
    const timestamp = new Date().toLocaleTimeString();
    const message = `(${username}) [${timestamp}]: ${line.trim()}`;
    
    console.log(` Enviando: ${message}`);
    clients.forEach(client => {
        const [ip, port] = client.split(':');
        server.send(message, port, ip);
    });
    rl.prompt();
});
