const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH = 5;

async function init () {
  let currentGuess = '';
  let currentRow  = 0;

  const res = await fetch('https://words.dev-apis.com/word-of-the-day');
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split('');

  setLoading(false);
 
  function addLetter (letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
  }

  async function commit () {
    if (currentGuess.length !== ANSWER_LENGTH) {
      return;
    }

    const guessParts = currentGuess.split('');
    const map = makeMap(wordParts);
    console.log(map);

    for (let index = 0; index < ANSWER_LENGTH; index++) {
      if (guessParts[index] === wordParts[index]) {
        letters[currentRow * ANSWER_LENGTH + index].classList.add('correct');
        map[guessParts[index]]--;
      }
    }

    for (let index = 0; index < ANSWER_LENGTH; index++) {
      if (guessParts[index] === wordParts[index]) {
        // Do nothing
      } else if (wordParts.includes(guessParts[index]) && map[guessParts[index]] > 0) {
        letters[currentRow * ANSWER_LENGTH + index].classList.add('close');
      } else {
        letters[currentRow * ANSWER_LENGTH + index].classList.add('wrong');
      }
    }
    currentRow++;
    currentGuess = '';
  }

  function backspace () {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = '';
  }

  document.addEventListener('keydown', function (event) {
    const action = event.key;

    if (action === 'Enter') {
      commit();
    } else if (action === 'Backspace') {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    }
  })
}

function isLetter (value) {
  return /^[a-zA-Z]$/.test(value);
}

function setLoading (isLoading) {
  loadingDiv.classList.toggle('hidden', !isLoading);
}

function makeMap (array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }
  return obj;
}
init();
