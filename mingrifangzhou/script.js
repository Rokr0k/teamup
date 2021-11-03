const mingrifangzhou_gacha = document.getElementById("mingrifangzhou-gacha");
const mingrifangzhou_shaaaa = document.getElementById("mingrifangzhou-shaaaa");
const mingrifangzhou_bgs = document.getElementById("mingrifangzhou-bgs");

window.addEventListener("keydown", e => {
    if (mingrifangzhou_bgs.getAttribute("hidden") === null && e.code === "Enter") {
        ii++;
        mingrifangzhou_iterate();
    }
});
window.addEventListener("mousedown", () => {
    if (mingrifangzhou_bgs.getAttribute("hidden") === null) {
        ii++;
        mingrifangzhou_iterate();
    }
});

const mingrifangzhou_iterate = () => {
    if (previousTeam) {
        previousTeam.remove();
    }
    if (previousIndex) {
        previousIndex.remove();
    }
    if (previousTimeout) {
        clearTimeout(previousTimeout);
    }
    if (ii < tee.length) {
        mingrifangzhou_bgs.removeAttribute("style");
        void mingrifangzhou_bgs.offsetWidth;
        mingrifangzhou_bgs.setAttribute("style", "animation-name: mingrifangzhou-show; animation-duration: 1.9s;");
        previousTeam = document.createElement("div");
        previousTeam.setAttribute("class", "mingrifangzhou-iter");
        const grid = document.createElement("div");
        previousTeam.appendChild(grid);
        for (let i = 0; i < tee[ii].length; i++) {
            const child = document.createElement("p");
            child.innerHTML = tee[ii][i];
            child.setAttribute("style", "animation-name: mingrifangzhou-child; animation-duration: 1.9s;");
            grid.appendChild(child);
        }
        mingrifangzhou_bgs.appendChild(previousTeam);
        mingrifangzhou_shaaaa.currentTime = 0;
        mingrifangzhou_shaaaa.play();
    }
    else {
        mingrifangzhou_bgs.setAttribute("hidden", "");
        work(tee);
        run.disabled = false;
    }
}

mingrifangzhou_gacha.addEventListener("ended", () => {
    mingrifangzhou_gacha.setAttribute("hidden", "");
    roll().then(teams => {
        tee = teams;
        ii = 0;
        mingrifangzhou_bgs.removeAttribute("hidden");
        mingrifangzhou_iterate();
    });
});