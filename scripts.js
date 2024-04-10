let initialState;
let animating = false;
const box = document.getElementById("box");
const boxContainer = document.getElementById("box-container");

const sideTransformations = {
    front: {
        x: 0,
        y: 0
    },
    back: {
        x: 0,
        y: 180
    },
    left: {
        x: 0,
        y: 90
    },
    right: {
        x: 0,
        y: -90
    },
    top: {
        x: -90,
        y: 0
    },
    bottom: {
        x: 90,
        y: 0
    }
};

box.addEventListener("touchstart", dragStart);
box.addEventListener("touchmove", drag);

initialBoxAnimation();

function initialBoxAnimation() {
    animating = true;
    setTimeout(() => {
        box.style.transform = "rotateX(0deg) rotateY(0deg)";
        box.style.transition = "transform 2s";
        box.style.transform = "rotateX(-20deg) rotateY(20deg) translateY(0px)";

        setTimeout(() => {
            box.style.transition = "";
            animating = false;
        }, 2000);
    }, 1000);
}

function dragStart(ev) {
    if (ev.type !== "touchstart") {
        let img = document.createElement("img");
        img.src = "assets/nope.png";
        ev.dataTransfer.setDragImage(img, 0, 0);
    }
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
    const pageXAndY = getPageXAndY(ev);
    updateBoxRotation(pageXAndY.pageX, pageXAndY.pageY);
}

function updateBoxRotation(x, y) {
    const newX = ((y - initialState.pageY) / window.innerHeight * 360) * -1;
    const newY = (x - initialState.pageX) / window.innerWidth * 360;
    box.style.transform = `rotateX(${initialState.x + newX}deg) rotateY(${initialState.y + newY}deg)`;
}

function getBoxState(ev) {
    const transform = box.style.transform;
    const pageXAndY = getPageXAndY(ev);
    if (!transform) {
        return {
            x: 0,
            y: 0,
            pageX: pageXAndY.pageX,
            pageY: pageXAndY.pageY
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
        pageX: pageXAndY.pageX,
        pageY: pageXAndY.pageY
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
        document.activeElement.blur();
        box.classList.remove("spin");
        boxContainer.classList.remove("perspective-shift");
        animating = false;
    }, 5000);
}

function getPageXAndY(ev) {
    let pageX = ev.pageX || 0;
    let pageY = ev.pageY || 0;
    if (ev.touches && ev.touches.length > 0) {
        pageX = ev.touches[0].pageX;
        pageY = ev.touches[0].pageY;
    }
    return {
        pageX,
        pageY
    }
}

function rotateIntoView(ev) {
    if (animating) {
        return;
    }
    animating = true;
    const side = findParentSide(ev.target);
    const sideName = side.classList[0];
    let transform = box.style.transform;
    box.style.transition = "transform 0.5s";

    transform = transform.replace(/rotateX\([\-0-9\.]+?deg\)/, `rotateX(${sideTransformations[sideName].x}deg)`);
    transform = transform.replace(/rotateY\([\-0-9\.]+?deg\)/, `rotateY(${sideTransformations[sideName].y}deg)`);
    box.style.transform = transform;
    setTimeout(() => {
        box.style.transition = ""
        animating = false;
    }, 500);
}

function findParentSide(target) {
    const sides = ["front", "back", "left", "right", "top", "bottom"];
    let result;
    while (!result) {
        sides.forEach(side => {
            if (target.classList.contains(side)) {
                result = target;
            }
        });
        if (!result) {
            target = target.parentElement;
        }
    }
    return result;
}