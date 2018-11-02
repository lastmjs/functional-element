import { html } from 'lit-html';
import { functionalElement } from '../functional-element';
import './calc-screen';
import './calc-buttons';

functionalElement('calc-app', calcApp);

function calcApp({ props, update, constructing }) {
    if (constructing) {
        return {
            props: {
                screenValue: ''
            }
        };
    }

    return {
        props,
        template: html`
            <calc-screen .screenValue=${props.screenValue}></calc-screen>
            <calc-buttons
                @character=${(e) => update(addToScreen(props.screenValue, e.detail.character))}
                @calculate=${() => update(calculate(props.screenValue))}
            >
            </calc-buttons>
        `
    };
}

function addToScreen(screenValue, newValue) {
    return {
        props: {
            screenValue: screenValue === 'Syntax error' ? newValue : `${screenValue}${newValue}`
        }
    };
}

function calculate(screenValue) {
    try {
        const result = eval(screenValue);
        return {
            props: {
                screenValue: result
            }
        };
    }
    catch(error) {
        return {
            props: {
                screenValue: 'Syntax error'
            }
        };
    }
}