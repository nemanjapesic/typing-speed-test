/*jshint esversion: 6 */

// Get UI Elements
const textArea = document.querySelector("#custom-text-area");
const addTextButton = document.querySelector("#add-text-button");
const restartButton = document.querySelector("#restart-button");
const textContainer = document.querySelector("#text-container");
const userInput = document.querySelector("#user-input");
const stats = document.querySelector(".stats");

const progressUi = document.querySelector(".progress-inner");
const wpmUi = document.querySelector("#wpm");
const cpmUi = document.querySelector("#cpm");
const errorsUi = document.querySelector("#errors");
const accuracyUi = document.querySelector("#accuracy");
const unproductiveKeystrokesUi = document.querySelector("#unproductive-keystrokes");
const elapsedTimeUi = document.querySelector("#elapsed-time");
const fastestCharactersUi = document.querySelector("#fastest-characters");
const slowestCharactersUi = document.querySelector("#slowest-characters");
const leastAccurateCharactersUi = document.querySelector("#least-accurate-characters");

// Default placeholder text
let text = "Welcome to the Typing Speed Test.\nTyping this short introduction text will assess your typing and provide you with statistics, including: typing speed in WPM (Words per Minute) and CPM (Characters per Minute), accuracy, unproductive keystrokes, fastest and slowest as well as the least accurate characters.\nYou can also double-click this box to set your own custom text for the test.\nHappy typing!";

// text = "Pack my box with five dozen liquor jugs.";
// text = "Quick brown fox jumps over the lazy dog.";

// Initialize Values
let totalTyped = 0,
    currentChar = 0,
    correctChars = 0,
    incorrectChars = 0,
    errors = 0,
    backspaces = 0,
    charID = 0,
    wpm = 0,
    cpm = 0,
    accuracy = 0,
    unproductiveKeystrokes = 0,
    startTimer = 0,
    elapsedTime = 0,
    charStart = 0,
    charEnd = 0;
let charSpeed = {},
    charAccuracy = {};
let charSpeedResults = [];
let charAccuracyResults = [];
let finished = false;

// Set default text
textArea.value = text;

const startTest = (event) => {
    // start
    if (!finished) {
        if (currentChar === 0) startTimer = new Date().getTime();

        if (userInput.value.length > text.length) {
            userInput.value = userInput.value.slice(0, -1);
        }

        totalTyped++;

        trackCharAccuracyTotal();

        if (
            event.target.value[currentChar] === text[currentChar] ||
            (getEl(currentChar).textContent === "⏎" &&
                event.target.value[currentChar] === null)
        ) {
            handleCorrectChars();

            trackCharSpeed();
        } else {
            handleIncorrectChars();

            trackCharAccuracyWrong();
        }

        handleCurrentChar();

        if (correctChars + incorrectChars === text.length) {
            finishedTyping();
        }
    }
};

const getEl = (id) => {
    return document.getElementById(id);
};

const handleCurrentChar = () => {
    charStart = new Date().getTime();

    if (currentChar < text.length - 1) {
        getEl(currentChar + 1).classList.add("current");
    }

    // currentChar
    if (userInput.value.length < text.length) {
        currentChar++;
    } else {
        currentChar = userInput.value.length;
    }

    updateProgress();
};

const handleCorrectChars = () => {
    // correctChars
    getEl(currentChar).classList.add("correct");
    getEl(currentChar).classList.remove("current");

    if (
        getEl(currentChar).classList.contains("incorrect") &&
        getEl(currentChar).classList.contains("corrected")
    ) {
        getEl(currentChar).classList.add("was-incorrect");
        getEl(currentChar).classList.remove("correct");
        getEl(currentChar).classList.remove("corrected");
    }

    correctChars++;
};

const handleIncorrectChars = () => {
    //incorrectChars
    getEl(currentChar).classList.add("incorrect");
    getEl(currentChar).classList.remove("current");
    getEl(currentChar).classList.remove("corrected");

    if (currentChar < userInput.value.length) incorrectChars++;
};

const trackCharSpeed = () => {
    // charSpeed
    if (currentChar > 0) {
        charEnd = new Date().getTime() - charStart;

        if (!charSpeed[text[currentChar]]) {
            charSpeed[text[currentChar]] = [charEnd];
        } else {
            charSpeed[text[currentChar]].push(charEnd);
        }
    }
};

const trackCharAccuracyTotal = () => {
    // charAccuracyTotal
    if (!charAccuracy[text[currentChar]]) {
        charAccuracy[text[currentChar]] = {};
        charAccuracy[text[currentChar]].total = 1;
        charAccuracy[text[currentChar]].wrong = 0;
        charAccuracy[text[currentChar]].accuracy = 0;
    } else {
        charAccuracy[text[currentChar]].total++;
    }
};

const trackCharAccuracyWrong = () => {
    // charAccuracyWrong
    if (!charAccuracy[text[currentChar]]) {
        charAccuracy[text[currentChar]] = {};
        charAccuracy[text[currentChar]].total = 1;
        charAccuracy[text[currentChar]].wrong = 1;
        charAccuracy[text[currentChar]].accuracy = 0;
    } else {
        charAccuracy[text[currentChar]].wrong++;
    }
};

const updateProgress = () => {
    percentageDone = ((currentChar / text.length) * 100).toFixed(2);
    progressUi.style.width = `${percentageDone}%`;
}

const resetProgress = () => {
    progressUi.style.width = "0%";
}

const finishedTyping = () => {
    // finished
    elapsedTime = new Date().getTime() - startTimer;

    setTimeout(() => {
        calculateScore();

        displayScore();

        resetAll();
    }, 500);

    finished = true;
};

const calculateScore = () => {
    wpm = Math.round((text.length / 5) * (60 / (elapsedTime / 1000)));
    cpm = Math.round(text.length * (60 / (elapsedTime / 1000)));
    errors = incorrectChars + totalTyped - text.length;
    accuracy = ((correctChars / text.length) * 100).toFixed(2);
    unproductiveKeystrokes = (((incorrectChars + backspaces + totalTyped - text.length) / text.length) * 100).toFixed(2);

    calculateCharSpeed();

    calculateCharAccuracy();
};

const calculateCharSpeed = () => {
    // charSpeed
    Object.keys(charSpeed).forEach(key => {
        charSpeed[key] = Math.round(
            charSpeed[key].reduce((acc, cur) => acc + cur, 0) /
            charSpeed[key].length
        );

        charSpeedResults.push({ char: key, speed: charSpeed[key] });
    });

    charSpeedResults = charSpeedResults.sort((a, b) => a.speed - b.speed);
};

const calculateCharAccuracy = () => {
    // charAccuracy
    Object.keys(charAccuracy).forEach(key => {
        charAccuracy[key].accuracy =
            Math.round(
                100 - (charAccuracy[key].wrong * 100) / charAccuracy[key].total
            );

        charAccuracyResults.push({ char: key, accuracy: charAccuracy[key].accuracy, total: charAccuracy[key].total, wrong: charAccuracy[key].wrong });
    });

    charAccuracyResults = charAccuracyResults.sort((a, b) => a.accuracy - b.accuracy).filter(char => {
        char.accuracy += "%";
        return char.wrong > 0;
    });
};

const displayScore = () => {
    wpmUi.textContent = wpm;
    cpmUi.textContent = cpm;
    elapsedTimeUi.textContent = (elapsedTime / 1000).toFixed(1) + " seconds";
    errorsUi.textContent = errors;
    accuracyUi.textContent = accuracy;
    unproductiveKeystrokesUi.textContent = unproductiveKeystrokes;

    fastestCharactersUi.innerHTML = charSpeedResults.slice(0, 5).map(function (item) {
        return `<span>${item.char === " " ? "SPACE" : item.char === "\n" ? "ENTER" : item.char}</span>`;
    }).join("");
    slowestCharactersUi.innerHTML = charSpeedResults.slice((charSpeedResults.length - 5), charSpeedResults.length).reverse().map(function (item) {
        return `<span>${item.char === " " ? "SPACE" : item.char === "\n" ? "ENTER" : item.char}</span>`;
    }).join("");
    leastAccurateCharactersUi.innerHTML = charAccuracyResults.map(function (item) {
        return `<span>${item.char === " " ? "SPACE" : item.char === "\n" ? "ENTER" : item.char}</span>`;
    }).slice(0, 5).join("");

    showResults();

    // consoleLogResults();
};

// const consoleLogResults = () => {
//     console.log("Elapsed time: " + Math.round(elapsedTime / 1000) + " seconds");
//     console.log("Your speed is: " + wpm + " WPM");
//     console.log("CPM: " + cpm);
//     console.log(
//         "Accuracy: " + accuracy + "%"
//     );
//     console.log("Total errors: " + errors);
//     console.log(
//         "Unproductive keystrokes percentage: " +
//         unproductiveKeystrokes +
//         "%"
//     );
//     console.log("Text length: " + text.length);
//     console.log("Total characters typed: " + (totalTyped + backspaces));
//     console.log("Correct characters: " + correctChars);
//     console.log("Incorrect characters: " + incorrectChars);
//     console.log("Backspaces: " + backspaces);
//     console.log("Fastest characters: ");
//     // console.table(charSpeed);
//     console.table(charSpeedResults.slice(0, 10));
//     console.log("Slowest characters: ");
//     console.table(charSpeedResults.slice((charSpeedResults.length - 10), charSpeedResults.length).reverse());
//     console.log("Least accurate characters: ");
//     // console.table(charAccuracy);
//     console.table(charAccuracyResults);
// };

const resetResults = () => {
    wpmUi.textContent = 0;
    cpmUi.textContent = 0;
    errorsUi.textContent = 0;
    elapsedTimeUi.textContent = 0;
    accuracyUi.textContent = 0;
    unproductiveKeystrokesUi.textContent = 0;
    fastestCharactersUi.textContent = "";
    slowestCharactersUi.textContent = "";
    leastAccurateCharactersUi.textContent = "";
};

const setText = () => {
    textContainer.innerHTML = "";

    finished = false;

    setLines(text);

    resetAll();

    userInput.focus();
};

const setLines = text => {
    let lines = text.split("\n");

    if (lines.length > 1) {
        lines.forEach((line, i) => {
            let lineElement = document.createElement("div");
            lineElement.setAttribute("class", "line-" + i);

            setChars(line, lineElement);

            let enter = document.createElement("span");
            enter.setAttribute("id", charID);
            enter.textContent = "⏎";

            if (i !== lines.length - 1) lineElement.appendChild(enter);

            textContainer.appendChild(lineElement);

            charID++;
        });
    } else {
        setChars(text, textContainer);
    }
};

const setChars = (arr, container) => {
    arr.split("").forEach(char => {
        let charSpan = document.createElement("span");
        charSpan.setAttribute("id", charID);

        let iSpace = document.createElement("i");
        iSpace.textContent = " ";

        if (char === " ") {
            charSpan.innerHTML = "&nbsp;";
            charSpan.appendChild(iSpace);
        } else {
            charSpan.textContent = char;
        }

        container.appendChild(charSpan);
        charID++;
    });
};

const addCustomText = () => {
    text = textArea.value.replace(/  +/g, "");
    if (textArea.value.length > 0) setText();
    hideAddCustomText();
};

const showAddCustomText = () => {
    restart();
    textContainer.style.display = "none";
    textArea.parentElement.style.display = "block";
    textArea.value = text;
    textArea.select();
};

const hideAddCustomText = () => {
    textArea.parentElement.style.display = "none";
    textContainer.style.display = "block";
    userInput.focus();
};

const showResults = () => {
    stats.style.display = "flex";
    restartButton.style.display = "block";
};

const hideResults = () => {
    stats.style.display = "none";
    restartButton.style.display = "none";
};

const restart = () => {
    setText();
    resetResults();
    hideResults();
    resetProgress();

    textArea.parentElement.style.display = "none";
};

const resetAll = () => {
    elapsedTime = 0;
    currentChar = 0;
    correctChars = 0;
    incorrectChars = 0;
    charID = 0;
    totalTyped = 0;
    backspaces = 0;
    errors = 0;
    wpm = 0;
    cpm = 0;
    accuracy = 0;
    unproductiveKeystrokes = 0;
    charStart = 0;
    charEnd = 0;
    charSpeed = {};
    charAccuracy = {};
    charSpeedResults = [];
    charAccuracyResults = [];
    userInput.value = "";
    textArea.value = "";

    if (!finished) getEl(currentChar).classList.add("current");
};

// Add event listeners
userInput.addEventListener("input", startTest);

userInput.addEventListener("keydown", event => {
    let key = event.key;
    if (key === "Backspace") {
        event.preventDefault();

        handleBackspacedChars();
    }
});

const handleBackspacedChars = () => {
    if (currentChar > 0) {
        backspaces++;
        currentChar--;
    }

    if (userInput.value[currentChar] === text[currentChar]) {
        if (correctChars > 0) correctChars--;
    } else {
        if (incorrectChars > 0) incorrectChars--;
        getEl(currentChar).classList.add("corrected");
    }

    getEl(currentChar).classList.add("current");
    getEl(currentChar).classList.add("corrected");

    if (currentChar < text.length - 1) {
        getEl(currentChar + 1).classList.remove("current");
    }

    getEl(currentChar).classList.remove("correct");
    getEl(currentChar).classList.remove("was-incorrect");

    userInput.value = userInput.value.slice(0, -1);

    updateProgress();
};

userInput.addEventListener("blur", () => {
    textContainer.classList.remove("focused");
    textContainer.classList.add("blurred");
});

userInput.addEventListener("focus", () => {
    textContainer.classList.remove("blurred");
    textContainer.classList.add("focused");
});

textContainer.addEventListener("dblclick", showAddCustomText);

textContainer.addEventListener("click", hideAddCustomText);

addTextButton.addEventListener("click", addCustomText);

textArea.addEventListener("keydown", function (event) {
    if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        addCustomText();
    }
});

restartButton.addEventListener("click", restart);

// Initialize default text
setText();