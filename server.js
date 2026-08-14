const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('🔗 ¡Un dispositivo se ha conectado!');

    ws.on('message', (message) => {
        console.log('🎹 Mensaje MIDI recibido en el servidor:', message.toString());
        
        // Reenviar a todos los clientes conectados
        let count = 0;
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message);
                count++;
            }
        });
        console.log(`🚀 Reenviado a ${count} dispositivo(s)`);
    });

    ws.on('close', () => {
        console.log('❌ Un dispositivo se ha desconectado.');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
