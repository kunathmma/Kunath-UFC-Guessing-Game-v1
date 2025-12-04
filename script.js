let fighters = [];
fetch('fighters.json')
    .then(res => res.json())
    .then(data => {
        fighters = data;
        const dataList = document.getElementById('fighters');
        fighters.forEach(f => {
            const option = document.createElement('option');
            option.value = f.name;
            dataList.appendChild(option);
        });
    })
    .catch(err => console.error(err));

let mysteryFighter = null;
setTimeout(() => {
    mysteryFighter = fighters[Math.floor(Math.random() * fighters.length)];
    console.log('Mystery Fighter:', mysteryFighter.name);
}, 500);

const guessButton = document.getElementById('guess-button');
const guessInput = document.getElementById('guess-input');
const grid = document.getElementById('grid');

guessButton.addEventListener('click', () => {
    const guessName = guessInput.value.trim();
    if (!guessName) return;

    const fighter = fighters.find(f => f.name.toLowerCase() === guessName.toLowerCase());
    if (!fighter) {
        alert("Fighter not found!");
        return;
    }

    const row = document.createElement('div');
    row.classList.add('guess-row');

    const attributes = [
        { value: fighter.nationality, key: 'nationality' },
        { value: fighter.division, key: 'division' },
        { value: fighter.height, key: 'height' },
        { value: fighter.wins, key: 'wins' },
        { value: fighter.active, key: 'active' },
        { value: fighter.champion, key: 'champion' }
    ];

    attributes.forEach(attr => {
        const tile = document.createElement('div');
        tile.classList.add('tile');

        if (attr.key === 'height' || attr.key === 'wins') {
            let symbol = '';
            if (fighter[attr.key] > mysteryFighter[attr.key]) symbol = '↑';
            else if (fighter[attr.key] < mysteryFighter[attr.key]) symbol = '↓';
            tile.textContent = `${attr.value} ${symbol}`;
        } else {
            tile.textContent = attr.value;
        }

        if (attr.key === 'height' || attr.key === 'wins') {
            if (fighter[attr.key] === mysteryFighter[attr.key]) tile.classList.add('correct');
            else tile.classList.add(fighter[attr.key] > mysteryFighter[attr.key] ? 'higher' : 'lower');
        } else if (fighter[attr.key] === mysteryFighter[attr.key]) {
            tile.classList.add('correct');
        } else {
            tile.classList.add('incorrect');
        }

        row.appendChild(tile);
    });

    // Add fighter name below the row
    const nameDiv = document.createElement('div');
    nameDiv.textContent = fighter.name;
    nameDiv.style.color = '#ddd';
    nameDiv.style.marginTop = '5px';
    row.appendChild(nameDiv);

    grid.appendChild(row);
    guessInput.value = '';
});
