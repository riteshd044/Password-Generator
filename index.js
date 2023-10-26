const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 1;
//strength circle color to grey

handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;  
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min) ) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min) + min);
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    return symbols.charAt(getRndInteger(0,symbols.length));
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);  //its return promise
    copyMsg.innerText="copied";
  }
  catch(e){
    copyMsg.innerText="failed";
  }

  //to make copy wala span active
  copyMsg.classList.add("active");

  setTimeout(()=>{
    copyMsg.classList.remove("active");
  },2000);
}

function handleCheckBox(){
  checkCount=0;
  allCheckBox.forEach((checkbox)=>{
    if(checkbox.checked){
      checkCount++;
    }
  });

  //special condition
  if(checkCount>passwordLength){
    passwordLength = checkCount;
    handleSlider();
  }
}

//suffle array function
function sufflePassword(array){
  //Fisher Yates Method
  for(let i = array.length-1; i>0; i--){
    //random j , Find out using random function
    const j = Math.floor(Math.random() * (i+1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str ="";
  array.forEach((el)=>(str += el));
  return str;
}


inputSlider.addEventListener('input',(val)=>{
  passwordLength = val.target.value;
  handleSlider();
});

copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value){
    copyContent();
  }
});

allCheckBox.forEach((checkbox)=>{
  checkbox.addEventListener('change',handleCheckBox);
})

generateBtn.addEventListener('click',()=>{
  if(checkCount == 0) return;

  if(checkCount>passwordLength){
    passwordLength=checkCount;
  }

  //now the game begins
  password="";
  var paslen = passwordLength;
  let funArr = [];

  if(uppercaseCheck.checked){
    funArr.push(generateUpperCase);
  }
  if(lowercaseCheck.checked){
    funArr.push(generateLowerCase);
  }
  if(numbersCheck.checked){
    funArr.push(generateRandomNumber);
  }
  if(symbolsCheck.checked){
    funArr.push(generateSymbol);
  }

  while(paslen>0){

    funArr.forEach((val)=>{
      if(val==generateUpperCase){
        password+= generateUpperCase();
        paslen--;
        if(paslen <= 0) return;
      }else if(val==generateLowerCase){
        password+= generateLowerCase();
        paslen--;
        if(paslen <= 0) return;
      }else if(val==generateRandomNumber){
        password+= generateRandomNumber();
        paslen--;
        if(paslen <= 0) return;
      }else{
        password+= generateSymbol();
        paslen--;
        if(paslen <= 0) return;
      }
    });

  }

  //suffle teh password
  password = sufflePassword(Array.from(password));

  //show in ui
  passwordDisplay.value = password;

  //calculate Strength
  calcStrength();
});
