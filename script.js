import { targetWords } from "./targetWords.js";

// To-Do's
// * yellow letter logic
// * don't allow non letters as input anywhere
// * don't allow gray letters to be added that are already green or yellow letters
// * don't allow green letters to be added that are gray letters

//data
let helperData = {
  greenLetters: ["", "", "", "", ""],
  yellowLetters: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  },
  darkGrayLetters: [],
  potentialMatches: [],
};

const debug = false;

//HTML elements
const potentialMatchesDiv = document.querySelector(".potential-matches");
const totalPotentialMatchesElement = document.querySelector("[data-total-potential-matches]");
let letterInputs = [];
let yellowLetterInputs = [];
let addYellowLetterButtons = [];
const addDarkGrayLettersButton = document.querySelector("[data-add-dark-gray-letters]");
const darkGrayLettersInput = document.getElementById("darkGrayLetters");
const darkGrayLettersElement = document.querySelector("[data-dark-gray-letters]");
const clearButton = document.getElementById("clearButton");

let i = 0;
for (i; i < 5; i++) {
  const letterNum = i + 1;
  letterInputs.push(document.getElementById(`letter${letterNum}`));
  yellowLetterInputs.push(document.getElementById(`yellowLetter${letterNum}`));
  addYellowLetterButtons.push(document.querySelector(`[data-add-yellow-letter${letterNum}]`));
}

//Event listeners
//Green letters
letterInputs.forEach((letterInput) => {
  //move to next letter on keypress
  letterInput.addEventListener("keyup", (event) => {
    const letterNum = parseInt(event.target.dataset.letter);

    if (event.key.match(/^[a-z]$/)) {
      const nextElement =
        letterNum === 5
          ? document.getElementById("yellowLetter1")
          : document.getElementById(`letter${letterNum + 1}`);
      nextElement.focus();
    }

    if (event.key === "Backspace" || event.key === "Delete") {
      //if first input, return
      if (letterNum === 1) return;

      //delete the previous input
      const prevElement = document.getElementById(`letter${letterNum - 1}`);
      prevElement.value = "";
      prevElement.focus();

      const changeEvent = new Event("change");

      prevElement.dispatchEvent(changeEvent);
    }
    return;
  });

  // Find potential matches on change
  letterInput.addEventListener("change", (event) => {
    const letter = event.target.value.toLowerCase();
    const letterNum = parseInt(event.target.dataset.letter);
    const yellowLetterInput = document.getElementById(`yellowLetter${letterNum}`);
    const yellowLetterButton = document.querySelector(`[data-add-yellow-letter${letterNum}]`);

    //add to helperData
    helperData.greenLetters[letterNum - 1] = letter;

    //clear out any yellow letters
    if (letter !== "") {
      document.querySelector(`[data-yellow-letters="${letterNum}"]`).innerHTML = "";
      helperData.yellowLetters[letterNum - 1] = [];

      //Disable yellow Letters
      yellowLetterInput.disabled = true;
      yellowLetterButton.disabled = true;
    } else {
      //Enable yellow Letters
      yellowLetterInput.disabled = false;
      yellowLetterButton.disabled = false;
    }

    findPotentialMatches();
  });
});

//yellow letters
addYellowLetterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const letterNum = parseInt(event.target.dataset.letter);

    submitYellowLetters(letterNum);
    return;
  });
});

yellowLetterInputs.forEach((yellowLetterInput) => {
  yellowLetterInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const letterNum = parseInt(event.target.dataset.letter);

      submitYellowLetters(letterNum);
      return;
    }
  });
});

const submitYellowLetters = (letterNum) => {
  const inputElement = document.getElementById(`yellowLetter${letterNum}`);
  const input = inputElement.value;

  //remove non letters and update input element
  const sanitizedInput = sanitize(input);
  inputElement.value = "";
  const nextElement =
    letterNum === 5
      ? document.getElementById("darkGrayLetters")
      : document.getElementById(`yellowLetter${letterNum + 1}`);

  nextElement.focus();

  if (sanitizedInput !== "") {
    const yellowLettersElement = document.querySelector(`[data-yellow-letters="${letterNum}"]`);
    let i = 0;
    for (i; i < sanitizedInput.length; i++) {
      const yellowLetter = sanitizedInput.substring(i, i + 1);
      //If letter doesn't already exist in helperData, add to dom and helperData
      if (!helperData.yellowLetters[letterNum - 1].includes(yellowLetter)) {
        //add yellowLetter helperData
        helperData.yellowLetters[letterNum - 1].push(yellowLetter);
        //add yellowLetter to dom
        const yellowLetterHtml = createLetterElement(yellowLetter, "yellow-letter", letterNum);
        yellowLettersElement.appendChild(yellowLetterHtml);
      }
    }

    findPotentialMatches();
  }
};

//Dark Gray Letters
addDarkGrayLettersButton.addEventListener("click", () => {
  submitDarkGrayLetters();
  return;
});

darkGrayLettersInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitDarkGrayLetters();
    return;
  }
});

const submitDarkGrayLetters = () => {
  const inputElement = document.getElementById("darkGrayLetters");
  const input = inputElement.value;

  //remove non letters and update input element
  const sanitizedInput = sanitize(input);
  inputElement.value = "";
  inputElement.focus();

  if (input !== "") {
    addDarkGrayLettersToDom(sanitizedInput);

    findPotentialMatches();
  }
};

const addDarkGrayLettersToDom = (input) => {
  let i = 0;
  for (i; i < input.length; i++) {
    const darkGrayLetter = input.substring(i, i + 1);
    //If letter doesn't already exist in helperData, add to dom and helperData
    if (!helperData.darkGrayLetters.includes(darkGrayLetter)) {
      //add letter helperData
      helperData.darkGrayLetters.push(darkGrayLetter);
      //add letter to dom
      const darkGrayLetterHtml = createLetterElement(darkGrayLetter, "dark-gray-letter");
      darkGrayLettersElement.appendChild(darkGrayLetterHtml);
    }
  }
};

clearButton.addEventListener("click", () => {
  //Set helperData back to defaults
  helperData = {
    greenLetters: ["", "", "", "", ""],
    yellowLetters: {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    },
    darkGrayLetters: [],
    potentialMatches: [],
  };

  //Clear DOM
  letterInputs.forEach((letterInput) => {
    letterInput.value = "";
  });

  yellowLetterInputs.forEach((yellowLetterInput) => {
    const letterNum = yellowLetterInput.dataset.letter;

    //Clear letters
    document.querySelector(`[data-yellow-letters="${letterNum}"]`).innerHTML = "";

    //clear input
    yellowLetterInput.value = "";

    //Enable input and button
    yellowLetterInput.disabled = false;
    document.querySelector(`[data-add-yellow-letter${letterNum}]`).disabled = false;
  });

  darkGrayLettersElement.innerHTML = "";

  //Clear potential matches
  potentialMatchesDiv.innerHTML = "";
  totalPotentialMatchesElement.innerText = "";
});

const sanitize = (input) => {
  //remove all non letters
  return input.replace(/[^a-z]/gi, "");
};

const createLetterElement = (letter, className, letterNum) => {
  //Create letter html element
  const letterHtml = document.createElement("div");
  letterHtml.classList.add("letter", `${className}`);
  letterHtml.innerText = letter.toUpperCase();
  letterHtml.addEventListener("click", (event) => {
    //remove letter
    removeLetter(letter, event.target, letterNum);
  });

  return letterHtml;
};

const removeLetter = (letter, letterElement, letterNum) => {
  if (letterNum === undefined) {
    //remove dark gray letter
    const filteredLetters = helperData.darkGrayLetters.filter(
      (darkGrayLetter) => darkGrayLetter !== letter
    );
    helperData.darkGrayLetters = filteredLetters;

    letterElement.remove();
  } else {
    //remove yellow letter
    const filteredLetters = helperData.yellowLetters[letterNum - 1].filter(
      (yellowLetter) => yellowLetter !== letter
    );
    helperData.yellowLetters[letterNum - 1] = filteredLetters;
    letterElement.remove();
  }

  findPotentialMatches();
};

const findPotentialMatches = () => {
  potentialMatchesDiv.innerHTML = "";
  helperData.potentialMatches = [];

  targetWords.forEach((targetWord) => {
    let i = 0;
    let numGreenMatches = 0;
    let wordHasAllYellowLetters = true;
    let wordHasNoDarkGrayLetters = true;

    //before iterating through the letters of the word, make sure word has all yellow letters and none of the dark gray letters
    const yellowLetters = combineYellowLetters();

    yellowLetters.forEach((yellowLetter) => {
      if (!targetWord.includes(yellowLetter)) wordHasAllYellowLetters = false;
    });

    helperData.darkGrayLetters.forEach((darkGrayLetter) => {
      if (targetWord.includes(darkGrayLetter)) wordHasNoDarkGrayLetters = false;
    });

    if (wordHasAllYellowLetters && wordHasNoDarkGrayLetters) {
      if (debug) console.log(targetWord);

      //iterate through each letter
      for (i; i < targetWord.length; i++) {
        const targetLetter = targetWord.substring(i, i + 1);

        if (debug) console.log("targetLetter", targetLetter, isGreenLetterMatch(targetLetter, i));
        //Match green letter
        numGreenMatches += isGreenLetterMatch(targetLetter, i) ? 1 : 0;
      }

      if (numGreenMatches === targetWord.length) {
        helperData.potentialMatches.push(targetWord);
      }
    }
  });
  potentialMatchesDiv.append(helperData.potentialMatches.join(", "));
  totalPotentialMatchesElement.innerText = helperData.potentialMatches.length;
};

const isGreenLetterMatch = (targetLetter, index) => {
  // green letter input is empty, return true
  if (helperData.greenLetters[index] === "") return true;

  return helperData.greenLetters[index] === targetLetter;
};

const isYellowLetterMatch = (targetLetter, index) => {};

//combine yellow letters
const combineYellowLetters = () => {
  return helperData.yellowLetters[0]
    .concat(helperData.yellowLetters[1])
    .concat(helperData.yellowLetters[2])
    .concat(helperData.yellowLetters[3])
    .concat(helperData.yellowLetters[4]);
};
