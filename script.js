import { targetWords } from "./targetWords.js";

//data
let helperData = {
  greenLetters: [],
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

//HTML elements
const potentialMatchesDiv = document.querySelector(".potential-matches");
let letterInputs = [];
let yellowLetterInputs = [];
let addYellowLetterButtons = [];
const addDarkGrayLettersButton = document.querySelector("[data-add-dark-gray-letters]");

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
  letterInput.addEventListener("change", (event) => {
    const letter = event.target.value;
    findPotentialMatches();
  });
});

//yellow letters
addYellowLetterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const letterNum = event.target.dataset.letter;
    const inputElement = document.getElementById(`yellowLetter${letterNum}`);
    const input = inputElement.value;

    //remove non letters and update input element
    const sanitizedInput = sanitize(input);
    inputElement.value = "";
    inputElement.focus();

    if (input !== "") {
      addYellowLetters(sanitizedInput, letterNum);

      findPotentialMatches();
    }
  });
});

//Dark Gray Letters
addDarkGrayLettersButton.addEventListener("click", () => {
  const inputElement = document.getElementById("darkGrayLetters");
  const input = inputElement.value;

  //remove non letters and update input element
  const sanitizedInput = sanitize(input);
  inputElement.value = "";
  inputElement.focus();

  if (input !== "") {
    addDarkGrayLetters(sanitizedInput);

    findPotentialMatches();
  }
});

const findPotentialMatches = () => {
  potentialMatchesDiv.innerHTML = "";
  helperData.potentialMatches = [...["crane", "adieu"]];
  potentialMatchesDiv.append(helperData.potentialMatches.join(", "));
};

const addYellowLetters = (input, letterNum) => {
  const yellowLettersElement = document.querySelector(`[data-yellow-letters="${letterNum}"]`);
  let i = 0;
  for (i; i < input.length; i++) {
    const yellowLetter = input.substring(i, i + 1);
    //If letter doesn't already exist in helperData, add to dom and helperData
    if (!helperData.yellowLetters[letterNum - 1].includes(yellowLetter)) {
      //add yellowLetter helperData
      helperData.yellowLetters[letterNum - 1].push(yellowLetter);
      //add yellowLetter to dom
      const yellowLetterHtml = createLetterElement(yellowLetter, "yellow-letter", letterNum);
      yellowLettersElement.appendChild(yellowLetterHtml);
    }
  }
};

const addDarkGrayLetters = (input) => {
  const darkGrayLettersElement = document.querySelector("[data-dark-gray-letters]");
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
};
