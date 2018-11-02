import { html } from 'lit-html';
import { functionalElement } from '../functional-element';

functionalElement('calc-screen', calcScreen);

function calcScreen({ props, constructing }) {
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
            <style>
                .screen {
                    width: 500px;
                    height: 50px;
                    border: solid 1px black;
                    text-align: right;
                }
            </style>

            <div class="screen">${props.screenValue}</div>
        `
    };
}