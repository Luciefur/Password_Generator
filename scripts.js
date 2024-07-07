const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthDisplay]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const copyBtn = document.querySelector("[data-copy]");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '`~!@#$%^&*()_+-=[]{};:/?><.,\|';

let password = "";
let passowrdLength = 8;
let checkCount = 1;

handleSlider();

// set strength color to gray
let indicatorColor = document.querySelector("#indicator");
indicatorColor.style.backgroundColor = "rgb(204, 204, 204)";
indicatorColor.style.boxShadow = "rgb(204, 204, 204) 0px 0px 12px 1px";

// set passwordLength and display it on the page
function handleSlider() {
    inputSlider.value = passowrdLength;
    lengthDisplay.innerText = passowrdLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passowrdLength - min)*100/(max - min)) + "0% 100%";
}

// set color for respective strength based on calcStrength() function
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `${color} 0px 0px 12px 1px`;
}

// get a random value between min and max values
function getRandomInteger(min, max) {
    return Math.round(Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 122));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbols() {
    const randNum = getRandomInteger(0, symbols.length-1);
    return symbols.charAt(randNum);
}

// calculating strength based on conditions
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper =  true;
    if(lowercaseCheck.checked) hasLower =  true;
    if(numbersCheck.checked) hasNumber =  true;
    if(symbolsCheck.checked) hasSymbol =  true;

    if(hasUpper && hasLower && hasNumber && hasSymbol && passowrdLength >= 8) {
        setIndicator("#0f0");
    } else if(hasLower && hasUpper && (hasNumber || hasSymbol) && passowrdLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// copy the generated password to clipboard
async function copyPassword() {

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
    
}

// shuffling the password as checked boxes will always come first without shuffling
function shufflePassword(password) {

    // Fisher Yates Method
    for(let i = 0; i<password.length-1; i++) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }

    let str = "";
    password.forEach( (el) => (str += el));
    return str;
}

// the change in the checkbox attribute captured and adjusting checkCount based on it
function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) {
            checkCount += 1;
        }
    });

    if(passowrdLength < checkCount) {
        passowrdLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

// event listener for the change in value of slider
inputSlider.addEventListener('input', (e) => {
    passowrdLength = e.target.value;
    handleSlider();
});

// if copy button is clicked then, we call copyPassword() function to copy to clipboard
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyPassword();
    }
});

/* 

when generate password button is clicked then,




*/
generateBtn.addEventListener('click', () => {
    // none of the checkbox is checked
    if(checkCount <= 0) return;

    if(passowrdLength < checkCount) {
        passowrdLength = checkCount;
        handleSlider();
    }

    // let's start creating new password

    // remove previous password
    // passwordDisplay.value = '';
    password = "";

    // let's put the characters based on checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbols();
    // }


    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);


    // compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0; i<passowrdLength-funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length-1);

        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show password in passwordDisplay
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();

})




