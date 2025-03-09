const dgram = require('dgram');
const readline = require('readline');
const os = require('os');

const PORT = 5000;
const BROADCAST_ADDR = '255.255.255.255';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const username = process.argv[2] || 'Anónimo';
const socket = dgram.createSocket('udp4');

console.log(`Iniciando chat en el puerto ${PORT}...`);

// el broadcast ese 
socket.bind(PORT, () => {
    socket.setBroadcast(true);
    console.log(`Chat en red local iniciado. Usuario: ${username}`);
}).on("error", (err) => {
    console.error("Error al enlazar el socket:", err);
});

socket.on('message', (msg, rinfo) => {
    console.log(`Mensaje recibido desde ${rinfo.address}:${rinfo.port}`);
    const message = msg.toString();
    if (!message.includes(username)) {
        console.log(`\n${message}`);
        rl.prompt(true);
    }
});

const getLocalIP = () => {
    console.log("Obteniendo dirección IP local...");
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const details of iface) {
            if (details.family === 'IPv4' && !details.internal) {
                console.log(`Dirección IP detectada: ${details.address}`);
                return details.address;
            }
        }
    }
    console.log("No se pudo detectar la dirección IP local, usando 127.0.0.1");
    return '127.0.0.1';
};

const sendMessage = (message) => {
    if (!message) {
        console.log("Mensaje vacío, no se enviará.");
        return;
    }
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `(${username}) [${timestamp}]: ${message}`;
    console.log(`Enviando mensaje: ${formattedMessage}`);
    const bufferMessage = Buffer.from(formattedMessage, 'utf-8');
    socket.send(bufferMessage, 0, bufferMessage.length, PORT, BROADCAST_ADDR, (err) => {
            if (err) {
            console.error("Error al enviar el mensaje:", err);
        }
    });
};

rl.setPrompt('> ');
rl.prompt();
rl.on('line', (line) => {
    sendMessage(line.trim());
    rl.prompt();
});
