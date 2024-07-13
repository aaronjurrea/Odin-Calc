const BUTTONS = document.querySelectorAll("button");
const HISTORY = document.querySelectorAll(".display .row#history");
const INPUT = document.querySelector(".display .row#input");
const SYMBOLS = ["+", "-", "*", "/"];

let singleClear = false;

BUTTONS.forEach((button) => {
    button.addEventListener("click", function(){
        press(button.textContent);
    });
})

function updateInputLine(){
    INPUT.querySelector("#equation").textContent = '';
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


function operate(){
    let input = INPUT.querySelector("#equation").textContent.split('').reverse();
    let stack = [], solution = 0, operation = '', lastOperator = false, hasInput = false;

    while(input.length != 0){
        let char = input.pop()
        if(!hasInput && SYMBOLS.includes(char)){
            error("Equation can not begin with operator!");
            return;
        }
        else if(input.length === 0 && SYMBOLS.includes(char)){
            error("Equation can not end with operator!");
            return;
        }
        else if(lastOperator && SYMBOLS.includes(char)){
            error("Equation can not have consecutive operators!");
            return;                
        }
        else if(SYMBOLS.includes(char) || input.length === 0){
            if(!SYMBOLS.includes(char))
                stack.push(char)

            if(operation !== ''){
                let value = Number(stack.join(''));
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
                        break;    
                }
            }
            else{
                solution = Number(stack.join(''));      
            }

            if(SYMBOLS.includes(char)){
                operation = char;
                lastOperator = true;
            }

            stack = [];
        }
        else{
            stack.push(char);
            lastOperator = false;
        }
        hasInput = true;
    }



    if(hasInput = true){
       for(let i = 1; i < HISTORY.length; i++)
           updateHistory(HISTORY[i-1], HISTORY[i]);
       
       updateHistory(HISTORY[HISTORY.length-1], INPUT, solution);
       updateInputLine();

    }   

}

function clear(){
    INPUT.querySelector('#equation').textContent = '';

    if(singleClear === true){
        for(let i = 0; i < HISTORY.length; i++){
            HISTORY[i].querySelector('#equation').textContent = '';
            HISTORY[i].querySelector('#equals').textContent = '';
            HISTORY[i].querySelector('#answer').textContent = '';
        }
    singleClear = false;
    }
}


function appendInput(pressedButton){
    if(INPUT.querySelector("#equation").textContent.length < 25)
        INPUT.querySelector("#equation").textContent += pressedButton;
}


function add(num1, num2){
    return num1 + num2;
}

function subtract(num1, num2){
    return num1 - num2;

}

function multiply(num1, num2){
    return num1 * num2;

}

function divide(num1, num2){
    if(num2 === 0){
        error("Can not divide by 0!");
        return;
    }
    return num1 / num2;
}


function press(pressedButton){
    switch(pressedButton){
        case 'C':
            clear();
            singleClear = true;
            break;
        case '=':
            operate();
            singleClear = false;
            break;
        default:
            appendInput(pressedButton);
            singleClear = false;
            break;
    }
}


function error(message){
    alert("ERROR: " + message);
    updateInputLine();
}