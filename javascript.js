const BUTTONS = document.querySelectorAll("button");
const HISTORY = document.querySelectorAll(".display .row#history");
const INPUT = document.querySelector(".display .row#input");

let input = document.querySelector(".row#input").querySelector("#equation");

BUTTONS.forEach((button) => {
    button.addEventListener("click", function(){
        press(button.textContent);
    });
})

function clear(){
    input.textContent = '';
}

function operate(){

}

function appendInput(pressedButton){
    if(input.textContent.length < 25)
        input.textContent += pressedButton;
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
            break;
        case '=':
            operate();
            break;
        default:
            appendInput(pressedButton);
            break;
    }
}