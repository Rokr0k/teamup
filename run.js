var start = document.getElementById("start");
var length = document.getElementById("length");
var except = document.getElementById("except");
var count = document.getElementById("count");
var run = document.getElementById("run");
var container = document.getElementById("container");

run.addEventListener("click", () => {
    var array = new Array();
    var exceptions = except.value.split(" ").map(v => +v).filter(v => typeof (v) == "number");
    for (var i = +start.value; i < +start.value + +length.value; i++) {
        var done = false;
        for (var j = 0; j < exceptions.length; j++) {
            if (i == exceptions[j]) {
                done = true;
                break;
            }
        }
        if (!done) {
            array.push(i);
        }
    }
    var teams = new Array(+count.value);
    for (var i = 0; i < +count.value; i++) {
        teams[i] = new Array();
    }
    var team = 0;
    while (array.length > 0) {
        var index = Math.floor(Math.random() * array.length);
        teams[team].push(array[index]);
        team = (team + 1) % (+count.value);
        array.splice(index, 1);
    }
    for (var i = 0; i < teams.length; i++) {
        teams[i] = teams[i].sort((a, b) => a - b);
    }
    container.innerHTML = "";
    for (var i = 0; i < teams.length; i++) {
        var element = "<div class=\"item\">";
        for (var j = 0; j < teams[i].length; j++) {
            if (j == 0) {
                element = element.concat(teams[i][j]);
            }
            else {
                element = element.concat(", " + teams[i][j]);
            }
        }
        container.innerHTML = container.innerHTML.concat(element).concat("</div>");
    }
});