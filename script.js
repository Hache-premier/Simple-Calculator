let displayValue = "0";
let firstOperand = null;
let operator = null;
let waitingForOperand = false;

const displayElement = document.getElementById("display");

function updateDisplay() {
  // Limit string length to 9 characters, showing exponent too if necessary

  if (displayValue.length > 9) {
    displayElement.innerText = Number(displayValue).toExponential(6);
  } else {
    // Replace to change the display format (if desired)

    displayElement.innerText = displayValue.replace(".", ",");
  }
}

function appendNumber(number) {
  if (waitingForOperand) {
    displayValue = number;
    waitingForOperand = false;
  } else {
    displayValue = displayValue === "0" ? number : displayValue + number;
  }
  updateDisplay();
  resetOperatorStyles();
}

function appendDecimal() {
  if (waitingForOperand) {
    displayValue = "0.";
    waitingForOperand = false;
  } else if (!displayValue.includes(".")) {
    displayValue += ".";
  }
  updateDisplay();
}

function clearCalculator() {
  displayValue = "0";
  firstOperand = null;
  operator = null;
  waitingForOperand = false;
  updateDisplay();
  resetOperatorStyles();
}

function toggleSign() {
  if (displayValue !== "0") {
    displayValue = displayValue.startsWith("-")
      ? displayValue.slice(1)
      : "-" + displayValue;
    updateDisplay();
  }
}

function handlePercent() {
  const value = parseFloat(displayValue) / 100;
  displayValue = value.toString();
  updateDisplay();
}

function setOperator(op, event) {
  // If an operator has already been pressed, compute the intermediate result

  if (operator !== null && !waitingForOperand) {
    calculate();
  }

  firstOperand = parseFloat(displayValue);
  operator = op;
  waitingForOperand = true;

  // Highlight active operator button when clicked and also remove the highlight from other operator
  resetOperatorStyles();
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }
}

function resetOperatorStyles() {
  const buttons = document.querySelectorAll(".btn-orange");
  buttons.forEach((btn) => btn.classList.remove("active"));
}

function calculate() {
  if (operator === null || waitingForOperand) return;

  const secondOperand = parseFloat(displayValue);
  let result = 0;

  switch (operator) {
    case "add":
      result = firstOperand + secondOperand;
      break;
    case "subtract":
      result = firstOperand - secondOperand;
      break;
    case "multiply":
      result = firstOperand * secondOperand;
      break;
    case "divide":
      if (secondOperand === 0) {
        displayValue = "Error";
        updateDisplay();
        setTimeout(clearCalculator, 1500);
        return;
      }
      result = firstOperand / secondOperand;
      break;
  }

  displayValue = result.toString();
  operator = null;
  waitingForOperand = true;
  updateDisplay();
  resetOperatorStyles();
}
