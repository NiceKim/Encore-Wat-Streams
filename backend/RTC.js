const https = require('https');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const roomViewers = new Map();
const roomReactions = new Map();

function getRoomStats(roomId) {
    if (!roomViewers.has(roomId)) {
        return {
            roomId,
            viewerCount: 0,
            viewers: [],
            reactionCount: 0
        };
    }

    const viewers = Array.from(roomViewers.get(roomId).values()).map(viewer => ({
        nickname: viewer.nickname,
        joinTime: viewer.joinTime
    }));

    return {
        roomId,
        viewerCount: viewers.length,
        viewers,
        reactionCount: roomReactions.get(roomId) || 0
    };
}

function initializeRTC(app) {
    const options = {
        key: fs.readFileSync(path.join(__dirname, '../cert/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../cert/cert.pem'))
    };

    const httpsServer = https.createServer(options, app);
    const wsServer = new Server(httpsServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    wsServer.on('connection', (socket) => {
        socket.on('join-room', ({ room, nickname }) => {
            socket.join(room);
            
            if (!roomViewers.has(room)) {
                roomViewers.set(room, new Map());
                roomReactions.set(room, 0);
            }
            roomViewers.get(room).set(socket.id, {
                nickname,
                joinTime: new Date().toLocaleString()
            });

            socket.to(room).emit('peer-joined');
            console.log(`${nickname} joined room ${room}`);
        });

        socket.on('offer', (offer, room) => {
            socket.to(room).emit('offer', offer, room);
        });

        socket.on('answer', (answer, room) => {
            socket.to(room).emit('answer', answer);
            console.log('sent answer', new Date().toISOString());
        });
        
        socket.on('ice', (ice, room) => {
            socket.to(room).emit('ice', ice);
        });
        
        socket.on('reaction', (reactionData, room) => {
            const currentCount = roomReactions.get(room) || 0;
            roomReactions.set(room, currentCount + 1);
            
            socket.to(room).emit('reaction', reactionData);
        });
    
        socket.on('disconnect', () => {
            for (const [roomId, viewers] of roomViewers.entries()) {
                if (viewers.has(socket.id)) {
                    viewers.delete(socket.id);
                    if (viewers.size === 0) {
                        roomViewers.delete(roomId);
                        roomReactions.delete(roomId);
                    }
                }
            }
        });
    });

    return httpsServer;
}

module.exports = {
    initializeRTC,
    getRoomStats
};