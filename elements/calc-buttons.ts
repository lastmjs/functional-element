import { html } from 'lit-html';
import { functionalElement } from '../functional-element';

functionalElement('calc-buttons', calcButtons);

function calcButtons({ props, element }) {
    return {
        props,
        template: html`
            <style>
                .number-button {
                    width: 50px;
                    height: 50px;
                    border: solid 1px black;
                    text-align: center;
                    cursor: pointer;
                }
            </style>

            <div class="number-button" @click=${() => addCharacter('0', element)}>0</div>
            <div class="number-button" @click=${() => addCharacter('1', element)}>1</div>
            <div class="number-button" @click=${() => addCharacter('2', element)}>2</div>
            <div class="number-button" @click=${() => addCharacter('3', element)}>3</div>
            <div class="number-button" @click=${() => addCharacter('4', element)}>4</div>
            <div class="number-button" @click=${() => addCharacter('5', element)}>5</div>
            <div class="number-button" @click=${() => addCharacter('6', element)}>6</div>
            <div class="number-button" @click=${() => addCharacter('7', element)}>7</div>
            <div class="number-button" @click=${() => addCharacter('8', element)}>8</div>
            <div class="number-button" @click=${() => addCharacter('9', element)}>9</div>
            <div class="number-button" @click=${() => addCharacter('*', element)}>*</div>
            <div class="number-button" @click=${() => addCharacter('/', element)}>/</div>
            <div class="number-button" @click=${() => addCharacter('+', element)}>+</div>
            <div class="number-button" @click=${() => addCharacter('-', element)}>-</div>
            <div class="number-button" @click=${() => calculate(element)}>=</div>
        `
    };
}

function addCharacter(character, element) {
    element.dispatchEvent(new CustomEvent('character', {
        detail: {
            character
        }
    }));
}

function calculate(element) {
    element.dispatchEvent(new CustomEvent('calculate'));
}