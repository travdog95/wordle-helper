import { targetWords } from "./targetWords.js";

//HTML elements
const potentialMatchesDiv = document.querySelector(".potential-matches");
let letterInputs = [];
let yellowLetterInputs = [];
let addYellowLetterButtons = [];
let i = 0;
for (i; i < 5; i++) {
  const letterNum = i + 1;
  letterInputs.push(document.getElementById(`letter${letterNum}`));
  yellowLetterInputs.push(document.getElementById(`yellowLetter${letterNum}`));
  addYellowLetterButtons.push(document.querySelector(`[data-add-yellow-letter${letterNum}]`));
}

//Event listeners
addYellowLetterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const letterNum = event.target.dataset.letter;

    findPotentialMatches();
  });
});

letterInputs.forEach((letterInput) => {
  letterInput.addEventListener("change", (event) => {
    const letter = event.target.value;
    findPotentialMatches();
  });
});

let potentialMatches = [];
let yellowLettersPositions = {
  1: ["r", "s"],
  2: [],
  3: ["a", "t"],
  4: [],
  5: ["x"],
};

const findPotentialMatches = () => {
  potentialMatchesDiv.innerHTML = "";
  potentialMatches = [...["crane", "adieu"]];
  potentialMatchesDiv.append(potentialMatches.join(", "));
};
