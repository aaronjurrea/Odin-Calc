/**
 * A NodeList of all button elements in the document.
 * These buttons are used for the calculator's input interface.
 * @type {NodeListOf<HTMLButtonElement>}
 */
const BUTTONS = document.querySelectorAll("button");


/**
 * A NodeList of all elements with the class "display" and ID "history".
 * These elements represent the history of equations and results displayed on the calculator.
 * @type {NodeListOf<HTMLElement>}
 */
const HISTORY = document.querySelectorAll(".display .row#history");


/**
 * The element with the class "display" and ID "input".
 * This element represents the current input line of the calculator.
 * @type {HTMLElement}
 */
const INPUT = document.querySelector(".display .row#input");

/**
 * An array containing valid operator symbols for the calculator.
 * These operators are used in arithmetic operations.
 * @type {string[]}
 */
const OPERATORS = ["+", "-", "*", "/", "%"];


/**
 * An array containing valid number symbols for the calculator.
 * These numbers are used in the input and calculation process.
 * @type {string[]}
 */
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];


/**
 * The element within INPUT with the ID "equation".
 * This element represents the current equation being input or displayed in the calculator.
 * @type {HTMLElement}
 */
let inputLine = INPUT.querySelector("#equation");


/**
 * Adds a click event listener to each button in the BUTTONS array.
 * When a button is clicked, the `press` function is called with the button's text content as an argument.
 */
BUTTONS.forEach((button) => {
    button.addEventListener("click", function(){
        press(button.textContent);
    });
})


/**
 * Handles the button press events and performs corresponding actions based on the button's text content.
 * Clears the input, executes the operation, performs a backspace, or appends input based on the pressed button.
 * @example
 * press('AC'); // Clears the input and history
 * press('='); // Performs the calculation
 * press('⌫'); // Removes the last character in the input
 * press('5'); // Appends '5' to the input
 * @param {string} pressedButton - The text content of the pressed button.
 */
function press(pressedButton){
    switch(pressedButton){
        case 'AC':
            clear();
            return;
        case '=':
            operate();
            break;
        case '⌫':
            backspace();
            break;
        default:
            appendInput(pressedButton);
            break;
    }
    singleClear = false;
}


/**
 * Returns the last element of the array without removing it.
 * This method can be called on any array to retrieve its last element.
 * @example
 * const array = [1, 2, 3, 4];
 * const lastElement = array.peek(); // lastElement is 4
 * @returns {*} The last element of the array.
 */
Array.prototype.peek = function() {
    return this[this.length - 1];
};


/**
 * Executes the arithmetic operations based on the input equation.
 * Parses the input, processes each character, and performs the calculations using the specified operations.
 * Updates the history with the final result.
 * @returns {number|undefined} The result of the computations, or undefined if an error occurs during parsing or computation.
 */
function operate(){
    let input = parseCheck();

    if(!input)
        return;

    input = input.reverse();

    let char = input.pop(), stack = [],
        solution, operation = ''

    while(char !== undefined){
        if(char === 'A')
            char = HISTORY[HISTORY.length-1].querySelector("#answer").textContent;

        if(OPERATORS.includes(char) || input.length === 0){
            let value;

            if(!OPERATORS.includes(char))
                stack.push(char);

            value = Number(stack.join(''));

            console.log(value);
            if(operation !== '')
                solution = compute(operation, solution, value);

            else
                solution = value;

            operation = char;
            stack = [];

        }
        else
            stack.push(char);

        char = input.pop();
    }

    if(solution !== undefined){
        solution = Math.round(solution * 1000)/1000;
        updateHistory(solution);
    }

    return solution;
}


/**
 * Parses and validates the input equation for correctness.
 * Checks for various conditions such as consecutive operators, misplaced decimals, and proper placement of the ANS keyword.
 * If any error is found, the corresponding error message is returned.
 * @returns {Array|string} The parsed array of characters if the input is valid, or an error message if invalid.
 */
function parseCheck(){
    let input = inputLine.textContent.split('').reverse(),
        parsed = [],
        char = '', length = input.length, hasDecimal = false;

    for(let i = 0; i < length; i++){
        char = input.pop();

        if(char === 'A'){
            input.pop();
            input.pop();
            length-=2;
        }

        if(char === 'A'){
            if(!OPERATORS.includes(input.peek()))
                return error("ANS must be followed by an operator!");
        }

        else if(OPERATORS.includes(char)){
            if(OPERATORS.includes(input.peek()))
                return error("Operator can not be followed by an operator!");
            hasDecimal = false;
        }

        else if(char === '.'){
            if(hasDecimal)
                return error("Can not have multiple decimals in number!");
            else if(OPERATORS.includes(input.peek()) || input.peek() === 'A')
                return error("Decimal must be followed by number!");
            hasDecimal = true;
        }
        else if (NUMBERS.includes(char)){
            if(input.peek() === 'A')
                return error("Number must be followed by operator or decimal!");
        }
        else if(i === 0){
            if(char === '.')
                return error("Equation can not begin with decimal!");
            else if(OPERATORS.includes(char))
                return error("Equation can not begin with operator!");
        }
        else if(i === length - 1){
            if(char === '.')
                return error("Equation can not end with decimal!");
            else if(OPERATORS.includes(char))
                return error("Equation can not end with operator!");
        }
        parsed.push(char);
    }

    return parsed;
}


/**
 * Computes the result of an arithmetic operation between the given solution and value.
 * Supports addition, subtraction, multiplication, division, and modulo operations.
 * Calls the corresponding function for each operation.
 * @example
 * const result = compute('+', 5, 3); // result is 8
 * @param {string} operation - The operator indicating the type of arithmetic operation ('+', '-', '*', '/', '%').
 * @param {number} solution - The initial value to be used in the computation.
 * @param {number} value - The value to be applied to the solution using the specified operation.
 * @returns {number|undefined} The result of the computation, or undefined if the operation results in an error (e.g., division by zero).
 */
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


/**
 * Adds two numbers and returns the result.
 * @example
 * const result = add(5, 3); // result is 8
 * @param {number} num1 - The first number to be added.
 * @param {number} num2 - The second number to be added.
 * @returns {number} The sum of num1 and num2.
 */
function add(num1, num2){ return num1 + num2; }


/**
 * Subtracts two numbers and returns the result.
 * @example
 * const result = subtract(5, 3); // result is 2
 * @param {number} num1 - The first number to be subtracted.
 * @param {number} num2 - The second number to be subtracted.
 * @returns {number} The difference of num1 and num2.
 */
function subtract(num1, num2){ return num1 - num2; }


/**
 * Multiplies two numbers and returns the result.
 * @example
 * const result = multiply(5, 3); // result is 15
 * @param {number} num1 - The first number to be multiplied.
 * @param {number} num2 - The second number to be multiplied.
 * @returns {number} The product of num1 and num2.
 */
function multiply(num1, num2){ return num1 * num2; }


/**
 * Divides the first number by the second number and returns the result.
 * If the second number is zero, an error message is returned and the function returns undefined.
 * @example
 * const result = divide(10, 2); // result is 5
 * @example
 * const result = divide(10, 0); // result is undefined, error message is displayed
 * @param {number} num1 - The dividend.
 * @param {number} num2 - The divisor.
 * @returns {number|undefined} The quotient of num1 divided by num2, or undefined if num2 is zero.
 */
function divide(num1, num2){
    if(num2 === 0){
        error("Can not divide by 0!");
        return undefined;
    }
    return num1 / num2;
}


/**
 * Returns the remainder of the division of the first number by the second number.
 * @example
 * const result = modulo(10, 3); // result is 1
 * @param {number} num1 - The dividend.
 * @param {number} num2 - The divisor.
 * @returns {number} The remainder of num1 divided by num2.
 */
function modulo(num1, num2){ return num1 % num2; }


/**
 * Clears the input line or the entire history display based on the current state of the input line.
 * If the input line is already empty, it clears all the rows in the HISTORY NodeList.
 * Otherwise, it clears only the input line.
*/
function clear(){
    if(inputLine.textContent === ''){
        for(let i = 0; i < HISTORY.length; i++){
            HISTORY[i].querySelector('#equation').textContent = '';
            HISTORY[i].querySelector('#equals').textContent = '';
            HISTORY[i].querySelector('#answer').textContent = '';
        }
    }
    else
        inputLine.textContent = '';
}


/**
 * Removes the last character from the input line.
 * If the last character is part of the "ANS" keyword, it removes the last three characters.
 * Otherwise, it removes only the last character.
*/
function backspace(){
    if(inputLine.textContent[inputLine.textContent.length - 1] === 'S')
        inputLine.textContent = inputLine.textContent.slice(0, -3);
    else
        inputLine.textContent = inputLine.textContent.slice(0, -1);
}

/**
 * Appends the pressed button's text content to the input line with certain constraints.
 * Ensures the input line does not exceed 25 characters and manages specific rules for operators and the "ANS" keyword.
 * @param {string} pressedButton - The text content of the pressed button to be appended to the input line.
 */
function appendInput(pressedButton){
    if(inputLine.textContent.length < 25){
        if(inputLine.textContent.length === 0 && OPERATORS.includes(pressedButton))
            appendInput('ANS');
        else if(inputLine.textContent.length >= 22 && pressedButton === 'ANS')
            return;
        inputLine.textContent += pressedButton;
    }
}


/**
 * Clears the text content of the inputLine element.
 * This function sets the text content of the element with ID "equation" within the INPUT element to an empty string.
 */
function updateInputLine(){
    inputLine.textContent = '';
}


/**
 * Updates the history display with the latest calculation.
 * Shifts the content of each row in the HISTORY NodeList up by one position,
 * and inserts the current input line and solution into the last row.
 * @param {*} solution - The solution to the current calculation, which will be displayed in the last history row.
 */
function updateHistory(solution){
    for(let i = 1; i < HISTORY.length; i++){
        HISTORY[i-1].querySelector('#equation').textContent
            = HISTORY[i].querySelector('#equation').textContent;
        HISTORY[i-1].querySelector('#equals').textContent
            = HISTORY[i].querySelector('#equals').textContent;
        HISTORY[i-1].querySelector('#answer').textContent
            = HISTORY[i].querySelector('#answer').textContent;
     }

    HISTORY[HISTORY.length-1].querySelector("#equation").textContent = inputLine.textContent;
    HISTORY[HISTORY.length-1].querySelector("#equals").textContent = '=';
    HISTORY[HISTORY.length-1].querySelector("#answer").textContent = solution.toString();

    updateInputLine();
}








