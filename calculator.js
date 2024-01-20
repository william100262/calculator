//I begin my retrieving all the ".key" elements and retrieving the ".display . input" element as well
//as the ".display .output" element.

const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

//I define a variable called "input" and set it to an empty string. This is because when you first use
//a calculator their is no input to begin with, the user has to decide what to input
let input = "";

//This varible will be used to track decimals to make sure a user can't enter crazy numbers such as "9.3.62."
let decimalTracker = false;

//This is where the calculator logic begins.
//I create a for loop that takes every "key" element in the "keys" div  
for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        //If the value of the key is clear, the display input and output should be empty and show nothing
        if (value == 'clear') {
            input = '';
            decimalTracker = false;
            display_input.innerHTML = '';
            display_output.innerHTML = '';
        //If the user clicks the 'backspace' key, the input would slice deleting the last index(which is -1)
        } else if (value == 'backspace') {
            input = input.slice(0, -1);
            if (input.slice(-1) === ".") {
                decimalTracker = true;
            } else {
                decimalTracker = false;
            }
            display_input.innerHTML = CleanInput(input);
        //I decied to let javascript solve the users problems hence why I used the function "eval" when the user presses "="
        } else if (value == '=') {
            let result = eval(PrepareInput(input));
            display_output.innerHTML = CleanOutput(result);
        //The code for the brackets lets the calcultor know when it should use a open or close bracket,
        //so if the user presses the brackets button it will put a open bracket and when they press it again
        //it will be a close bracket.
        } else if (value == 'brackets') {
            if (
                input.indexOf("(") == -1 ||
                input.indexOf("(") != -1 &&
                input.indexOf(")") != -1 &&
                input.lastIndexOf("(") < input.lastIndexOf(")")
            ) {
                input += "(";
            } else if (
                input.indexOf(")") == -1 ||
                input.indexOf(")") != -1 &&
                input.indexOf("(") != -1 &&
                input.lastIndexOf(")") < input.lastIndexOf("(")
            ) {
                input += ")";
            }
            display_input.innerHTML = CleanInput(input);
        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
    })
}

//After the calcultor logic, I then clean the input. For example, if you look at the HTML for the multiplication operator
//I used "*" so javascript can do the multiplication. But I want the user to see an actually "x" when they press the
//multiplication key insted of "*". The clean input allows me to do this

let CleanInput = (input) => {
    let input_array = input.split('');
    let input_array_length = input_array.length;

    for(let i = 0; i < input_array_length; i++) {
        if(input_array[i] == "*") {
            input_array[i] = '<span class="operator">x</span>';
        } else if (input_array[i] == "/") {
            input_array[i] = '<span class="operator">÷</span>';
        } else if (input_array[i] == "+") {
            input_array[i] = '<span class="operator">+</span>';
        } else if (input_array[i] == "-") {
            input_array[i] = '<span class="operator">-</span>';
        } else if (input_array[i] == "(") {
            input_array[i] = '<span class="brackets">(</span>';
        } else if (input_array[i] == ")") {
            input_array[i] = '<span class="brackets">)</span>';
        } else if(input_array[i] == "%") {
            input_array[i] = '<span class="percent">%</span>';
        }
    }
    return input_array.join("");
}

//I clean the ouput so answers larger then 3 digits on the calculator show commas and decimals also show up
//in the answers.

let CleanOutput = (output) => {
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];

    let output_array = output_string.split("");

    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }

    if (decimal) {
        output_array.push(".");
        output_array.push(decimal);
    }

    return output_array.join("");
}

//Validating the input so the user can't use an addition sign right after an adittion sign or let
//users put in crazy stuff such as "6++7.8.9.3--6" 
let ValidateInput = (value) => {
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/"];

    if (value == "." && decimalTracker) {
        return false;
    }

    if (value == ".") {
        decimalTracker = true;
    }

    if (value == "%" && last_input == "%") {
        return false;
    }


    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            decimalTracker = false;
            return true;
        }
    }
    
    return true;
}

//Lastly I prepare the input. Since I am using the "eval" function to solve the user problems javascript might read 
//some problems wrong and give wrong answers. Here I make sure javascript knows if a percent is being used, you 
//have to divided the number by 100. Also if a user puts a number such as "021" javascript might read it wrong
//since it starts with a "0". The for loop below makes sure that any number that beigns with a "0" that the 
//"0" is replaced with whitespace(the 0 is now gone).
let PrepareInput = (input) => {
    let input_check = input.replace(/%/g, "/100");
    let tokens = input_check.match(/(\d+\.\d+|\d+|\S)/g) || [];

    for (let i = 0; i < tokens.length; i++) {
        if (!isNaN(tokens[i]) && tokens[i][0] === '0' && tokens[i].length > 1 && tokens[i][1] !== '.') {
            tokens[i] = tokens[i].replace(/^0+/, '');
        }
    }

    return tokens.join('');
}


