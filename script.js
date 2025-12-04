let fighters = [];
let mysteryFighter = null;
let maxGuesses = 6;
let guesses = 0;

// Create input container for autocomplete
const inputContainer = document.createElement('div');
inputContainer.style.position = 'relative';
const fighterInput = document.createElement('input');
fighterInput.id = 'fighterInput';
fighterInput.placeholder = 'Enter fighter name';
fighterInput.style.padding = '10px';
fighterInput.style.fontSize = '16px';
fighterInput.style.width = '250px';
inputContainer.appendChild(fighterInput);
document.body.insertBefore(inputContainer, document.getElementById('keyboardContainer'));

const autocompleteList = document.createElement('div');
autocompleteList.id = 'autocomplete-list';
inputContainer.appendChild(autocompleteList);

// Load fighters
fetch('fighters.json')
    .then(resp => resp.json())
    .then(data => {
        fighters = data;
        pickDailyFighter();
        createGridHeader();
        createKeyboard();
    });

// Pick daily fighter
function pickDailyFighter() {
    const date = new Date();
    const seed = date.getFullYear() + date.getMonth() + date.getDate();
    const index = seed % fighters.length;
    mysteryFighter = fighters[index];
    console.log("Mystery fighter:", mysteryFighter.name);
}

// Get flag emoji
function getFlag(nat) {
    const map = { USA:"🇺🇸", Brazil:"🇧🇷", Mexico:"🇲🇽", Canada:"🇨🇦", Russia:"🇷🇺", UK:"🇬🇧", Ireland:"🇮🇪", Nigeria:"🇳🇬" };
    return map[nat] || nat;
}

// Compare guess to mystery fighter
function checkGuess(guess) {
    return {
        nationality: guess.nationality === mysteryFighter.nationality ? '✅' : '❌',
        division: guess.division === mysteryFighter.division ? '✅' : '❌',
        status: guess.status === mysteryFighter.status ? '✅' : '❌',
        champion: guess.champion === mysteryFighter.champion ? '🏆' : '❌',
        height: guess.height_in === mysteryFighter.height_in ? '✅' : (guess.height_in > mysteryFighter.height_in ? '⬆️' : '⬇️'),
        wins: guess.wins === mysteryFighter.wins ? '✅' : (guess.wins > mysteryFighter.wins ? '⬆️' : '⬇️')
    };
}

// Create grid header
function createGridHeader() {
    const container = document.getElementById('gridContainer');
    ["Fighter","Nationality","Division","Height","Wins","Status","Champion"].forEach(text=>{
        const div = document.createElement('div');
        div.className='cell header';
        div.innerText=text;
        container.appendChild(div);
    });
}

// Create virtual keyboard
function createKeyboard() {
    const container = document.getElementById('keyboardContainer');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').concat(["ENTER","DEL"]);
    letters.forEach(l=>{
        const div = document.createElement('div');
        div.className='key';
        div.innerText=l;
        div.addEventListener('click',()=>handleKey(l));
        container.appendChild(div);
    });
}

// Handle keyboard input
function handleKey(key) {
    if(key==="DEL"){ fighterInput.value=fighterInput.value.slice(0,-1); }
    else if(key==="ENTER"){ submitGuess(); }
    else{ fighterInput.value += key; }
}

// Autocomplete suggestions
fighterInput.addEventListener('input', () => {
    const value = fighterInput.value.trim().toLowerCase();
    autocompleteList.innerHTML = '';
    if (!value) return;
    const matches = fighters.filter(f => f.name.toLowerCase().includes(value)).slice(0, 5);
    matches.forEach(f => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.innerText = f.name;
        div.addEventListener('click', () => {
            fighterInput.value = f.name;
            autocompleteList.innerHTML = '';
            submitGuess();
        });
        autocompleteList.appendChild(div);
    });
});

// Submit guess
function submitGuess() {
    const inputValue = fighterInput.value.trim();
    const guessFighter = fighters.find(f => f.name.toLowerCase() === inputValue.toLowerCase());
    if (!guessFighter) {
        alert("Fighter not found!");
        fighterInput.value = '';
        return;
    }

    guesses++;
    const feedback = checkGuess(guessFighter);
    displayFeedback(guessFighter, feedback);

    if (guessFighter.name === mysteryFighter.name) {
        alert("🎉 You guessed correctly!");
    } else if (guesses >= maxGuesses) {
        alert(`Game over! The fighter was ${mysteryFighter.name}`);
    }

    fighterInput.value = '';
    autocompleteList.innerHTML = '';
}

// Display feedback
function displayFeedback(fighter,feedback){
    const container=document.getElementById('gridContainer');
    function cell(content,className){
        const div=document.createElement('div');
        div.className='cell '+className;
        div.innerText=content;
        return div;
    }

    container.appendChild(cell(fighter.name,''));
    container.appendChild(cell(getFlag(fighter.nationality),feedback.nationality==='✅'?'correct':'incorrect'));
    container.appendChild(cell(fighter.division,feedback.division==='✅'?'correct':'incorrect'));
    container.appendChild(cell(feedback.height,feedback.height==='✅'?'correct':'arrow'));
    container.appendChild(cell(feedback.wins,feedback.wins==='✅'?'correct':'arrow'));
    container.appendChild(cell(fighter.status,feedback.status==='✅'?'correct':'incorrect'));
    container.appendChild(cell(feedback.champion,feedback.champion==='🏆'?'correct':'incorrect'));
}
