let displayValue = '0'
let firstOperand = null
let operator = null
let waitingForOperand = false

const displayElement = document.getElementById('display')

function formatResult (value) {
  if (value === 'Error') {
    return 'Error'
  }

  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 'Error'
  }

  const absoluteValue = Math.abs(number)

  if (
    absoluteValue >= 1e12 ||
    (absoluteValue > 0 && absoluteValue < 1e-9)
  ) {
    return number.toExponential(6)
  }

  return Number(number.toPrecision(12)).toString()
}

function updateDisplay () {
  displayElement.innerText = formatResult(displayValue)
}

function appendNumber (number) {
  if (waitingForOperand) {
    displayValue = number
    waitingForOperand = false
  } else {
    displayValue = displayValue === '0' ? number : displayValue + number
  }

  updateDisplay()
  resetOperatorStyles()
}

function appendDecimal () {
  if (waitingForOperand) {
    displayValue = '0.'
    waitingForOperand = false
  } else if (!displayValue.includes('.')) {
    displayValue += '.'
  }

  updateDisplay()
}

function clearCalculator () {
  displayValue = '0'
  firstOperand = null
  operator = null
  waitingForOperand = false

  updateDisplay()
  resetOperatorStyles()
}

function toggleSign () {
  if (displayValue !== '0') {
    displayValue = displayValue.startsWith('-')
      ? displayValue.slice(1)
      : '-' + displayValue

    updateDisplay()
  }
}

function handlePercent () {
  const value = parseFloat(displayValue) / 100

  displayValue = formatResult(value)

  updateDisplay()
}

function setOperator (op, event) {
  if (operator !== null && !waitingForOperand) {
    calculate()
  }

  firstOperand = parseFloat(displayValue)
  operator = op
  waitingForOperand = true

  resetOperatorStyles()

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active')
  }
}

function resetOperatorStyles () {
  const buttons = document.querySelectorAll('.btn-orange')

  buttons.forEach((btn) => btn.classList.remove('active'))
}

function calculate () {
  if (operator === null || waitingForOperand) {
    return
  }

  const secondOperand = parseFloat(displayValue)
  let result = 0

  switch (operator) {
    case 'add':
      result = firstOperand + secondOperand
      break

    case 'subtract':
      result = firstOperand - secondOperand
      break

    case 'multiply':
      result = firstOperand * secondOperand
      break

    case 'divide':
      if (secondOperand === 0) {
        displayValue = 'Error'
        updateDisplay()
        setTimeout(clearCalculator, 1500)
        return
      }

      result = firstOperand / secondOperand
      break
  }

  displayValue = formatResult(result)
  operator = null
  waitingForOperand = true

  updateDisplay()
  resetOperatorStyles()
}

window.appendNumber = appendNumber
window.appendDecimal = appendDecimal
window.clearCalculator = clearCalculator
window.toggleSign = toggleSign
window.handlePercent = handlePercent
window.setOperator = setOperator
window.calculate = calculate

updateDisplay()
