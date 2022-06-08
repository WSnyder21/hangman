const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const finalMessageRevealWord = document.getElementById('final-message-reveal-word');

const figureParts = document.querySelectorAll('.figure-part');

const randomWordUrl = 'https://random-word-api.herokuapp.com/word';

let selectedWord;

let playable = true;

const correctLetters = [];
const wrongLetters = [];

// Generate random word
async function getRandomWord() {
    try {
        const response = await fetch(randomWordUrl);
        const word = await response.json();
        const newWord = word[0];
        selectedWord = newWord;

    } catch (err) {
        console.log(err);
    }
};

getRandomWord();

// Show hidden word
function displayWord() {
    wordEl.innerHTML = `
    ${selectedWord
            .split('')
            .map(
                letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
            )
            .join('')}
  `;

    const innerWord = wordEl.innerText.replace(/[ \n]/g, '');

    if (innerWord === selectedWord) {
        finalMessage.innerText = 'Congratulations! You won! 😃';
        finalMessageRevealWord.innerText = '';
        popup.style.display = 'flex';

        playable = false;
    }
}



// Update the wrong letters
function updateWrongLettersEl() {
    // Display wrong letters
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

    // Display parts
    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    // Check if lost
    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = 'Unfortunately you lost. 😕';
        finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
        popup.style.display = 'flex';

        playable = false;
    }
}

// Show notification
function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Keydown letter press
window.addEventListener('keydown', e => {
    if (playable) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            const letter = e.key.toLowerCase();

            if (selectedWord.includes(letter)) {
                if (!correctLetters.includes(letter)) {
                    correctLetters.push(letter);

                    displayWord();
                } else {
                    showNotification();
                }
            } else {
                if (!wrongLetters.includes(letter)) {
                    wrongLetters.push(letter);

                    updateWrongLettersEl();
                } else {
                    showNotification();
                }
            }
        }
    }
});

// Restart game and play again
playAgainBtn.addEventListener('click', async () => {

    //  Empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);

    updateWrongLettersEl();

    popup.style.display = 'none';

    await init();

    playable = true;

});

async function init() {
    await getRandomWord();
    displayWord();
}

init();
