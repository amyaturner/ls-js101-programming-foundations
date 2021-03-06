const MESSAGES = require('./messages_mortgage.json');
const VALID_YES = ['y', 'yes'];
const VALID_NO = ['n', 'no'];

let rlSync = require('readline-sync');

function prompt(message) {
  console.log(`=> ${message}`);
}

function askForLoanAmount() {
  let num;

  do {
    prompt(MESSAGES.askForLoanAmount);
    num = rlSync.question();

    if (numberInvalid(num)) {
      prompt(MESSAGES.invalidNum);
    }

  } while (numberInvalid(num));

  return Number(num);
}

function askForApr() {
  let num;

  do {
    prompt(MESSAGES.askForApr);
    num = rlSync.question();

    if (aprInvalid(num)) {
      prompt(MESSAGES.invalidApr);
    }

  } while (aprInvalid(num));

  return Number(num);
}

function askForLoanDuration() {
  let num;

  do {
    prompt(MESSAGES.askForLoanDuration);
    num = rlSync.question();

    if (numberInvalid(num)) {
      prompt(MESSAGES.invalidNum);
    }

  } while (numberInvalid(num));

  return Number(num);
}

function numberInvalid(num) {
  return num.trimStart() === '' ||
         Number.isNaN(Number(num)) ||
         Number(num) <= 0;
}

function aprInvalid(num) {
  return (Number(num) !== 0 && Number(num) < 1) ||
          Number(num) < 0 ||
          num.trimStart() === '' ||
          Number.isNaN(Number(num));
}

function calculateMonthlyPayment(loanAmount, apr, loanDurationYears) {
  let durationInMonths = calculateLoanDurationInMonths(loanDurationYears);
  let monthlyPayment;

  if (apr === 0) {
    monthlyPayment = (loanAmount / durationInMonths).toFixed(2);
    return monthlyPayment;
  }

  let monthlyRate = calculateMonthlyInterestRate(apr);
  monthlyPayment = loanAmount *
                       (monthlyRate /
                       (1 - Math.pow((1 + monthlyRate), (-durationInMonths))));

  return monthlyPayment.toFixed(2);
}

function calculateMonthlyInterestRate(apr) {
  return (apr / 100) / 12;
}

function calculateLoanDurationInMonths(loanDurationYears) {
  return loanDurationYears * 12;
}

function askIfStartOver() {
  let startOver;

  do {
    prompt(MESSAGES.startOver);
    startOver = rlSync.question().toLowerCase();

    if (!startOverResponseValid(startOver)) {
      prompt(MESSAGES.invalidStartOver);
    }

  } while (!startOverResponseValid(startOver));

  return startOver;
}

function startOverResponseValid(startOver) {
  return VALID_YES.includes(startOver) || VALID_NO.includes(startOver);
}

function startOverTrue(startOver) {
  return VALID_YES.includes(startOver);
}

let loanAmount;
let apr;
let loanDurationYears;
let startOver;

console.log(MESSAGES.welcome);

do {

  loanAmount = askForLoanAmount();
  apr = askForApr();
  loanDurationYears = askForLoanDuration();

  prompt(MESSAGES.result + calculateMonthlyPayment(loanAmount, apr, loanDurationYears) + '\n');

  startOver = askIfStartOver();

  console.clear();

} while (startOverTrue(startOver));

prompt(MESSAGES.goodbye);
