let fighters = [];

fetch('fighters.json')
  .then(response => response.json())
  .then(data => {
    fighters = data;
    const dataList = document.getElementById('fighters');
    fighters.forEach(f => {
      const option = document.createElement('option');
      option.value = f.name;
      dataList.appendChild(option);
    });
  });

const guessButton = document.getElementById('guess-button');
const guessInput = document.getElementById('guess-input');
const grid = document.getElementById('grid');

// Example mystery fighter for testing
const mysteryFighter = fighters[Math.floor(Math.random() * fighters.length)];

guessButton.addEventListener('click', () => {
    const guessName = guessInput.value.trim();
    const fighter = fighters.find(f => f.name.toLowerCase() === guessName.toLowerCase());
    if (!fighter) return alert("Fighter not found");

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

        // Color feedback
        if (attr.key === 'height' || attr.key === 'wins') {
            if (fighter[attr.key] === mysteryFighter[attr.key]) tile.classList.add('correct');
            else tile.classList.add(fighter[attr.key] > mysteryFighter[attr.key] ? 'higher' : 'lower');
        } else if (fighter[attr.key] === mysteryFighter[attr.key]) {
            tile.classList.add('correct');
        } else {
            tile.classList.add('incorrect');
        }

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('tile-name');
        nameDiv.textContent = fighter.name;
        tile.appendChild(nameDiv);

        grid.appendChild(tile);
    });

    guessInput.value = '';
});
