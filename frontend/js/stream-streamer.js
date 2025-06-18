const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const nickname = 'ADMIN'
const room = urlParams.get('id');

const API_BASE_URL = 'http://localhost:3000/api';

document.getElementById('nickname-display').textContent = `Welcome, ${nickname}!`;

if (!nickname || !room) {
    window.location.href = 'index.html';
}

const nickname_display = document.getElementById('nickname-display');
if (nickname_display) {
    nickname_display.innerHTML = nickname;
}

let myStream;
let muted = true;
let cameraOff = false;
let myPeerConnection;
let isStreaming = false;

const muteButton = document.getElementById('muteButton');
const cameraButton = document.getElementById('cameraButton');
const cameraSelect = document.getElementById('cameraSelect');
const audioSelect = document.getElementById('audioSelect');
const videoPlayer = document.getElementById('videoPlayer');

async function getMedia(cameraId, audioId) {    
    const initialConstraints = {
        audio: true,
        video: {facingMode: 'user'}
    }
    const deviceConstraints = {
        audio: audioId ?  { deviceId: {exact: audioId }} : true,
        video: cameraId ? { deviceId: {exact: cameraId}} : true
    }

    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            cameraId || audioId ? deviceConstraints : initialConstraints
        );
        videoPlayer.srcObject = myStream;
        if (muted) {
            myStream.getAudioTracks().forEach(track => track.enabled = false);
        }
    } catch (e) {
        console.log(e);
    }
}

async function getDevices(deviceType) {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const filteredDevices = devices.filter(device => device.kind === deviceType);
        const currentTrack = deviceType === 'videoinput' 
            ? myStream.getVideoTracks()[0]
            : myStream.getAudioTracks()[0];
        const selectElement = deviceType === 'videoinput' ? cameraSelect : audioSelect;

        // Clear existing options
        selectElement.innerHTML = '';
        
        filteredDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.innerText = device.label;
            if(currentTrack.label === device.label) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(`Error getting ${deviceType} devices:`, error);
    }
}

function handleMuteClick() {
    if (muted) {
        muteButton.innerText = 'mute';
        muted = false;
        
    } else {
        muteButton.innerText = 'unmute';
        muted = true;
    }
    myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
}

async function handleDeviceChange() {
    await getMedia(cameraSelect.value, audioSelect.value);
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const audioTrack = myStream.getAudioTracks()[0];
        const senders = myPeerConnection.getSenders();
        console.log(myPeerConnection.getSenders());
        const videoSender = senders.find(sender => sender.track?.kind === 'video');
        const audioSender = senders.find(sender => sender.track?.kind === 'audio');
        
        if (videoSender) {
            await videoSender.replaceTrack(videoTrack);
        }
        if (audioSender) {
            await audioSender.replaceTrack(audioTrack);
        }
    }
}

function handleCameraClick() {
    if(cameraOff) {
        cameraButton.innerText = 'camera off';
        cameraOff = false;
    } else {
        cameraButton.innerText = 'camera on';
        cameraOff = true;
    }
    myStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
    });
}

async function initStream() {
    await getMedia();
    getDevices('videoinput');
    getDevices('audioinput');
}

// RTC Code
socket.on('peer-joined', async () => {
    console.log('Peer joined the room:', room);
    const offer = await myPeerConnection.createOffer();
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
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
    console.log("SendingICE")
    socket.emit("ice", data.candidate, room);
}


// Event Listeners
muteButton.addEventListener('click', handleMuteClick);
cameraButton.addEventListener('click', handleCameraClick);
cameraSelect.addEventListener('change', handleDeviceChange);
audioSelect.addEventListener('change', handleDeviceChange);

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

async function updateStreamingStatus(streamingState) {
    
    const response = await fetch(`${API_BASE_URL}/streams/${room}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ streamingState: streamingState })
    });

    if (!response.ok) {
        throw new Error('Streaming status update failed');
    }
}

async function manageStream(){
    try {
        if (isStreaming){
            await updateStreamingStatus(false);
            myPeerConnection.close();
            isStreaming = false;
            startButton.innerText = 'Start Streaming';
        } else {
            await updateStreamingStatus(true);
            await startStreaming();
            startButton.innerText = 'Stop Streaming';
            isStreaming = true;
        }
    } catch (error) {
        console.error('Error during changing streaming status:', error);
        alert('Error during changing streaming status.');
        
        // Rollback
        isStreaming = !isStreaming;
        startButton.innerText = isStreaming ? 'Stop Streaming' : 'Start Streaming';
    }
}

initStream();
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', manageStream);