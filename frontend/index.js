import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentValue = '';
let operator = '';
let previousValue = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value >= '0' && value <= '9' || value === '.') {
            currentValue += value;
            display.value = currentValue;
        } else if (value === 'C') {
            clear();
        } else if (value === '=') {
            calculate();
        } else {
            if (currentValue !== '') {
                if (previousValue !== '') {
                    calculate();
                }
                operator = value;
                previousValue = currentValue;
                currentValue = '';
            }
        }
    });
});

function clear() {
    currentValue = '';
    operator = '';
    previousValue = '';
    display.value = '';
}

async function calculate() {
    if (previousValue !== '' && currentValue !== '' && operator !== '') {
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);
        let result;

        try {
            switch (operator) {
                case '+':
                    result = await backend.add(prev, current);
                    break;
                case '-':
                    result = await backend.subtract(prev, current);
                    break;
                case '*':
                    result = await backend.multiply(prev, current);
                    break;
                case '/':
                    const divisionResult = await backend.divide(prev, current);
                    if (divisionResult === null) {
                        throw new Error('Division by zero');
                    }
                    result = divisionResult;
                    break;
            }

            display.value = result;
            previousValue = result.toString();
            currentValue = '';
            operator = '';
        } catch (error) {
            display.value = 'Error';
            console.error('Calculation error:', error);
        }
    }
}