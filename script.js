var start = document.getElementById("start");
const length = document.getElementById("length");
const except = document.getElementById("except");
const count = document.getElementById("count");
const run = document.getElementById("run");
const container = document.getElementById("container");
const wish = document.getElementById("wish");
const chang = document.getElementById("chang");
const animation = document.getElementById("animation");
const bgs = document.getElementById("bgs");

run.addEventListener("click", () => {
    if (animation.checked) {
        run.disabled = true;
        wish.removeAttribute("hidden");
        wish.play();
    }
    else {
        roll().then(teams => work(teams));
    }
});

wish.addEventListener("ended", () => {
    wish.setAttribute("hidden", "");
    roll().then(teams => {
        tee = teams;
        ii = 0;
        bgs.removeAttribute("hidden");
        iterate();
    });
});

function roll() {
    return new Promise(resolve => {
        const array = new Array();
        const exceptions = except.value.split(" ").map(v => +v).filter(v => typeof (v) == "number");
        for (let i = +start.value; i < +start.value + +length.value; i++) {
            let done = false;
            for (let j = 0; j < exceptions.length; j++) {
                if (i == exceptions[j]) {
                    done = true;
                    break;
                }
            }
            if (!done) {
                array.push(i);
            }
        }
        const teams = new Array(+count.value);
        for (let i = 0; i < +count.value; i++) {
            teams[i] = new Array();
        }
        let team = 0;
        while (array.length > 0) {
            const index = Math.floor(Math.random() * array.length);
            teams[team].push(array[index]);
            team = (team + 1) % (+count.value);
            array.splice(index, 1);
        }
        for (let i = 0; i < teams.length; i++) {
            teams[i] = teams[i].sort((a, b) => a - b);
        }
        resolve(teams);
    })
}

let tee = null;
let ii = 0;
let previousElement = null;

window.onkeydown = e => {
    if (bgs.getAttribute("hidden") === null && e.code === "Enter") {
        ii++;
        iterate();
    }
};
window.onmousedown = () => {
    if (bgs.getAttribute("hidden") === null) {
        ii++;
        iterate();
    }
};

function iterate() {
    if (previousElement) {
        previousElement.remove();
    }
    if (ii < tee.length) {
        previousElement = document.createElement("div");
        previousElement.setAttribute("class", "iter");
        previousElement.setAttribute("style", "animation-name: show; animation-duration: 1.4s;");
        for (let i = 0; i < tee[ii].length; i++) {
            var child = document.createElement("p");
            child.innerHTML = tee[ii][i];
            previousElement.appendChild(child);
        }
        bgs.appendChild(previousElement);
        chang.currentTime = 0;
        chang.play();
    }
    else {
        bgs.setAttribute("hidden", "");
        work(tee);
        run.disabled = false;
    }
}

function work(teams) {
    container.innerHTML = "";
    for (let i = 0; i < teams.length; i++) {
        const element = document.createElement("div");
        element.setAttribute("class", "item");
        if (animation.checked) {
            element.setAttribute("style", "animation-name: appear; animation-duration: 1s; animation-delay: " + i * 0.1 + "s; opacity: 0%;");
        }
        for (let j = 0; j < teams[i].length; j++) {
            var child = document.createElement("p");
            child.innerHTML = teams[i][j];
            element.appendChild(child);
        }
        if (animation.checked) {
            setTimeout(e => {
                e.style.opacity = "100%";
            }, i * 100 + 500, element);
        }
        container.appendChild(element);
    }
    if (animation.checked) {
        chang.play();
    }
}