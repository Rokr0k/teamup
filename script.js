'use strict';

/** @typedef {{name: string, score: number}} Member */
/** @typedef {{members: number[], score: number}} Team */

const lengthInput = document.querySelector('#length');
const exceptInput = document.querySelector('#except');
const countInput = document.querySelector('#count');
const runInput = document.querySelector('#run');
const updateInput = document.querySelector('#update');
const saveInput = document.querySelector('#save');
const membersInput = document.querySelector('#members');
const tableElement = document.querySelector('#score-table tbody');
const containerElement = document.querySelector('#container');

/** @type {{[key: number]: Member}} */
const membersData = {};
/** @type {Team[]?} */
let teams = null;

runInput.addEventListener('click', () => roll());

updateInput.addEventListener('click', () => {
    if (!teams) {
        return;
    }

    const maxScore = Math.max(...teams.map(team => team.score));
    if (maxScore == 0) {
        alert('점수가 없음.');
        return;
    }

    const maxTeams = [...teams.keys()].filter(team => teams[team].score >= maxScore);
    if (confirm(`${maxTeams.map(team => team + 1).join(', ')} 팀에 1점 증가`)) {
        maxTeams.map(team => teams[team].members).reduce((members, member) => [...members, ...member], []).forEach(member => {
            if (membersData[member]) {
                membersData[member].score++;
            }
        });
        updateMembers();
    }
});

/**
 * Generate teams and update
 */
function roll() {
    const length = +lengthInput.value;
    const exceptions = exceptInput.value.split(' ').map(v => +v).filter(v => typeof (v) == 'number');
    const array = [...new Array(length).keys()].map(i => i + 1).filter(i => !exceptions.includes(i));
    teams = new Array(+countInput.value).fill(0).map(() => ({ members: new Array(), score: 0 }));
    let team = 0;
    while (array.length > 0) {
        const index = Math.floor(Math.random() * array.length);
        teams[team].members.push(...array.splice(index, 1));
        team = (team + 1) % +countInput.value;
    }
    teams.forEach(team => team.members.sort((a, b) => a - b));
    updateTeams();
}

/**
 * Update teams display
 */
function updateTeams() {
    containerElement.innerHTML = '';
    teams.forEach(team => {
        const element = document.createElement('div');
        element.classList.add('item');

        const members = document.createElement('div');
        members.classList.add('members');
        team.members.forEach(member => {
            const child = document.createElement('p');
            child.innerHTML = membersData[member] ? membersData[member].name : member;
            members.appendChild(child);
        });
        element.appendChild(members);

        const controls = document.createElement('div');
        controls.classList.add('score-controls');
        const scoreUp = document.createElement('button');
        scoreUp.classList.add('input', 'button');
        scoreUp.innerHTML = '&#65291;';
        scoreUp.addEventListener('click', () => {
            team.score++;
            updateTeams(teams);
        });
        const scoreDown = document.createElement('button');
        scoreDown.classList.add('input', 'button');
        scoreDown.innerHTML = '&#65293;';
        scoreDown.addEventListener('click', () => {
            if (team.score > 0) {
                team.score--;
                updateTeams(teams);
            }
        });
        controls.appendChild(scoreUp);
        controls.appendChild(scoreDown);
        element.appendChild(controls);

        const score = document.createElement('div');
        score.classList.add('score-display');
        score.innerHTML = new Array(team.score).fill('&#10026;').join('');
        element.appendChild(score);

        containerElement.appendChild(element);
    });
    teams = teams;
}

/**
 * Update members display
 */
function updateMembers() {
    tableElement.innerHTML = Object.values(membersData).map(member => `<tr><td>${member.name}</td><td>${member.score}</td></tr>`).join('');
}

membersInput.addEventListener('change', () => {
    Object.keys(membersData).forEach(key => delete membersData[key]);
    const file = membersInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const data = reader.result.split(/\r?\n/g).map(line => line.split(/[,;\t]/g).map(a => a.trim())).filter(data => data[0].length > 0).map(data => ({ name: data[0], score: +data[1] || 0 }));
            lengthInput.value = data.length;
            data.forEach((data, i) => membersData[i + 1] = data);
            updateMembers();
            if (teams) {
                updateTeams();
            }
        });
        reader.readAsText(file);
    }
});

saveInput.addEventListener('click', () => {
    const content = Object.values(membersData).map(member => `${member.name},${member.score}`).join('\r\n');
    if (showSaveFilePicker) {
        showSaveFilePicker({
            excludeAcceptAllOption: true,
            suggestedName: 'members.csv',
            types: [
                {
                    description: 'CSV file',
                    accept: { 'text/csv': ['.csv'] }
                }
            ]
        }).then(handler => handler.createWritable()).then(writable => writable.write(content).then(() => writable.close())).catch(() => { });
    } else {
        const blob = new Blob([content], { type: 'text/csv' });
        const anchor = document.createElement('a');
        anchor.download = prompt('파일 이름') || 'members.csv';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }
});