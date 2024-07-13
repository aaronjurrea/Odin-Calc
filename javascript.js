const BUTTONS = document.querySelectorAll("button");
const HISTORY = document.querySelectorAll(".display .row#history");
const INPUT = document.querySelector(".display .row#input");
const SYMBOLS = ["+", "-", "*", "/", "%"];

let singleClear = false;
let inputLine = INPUT.querySelector("#equation");


BUTTONS.forEach((button) => {
    button.addEventListener("click", function(){
        press(button.textContent);
    });
})


function updateInputLine(){
    inputLine.textContent = '';
}


function updateHistory(row1, row2, ...args){
    row1.querySelector('#equation').textContent = row2.querySelector('#equation').textContent;

    if(typeof args !== 'undefined' && args.length === 1){
        row1.querySelector("#equals").textContent = '=';
        row1.querySelector("#answer").textContent = args[0].toString();
    }
    else{
        row1.querySelector('#equals').textContent = row2.querySelector('#equals').textContent;
        row1.querySelector('#answer').textContent = row2.querySelector('#answer').textContent;
    }
}


function parseCheck(char, lastChar, input, hasDecimal){
    console.log(char + " | " + lastChar);
    if(lastChar === '' && SYMBOLS.includes(char)){
        error("Equation can not begin with operator!");
        return false;
    }
    else if(lastChar === '' && char === '.'){
        error("Equation can not begin with decimal!");
        return false;    
    }
    else if(input.length === 0 && SYMBOLS.includes(char)){
        error("Equation can not end with operator!");
        return false;
    }
    else if(input.length === 0 && char === '.'){
        error("Equation can not end with decimal!");
        return false;    
    }
    else if(SYMBOLS.includes(lastChar) && SYMBOLS.includes(char)){
        error("Equation can not have consecutive operators!");
        return false;                
    } 
    else if(hasDecimal && char === '.'){
        error("Equation can not have more than one decimal!");
        return false;    
    }
    // TODO - FIX
    else if(SYMBOLS.includes(lastChar) && char === '.'){
        error("Decimals must be preceeded by an integer!");
        return false;            
    }

    return true;
}


function compute(operation, solution, value){
    switch(operation){
        case '+':
            solution = add(solution, value);
            break;
        case '-':
            solution = subtract(solution, value);
            break;    
        case '*':
            solution = multiply(solution, value);
            break;    
        case '/':
            solution = divide(solution, value);
            if(solution === undefined)
                return;
            break;    
        case '%':
            solution = modulo(solution, value);
            break;
    }
    return solution;
}


function operate(){
    let input = inputLine.textContent.split('').reverse();
    let stack = [], solution = 0, 
        operation = '', lastChar = '', hasDecimal = false;


    while(input.length != 0){
        let char = input.pop(),
            check = parseCheck(char, lastChar, input, hasDecimal);


        if(check && (SYMBOLS.includes(char) || input.length === 0)){
            
            if(!SYMBOLS.includes(char))
                stack.push(char)

            if(operation !== ''){
                let value = Number(stack.join(''));
                solution = compute(operation, solution, value);
            }
            else{
                solution = Number(stack.join(''));      
            }

            if(SYMBOLS.includes(char)){
                operation = char;
                hasDecimal = false;
            }

            stack = [];
        }
        else if(!check){
            return;
        }

        else{
            if(char === '.')
                hasDecimal = true;
            else if(char === 'A'){
                input.pop();
                input.pop();

                char = (HISTORY[3].querySelector("#answer").textContent === '' ? 0 : Number(HISTORY[3].querySelector("#answer").textContent))
            }
            // TODO - Fix bug where ANS comes last in an equation
            
            stack.push(char);
        }
        lastChar = char;
    }

    solution = Math.round(solution * 1000)/1000;

    if(hasInput = true){
       for(let i = 1; i < HISTORY.length; i++)
           updateHistory(HISTORY[i-1], HISTORY[i]);
       
       updateHistory(HISTORY[HISTORY.length-1], INPUT, solution);
       updateInputLine();

    }   

}


function clear(){
    inputLine.textContent = '';

    if(singleClear === true){
        for(let i = 0; i < HISTORY.length; i++){
            HISTORY[i].querySelector('#equation').textContent = '';
            HISTORY[i].querySelector('#equals').textContent = '';
            HISTORY[i].querySelector('#answer').textContent = '';
        }
    singleClear = false;
    }
}


function backspace(){
    inputLine.textContent = inputLine.textContent.slice(0, -1);
}


function appendInput(pressedButton){
    if(inputLine.textContent.length < 25){
        if(inputLine.textContent.length === 0 && SYMBOLS.includes(pressedButton))
            ans();
        inputLine.textContent += pressedButton;
    }
}


function add(num1, num2){ return num1 + num2; }


function subtract(num1, num2){ return num1 - num2; }


function multiply(num1, num2){ return num1 * num2; }


function divide(num1, num2){
    if(num2 === 0){
        error("Can not divide by 0!");
        return undefined;
    }
    return num1 / num2;
}


function modulo(num1, num2){ return num1 % num2; }


function press(pressedButton){
    switch(pressedButton){
        case 'AC':
            clear();
            singleClear = true;
            return;
        case '=':
            operate();
            break;
        case '⌫':
            backspace();
            break;
        case 'ANS':
            ans();
            break;
        default:
            appendInput(pressedButton);
            break;
    }
    singleClear = false;
}

function ans(){
    appendInput("ANS");
}


function error(message){
    alert("ERROR: " + message);
    updateInputLine();
}