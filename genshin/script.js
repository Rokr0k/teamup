const genshin_wish = document.getElementById("genshin-wish");
const genshin_chang = document.getElementById("genshin-chang");
const genshin_bgs = document.getElementById("genshin-bgs");

window.addEventListener("keydown", e => {
    if (genshin_bgs.getAttribute("hidden") === null && e.code === "Enter") {
        ii++;
        genshin_iterate();
    }
});
window.addEventListener("mousedown", () => {
    if (genshin_bgs.getAttribute("hidden") === null) {
        ii++;
        genshin_iterate();
    }
});

const genshin_iterate = () => {
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
        previousTeam = document.createElement("div");
        previousTeam.setAttribute("class", "genshin-iter");
        previousTeam.setAttribute("style", "animation-name: genshin-show; animation-duration: 1.4s;");
        const grid = document.createElement("div");
        previousTeam.appendChild(grid);
        for (let i = 0; i < tee[ii].length; i++) {
            const child = document.createElement("p");
            child.innerHTML = tee[ii][i];
            grid.appendChild(child);
        }
        genshin_bgs.appendChild(previousTeam);
        previousIndex = document.createElement("div");
        previousIndex.setAttribute("class", "genshin-indx");
        previousIndex.setAttribute("style", "animation-name: appear; animation-duration: 0.28s; animation-delay: 1.12s; opacity: 0%;");
        previousIndex.innerHTML = ii + 1;
        genshin_bgs.appendChild(previousIndex);
        previousTimeout = setTimeout(e => {
            e.style.opacity = "100%";
            previousTimeout = 0;
        }, 1260, previousIndex);
        genshin_chang.currentTime = 0;
        genshin_chang.play();
    }
    else {
        genshin_bgs.setAttribute("hidden", "");
        work(tee);
        run.disabled = false;
    }
}

genshin_wish.addEventListener("ended", () => {
    genshin_wish.setAttribute("hidden", "");
    roll().then(teams => {
        tee = teams;
        ii = 0;
        genshin_bgs.removeAttribute("hidden");
        genshin_iterate();
    });
});