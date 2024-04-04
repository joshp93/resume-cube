let initialState;
let animating = false;
const box = document.getElementById("box");
const boxContainer = document.getElementById("box-container");

initialBoxAnimation();

function initialBoxAnimation() {
    box.style.transform = "rotateX(0deg) rotateY(0deg)";
    box.style.transition = "transform 2s";
    box.style.transform = "rotateX(-20deg) rotateY(20deg) translateY(0px)";

    setTimeout(() => {
        box.style.transition = "";
    }, 2000);
}

function dragStart(ev) {
    let img = document.createElement("img");
    img.src = "assets/nope.png";
    ev.dataTransfer.setDragImage(img, 0, 0);
    if (animating) {
        return;
    }
    initialState = getBoxState(ev);
}

function drag(ev) {
    if (animating || !initialState || ev.screenX === 0 && ev.screenY === 0) {
        return;
    }
    ev.preventDefault();
    updateBoxRotation(ev.pageX, ev.pageY);
}

function updateBoxRotation(x, y) {
    const newX = ((y - initialState.pageY) / window.innerHeight * 360) * -1;
    const newY = (x - initialState.pageX) / window.innerWidth * 360;
    box.style.transform = `rotateX(${initialState.x + newX}deg) rotateY(${initialState.y + newY}deg)`;
}

function getBoxState(ev) {
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

function spin() {
    animating = true;
    const transform = box.style.transform;
    if (transform !== "rotateX(-20deg) rotateY(20deg) translateY(0px)") {
        box.style.transition = "transform 1s";
        box.style.transform = "rotateX(-20deg) rotateY(20deg) translateY(0px)";
        setTimeout(() => {
            makeItSpin();
        }, 1000);
    } else {
        makeItSpin();
    }
}

function makeItSpin() {
    box.style.transition = "";

    box.classList.add("spin");
    boxContainer.classList.add("perspective-shift");
    setTimeout(() => {
        box.classList.remove("spin");
        boxContainer.classList.remove("perspective-shift");
        animating = false;
    }, 5000);
}
