const urlParams = new URLSearchParams(window.location.search);
const nickname = 'you';
const room = urlParams.get('id');

if (!room) {
    window.location.href = 'index.html';
}

const nickname_display = document.getElementById('nickname-display');
if (nickname_display) {
    nickname_display.innerHTML = nickname;
}

const socket = io();
let myPeerConnection;

// RTC Code
socket.on('peer-joined', async () => {
    console.log('Peer joined the room:', room);
    const offer = await myPeerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    });
    myPeerConnection.setLocalDescription(offer);
    console.log('Created and set local description');
    socket.emit('offer', offer, room);
    console.log('sent offer ', new Date().toISOString());
});

socket.on('offer', async(offer, room) => {
    console.log('Received offer for room:', room);
    console.log('Offer:', offer);
    try {
        await myPeerConnection.setRemoteDescription(offer);
        console.log('Set remote description successfully');
        const answer = await myPeerConnection.createAnswer();
        await myPeerConnection.setLocalDescription(answer);
        socket.emit('answer', answer, room);
        console.log('sent answer');
    } catch (error) {
        console.error('Error in offer handling:', error);
    }
});

socket.on('answer', async(answer) => {
    console.log('received answer');
    await myPeerConnection.setRemoteDescription(answer);
});

socket.on('ice', async (ice) => {    
    await myPeerConnection.addIceCandidate(ice);
    console.log('received ice candidate', new Date().toISOString());
})

function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                ],
            },
        ],
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("track", handleTrack);
}

function handleIce(data) {
    console.log("SendingICE")
    socket.emit("ice", data.candidate, room);
}

function handleTrack(data) {
    const peerVideo = document.getElementById("peer-video");
    peerVideo.srcObject = data.streams[0];
}

// Reaction Code
document.querySelectorAll('.emoji-button').forEach(button => {
    button.addEventListener('click', () => {
        const emoji = button.dataset.emoji;
        const reactionData = {
            emoji,
            nickname
        };
        addReactionToBox(reactionData);
        socket.emit('reaction', reactionData, room);
    });
});

function addReactionToBox(reactionData) {
    const reactionBox = document.getElementById('reaction-box');
    const reactionItem = document.createElement('div');
    reactionItem.className = 'reaction-item';
    reactionItem.textContent = `${reactionData.nickname}: ${reactionData.emoji}`;
    reactionBox.appendChild(reactionItem);

    setTimeout(() => {
        reactionItem.remove();
    }, 3000);
}

socket.on('reaction', (reactionData) => {
    addReactionToBox(reactionData);
});

// Start
async function startStreaming() {
    await makeConnection();
    socket.emit('join-room', { room, nickname });
}
startStreaming();
