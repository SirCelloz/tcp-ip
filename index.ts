import net from 'net';
import WebSocket from 'ws';

const command: { [key: string]: string } = {
    'RELAY,GREEN,1': 'GREEN 1',
    'RELAY,GREEN,0': 'GREEN 0',
    'RELAY,YELLOW,1': 'YELLOW 1',
    'RELAY,YELLOW,0': 'YELLOW 0',
    'RELAY,RED,1': 'RED 1',
    'RELAY,RED,0': 'RED 0',
    'REBOOT': 'REBOOT',
};

const controlLights = (color: string, action: string) => {
    console.log(`${action} ${color}`);
    return { color, action }; // Return the color and action to send to WebSocket clients
};

const rebootLights = (socket: net.Socket, ws: WebSocket) => {
    const lights = ['GREEN', 'YELLOW', 'RED'];

    // Turn off all lights
    lights.forEach(light => {
        const result = controlLights(light, 'OFF');
        ws.send(JSON.stringify(result));
    });

    socket.write('All lights off\n');

    // Sequentially turn on and off each light
    let index = 0;
    const interval = setInterval(() => {
        if (index < lights.length) {
            const light = lights[index];
            ws.send(JSON.stringify(controlLights(light, 'ON')));
            setTimeout(() => {
                ws.send(JSON.stringify(controlLights(light, 'OFF')));
                index++;
            }, 1000);
        } else {
            clearInterval(interval);
        }
    }, 2000);
};

/* const createServer = () => {
    const wss = new WebSocket.Server({ port: 3002 });

    wss.on('connection', ws => {
        const server = net.createServer(socket => {
            socket.on('data', data => {
                const keys = data.toString().trim().split(/(?=RELAY|REBOOT)/);
                console.log(`Received data: ${data.toString()}`);

                keys.forEach(key => {
                    const trimmedKey = key.trim();
                    if (command[trimmedKey]) {
                        if (trimmedKey === 'REBOOT') {
                            rebootLights(socket, ws);
                        } else {
                            const [_, color, action] = trimmedKey.split(',');
                            const result = controlLights(color, action === '1' ? 'ON' : 'OFF');
                            ws.send(JSON.stringify(result));
                            socket.write(command[trimmedKey] + '\n');
                        }
                    } else {
                        socket.write('Command not found\n');
                    }
                });
            });
        });

        server.listen(3001, '127.0.0.1', () => {
            console.log(`TCP Running at port 3001`);
        });

        console.log('test')
    });
};

createServer();
 */

const createsServer = () => {
    const wss = new WebSocket.Server({ port: 3002 });

    wss.on('connection', ws => {
        const server = net.createServer(socket => {
            socket.on('data', data => {
                const keys = data.toString().trim().split(/(?=RELAY|REBOOT)/);
                console.log(`Received data: ${data.toString()}`);

                keys.forEach(key => {
                    const trimmedKey = key.trim();
                    if (command[trimmedKey]) {
                        if (trimmedKey === 'REBOOT') {
                            rebootLights(socket, ws);
                        } else {
                            const [_, color, action] = trimmedKey.split(',');
                            const result = controlLights(color, action === '1' ? 'ON' : 'OFF');
                            ws.send(JSON.stringify(result));
                            socket.write(command[trimmedKey] + '\n');
                        }
                    } else {
                        socket.write('Command not found\n');
                    }
                });
            });
        });

        server.listen(3001, '127.0.0.1', () => {
            console.log(`TCP Running at port 3001`);
        });

        console.log('test')
    });
}

createsServer()