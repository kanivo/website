const images = []; 
const audio = document.getElementById('audioPlayer');

const imageList = [
    'assets/stunnerC.png',
    'assets/sandwichStunna.png',
    'assets/von.png',
    'assets/kittyDriving.png',
    'assets/banana.png',
    'assets/ghostStunna.jpg',
    'assets/bigStunner.png'
];

function createImage(initialX = 0, initialY = 100, randomImage = true) {
    const image = document.createElement('img');

    if (randomImage) {
        const randomIndex = Math.floor(Math.random() * imageList.length);
        image.src = imageList[randomIndex];
    } else {
        image.src = 'assets/stunnerC.png'; 
    }

    image.className = 'moving-image';
    document.body.appendChild(image);

    const speedX = (Math.random() * 200) + 100; 
    const speedY = (Math.random() * 200) + 100;

    images.push({
        element: image,
        posX: initialX,
        posY: initialY,
        speedX: speedX * (Math.random() < 0.5 ? 1 : -1),
        speedY: speedY * (Math.random() < 0.5 ? 1 : -1)
    });
}

createImage(0, 100, false);

let lastTimestamp = null;

function moveImages(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000; 
    lastTimestamp = timestamp;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    images.forEach(imgObj => {
        const { element } = imgObj;

        const imageWidth = element.offsetWidth;
        const imageHeight = element.offsetHeight;

        imgObj.posX += imgObj.speedX * deltaTime;
        imgObj.posY += imgObj.speedY * deltaTime;

        if (imgObj.posX + imageWidth >= windowWidth || imgObj.posX <= 0) {
            imgObj.speedX = -imgObj.speedX;
            imgObj.posX = Math.max(0, Math.min(imgObj.posX, windowWidth - imageWidth));
        }

        if (imgObj.posY + imageHeight >= windowHeight || imgObj.posY <= 0) {
            imgObj.speedY = -imgObj.speedY;
            imgObj.posY = Math.max(0, Math.min(imgObj.posY, windowHeight - imageHeight));
        }

        element.style.left = imgObj.posX + 'px';
        element.style.top = imgObj.posY + 'px';
    });

    requestAnimationFrame(moveImages);
}

requestAnimationFrame(moveImages);

document.getElementById('addImageButton').addEventListener('click', () => {
    const randomX = Math.random() * (window.innerWidth - 200);
    const randomY = Math.random() * (window.innerHeight - 200);
    createImage(randomX, randomY);
});

document.getElementById('removeImageButton').addEventListener('click', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => img.remove());
});

document.getElementById("audioPlayer").load();

function sendMessage() {
const messageInput = document.getElementById('messageInput');
const statusMessage = document.getElementById('statusMessage');
const submitButton = document.querySelector('button[onclick="sendMessage()"]');

const message = messageInput.value.trim();

if (!message) {
statusMessage.innerText = "Please enter a message!";
return;
}

submitButton.disabled = true;
submitButton.innerText = "Sending...";

fetch('https://website-backend-st4f.onrender.com/submit-message', {  
method: 'POST',
body: JSON.stringify({ message: message }),
headers: {
    'Content-Type': 'application/json',
},
})
.then(response => response.json())
.then(data => {
if (data.success) {
    statusMessage.innerText = "Message sent successfully!";
    messageInput.value = ""; 
} else {
    statusMessage.innerText = "Failed to send message.";
}
})
.catch(error => {
console.error('Error:', error);
statusMessage.innerText = "An error occurred.";
})
.finally(() => {
submitButton.disabled = false;
submitButton.innerText = "Submit";
});
}