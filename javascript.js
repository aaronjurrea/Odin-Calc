const BUTTONS = document.querySelectorAll("button");
const HISTORY = document.querySelectorAll(".display .row#history");
const INPUT = document.querySelector(".display .row#input");

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
    let input = INPUT.querySelector("#equation").textContent.split('');
    let parseStack = [];

    let solution = 0;

    // We will use a stack which we parse characters to, while popping from the current input stack
    //  So we can respect order of operations
    while(input.length > 0){
        // This variable represents our current value (whether it's a symbol or a number)
        let currChar = input.shift();
        let currSymbol = '';
        
        if(currChar !== '+' && currChar !== '-' && currChar !== '*' && currChar !== '/')
            parseStack.push(currChar);

        // If our current character is a symbol, we want to compare the previous character with next character
        else{
            //  However, if the stack is empty or the last character is a symbol, we'll throw an error
            if(parseStack.length === 0 || !typeof parseStack[parseStack.length-1] === 'number'){
                error();
                return;
            }
            // Here we see if there is already a current symbol, then we need to perform operations on the previous values before continuing
            else if(currSymbol !== ''){
                let var1 = 0, var2 = 0, tempArray = [];
                while(typeof parseStack[parseStack.length-1] === 'number'){
                    tempArray.push(parseStack.shift());
                }
                var1 = Number(parseStack.join(''));
                parseStack.shift();
                tempArray = [];

                while(parseStack[parseStack.length-1] > 0){
                    tempArray.push(parseStack.shift());
                }
                var2 = Number(parseStack.join(''));
            }
        

        }

        if(input.length === 0){
            solution = Number(parseStack.join(''));
        }
    }

    for(let i = 1; i < HISTORY.length; i++){
        updateHistory(HISTORY[i-1], HISTORY[i]);
    }

    updateHistory(HISTORY[HISTORY.length-1], INPUT, solution);
    updateInputLine();

    singleClear = false;
    

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


function add(...args){

}

function subtract(...args){

}

function mutliply(...args){
    
}

function divide(...args){

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


function error(){
    alert("ERROR!");
}