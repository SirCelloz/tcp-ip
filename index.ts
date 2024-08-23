import net from 'net';

const command: { [key: string]: string } = {
    'RELAY,GREEN,1': 'GREEN 1',
    'RELAY,GREEN,0': 'GREEN 0',
    'RELAY,YELLOW,1': 'YELLOW 1',
    'RELAY,YELLOW,0': 'YELLOW 0',
    'RELAY,RED,1': 'RED 1',
    'RELAY,RED,0': 'RED 0',
};

const createServer = () => {
    const server = net.createServer(socket => {
        socket.on('data', data => {
            const keys = data.toString().trim().split(/(?=RELAY)/)
            console.log(`Received data: ${data.toString()}`);

            keys.forEach(key => {
                const trimmedKey = key.trim();
                if (command[trimmedKey]) {
                    socket.write(command[trimmedKey]);
                } else {
                    socket.write('Command not found');
                }
            });
        });
    });

    server.listen(3001, '127.0.0.1', () => {
        console.log(`TCP Running at port 3001`);
    });
}

createServer();