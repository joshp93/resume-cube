let initialState;
let timestamp;
let lastMouseX;
let lastMouseY;
let mouseSpeedX;
let mouseSpeedY;

document.body.addEventListener("mousemove", function (e) {
    if (timestamp === null) {
        timestamp = Date.now();
        lastMouseX = e.screenX;
        lastMouseY = e.screenY;
        return;
    }

    let now = Date.now();
    let dt = now - timestamp;
    let dx = e.screenX - lastMouseX;
    let dy = e.screenY - lastMouseY;
    mouseSpeedX = Math.round(dx / dt * 100);
    mouseSpeedY = Math.round(dy / dt * 100);
    timestamp = now;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
});

document.getElementById("box").style.transform = "rotateX(-15deg) rotateY(20deg)";

function dragStart(ev) {
    let img = document.createElement("img");
    img.src = "assets/nope.png";
    ev.dataTransfer.setDragImage(img, 0, 0);
    initialState = getBoxState(ev);
}

function drag(ev) {
    if (ev.screenX === 0 && ev.screenY === 0) {
        return;
    }
    ev.preventDefault();
    updateBoxRotation(ev.pageX, ev.pageY);
}

function updateBoxRotation(x, y) {
    const box = document.getElementById("box");
    const newX = ((y - initialState.pageY) / window.innerHeight * 360) * -1;
    const newY = (x - initialState.pageX) / window.innerWidth * 360;
    box.style.transform = `rotateX(${initialState.x + newX}deg) rotateY(${initialState.y + newY}deg)`;
}

function getBoxState(ev) {
    const box = document.getElementById("box");
    const transform = box.style.transform;
    if (!transform) {
        return {
            x: 0,
            y: 0,
            pageX: ev.pageX,
            pageY: ev.pageY
        };
    }
    const x = transform.split(" ")[0]
        .split('(')[1]
        .split(')')[0]
        .replace("deg", "");

    const y = transform.split(" ")[1]
        .split('(')[1]
        .split(')')[0]
        .replace("deg", "");
    return {
        x: parseFloat(x),
        y: parseFloat(y),
        pageX: ev.pageX,
        pageY: ev.pageY
    };
}