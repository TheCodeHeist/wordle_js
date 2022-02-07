import PromptSync from "prompt-sync";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import url from "url";
import bcryptjs from "bcryptjs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Buffer = fs.readFileSync(
  path.join(__dirname, "./assets/popular.txt"),
  "utf-8"
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getFiveLetterWord = (dict) => {
  console.clear();

  const words = dict.split("\n");

  let chosenWord;

  while (true) {
    chosenWord = words[Math.floor(Math.random() * words.length)];

    if (chosenWord.length === 5) {
      break;
    } else {
      continue;
    }
  }

  return chosenWord.toUpperCase();
};

let word = getFiveLetterWord(Buffer);

await sleep(1000);
process.stdout.write(chalk.blue.bold("INFO") + " Looking for words...\r");
await sleep(2000);
process.stdout.write(
  chalk.green.bold("SUCCESS") +
    ` Found word (HASHED): ${bcryptjs.hashSync(word, 5)}`
);
await sleep(2000);
console.clear();
process.stdout.write(chalk.blue.bold("INFO") + " Sending word to server...\r");
await sleep(2000);
process.stdout.write(chalk.blue.bold("INFO") + " Waiting for response...\r");
await sleep(2000);
process.stdout.write(
  chalk.green.bold("SUCCESS") + " Word accepted! Starting game..."
);
await sleep(3000);

let table = [
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " "],
];

const renderDisplay = (tableRef, willAsk = true, msg = "") => {
  console.clear();

  let tableState = "";

  tableState += "+---+---+---+---+---+\n";

  for (let i = 0; i < tableRef.length; i++) {
    for (let j = 0; j < tableRef[i].length; j++) {
      tableState += `| ${tableRef[i][j]} `;
    }

    tableState += "|\n";
    tableState += "+---+---+---+---+---+\n";
  }

  tableState += "\n\n\n\n";

  console.log(tableState);

  let input;

  if (msg) {
    console.log(chalk.blue.bold("INFO"), msg, "\n\n");
  }

  if (willAsk) {
    input = PromptSync()("> ").toUpperCase();

    if (input.length > 5 || input.length < 5)
      return renderDisplay(
        table,
        true,
        "The word you are guessing has to be of five letters!"
      );
  }

  return input;
};

let currentIndex = 0;

while (true) {
  let checkMissing = true;

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      if (table[i][j] !== " ") {
        checkMissing = false;
      } else {
        checkMissing = true;
        break;
      }
    }
  }

  if (!checkMissing) {
    renderDisplay(table, false);
    console.log(chalk.red.bold("GAME OVER! YOU LOST!"));
    console.log(chalk.green("The correct word was:"), chalk.yellow(word));
    break;
  }

  let guess = renderDisplay(table);

  let checkWord = "";

  for (let i = 0; i < table[currentIndex].length; i++) {
    let stateWord = "";

    if (word.includes(guess[i])) {
      if (word[i] === guess[i]) {
        stateWord = chalk.green(guess[i]);
        checkWord += guess[i];
      } else {
        stateWord = chalk.yellow(guess[i]);
      }
    } else {
      stateWord = chalk.gray(guess[i]);
    }

    table[currentIndex][i] = stateWord;
  }

  if (checkWord === word) {
    renderDisplay(table, false);
    console.log(chalk.green.bold("YOU WON!"));
    break;
  }

  currentIndex++;
}

console.log("Press any key to exit...");
PromptSync()();
