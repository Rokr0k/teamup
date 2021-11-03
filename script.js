var start = document.getElementById("start");
const length = document.getElementById("length");
const except = document.getElementById("except");
const count = document.getElementById("count");
const run = document.getElementById("run");
const save = document.getElementById("save");
const container = document.getElementById("container");

let teamsObj = null;

run.addEventListener("click", () => {
    if (animation.checked) {
        run.disabled = true;
        genshin_wish.removeAttribute("hidden");
        genshin_wish.play();
    }
    else {
        roll().then(teams => work(teams));
    }
});

const roll = () => {
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

const work = (teams) => {
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
        genshin_chang.play();
    }
    teamsObj = teams;
}

save.onclick = () => {
    if (teamsObj) {
        const keys = Object.keys(teamsObj);
        const content = [...teamsObj.map(row => keys.map(i => JSON.stringify(row[i], (_key, value) => value == undefined ? '' : value)).join(','))].join('\r\n');
        const blob = new Blob([content], { type: 'text/csv' });
        const anchor = document.createElement("a");
        anchor.download = "teams.csv";
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
    }
}