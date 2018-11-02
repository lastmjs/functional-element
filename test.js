//TODO look into getting rid of the render function, that's the only thing allowing side effects in the main flow right now
//TODO it would be really nice to just return directly from the function...the problem we're facing now is updating the props, and responding to event listeners

import { html, render } from 'lit-html';

functionalElement('functional-element', ['buttonText'], (props, update, constructing, connecting) => {
    if (constructing) {
        return {
            props: {
                buttonText: 'Not clicked'
            }
        };
    }

    return {
        props,
        template: html`
            <div>
                <button @click=${() => update(buttonClicked(props))}>${props.buttonText}</button>
            </div>
        `
    };
});

function buttonClicked(props) {
    return {
        props: {
            buttonText: props.buttonText === 'Not clicked' ? 'Clicked' : 'Not clicked'
        }
    };
}

function functionalElement(tagName, propNames, userFunction) {
    window.customElements.define(tagName, class extends HTMLElement {

        constructor() {
            super();

            this.props = {};

            const userResult = userFunction(this.props, this.update.bind(this), true, false);

            if (userResult.props) {
                this.props = userResult.props;
            }

            if (userResult.template) {
                render(userResult.template, this);
            }

            propNames.forEach((propName) => {
                Object.defineProperty(Object.getPrototypeOf(this), propName, {
                   set (val) {
                        this.props = {
                            ...this.props,
                            [propName]: val
                        };

                        const userResult = userFunction(this.props, this.update.bind(this), false, false);

                        if (userResult.props) {
                            this.props = userResult.props;
                        }

                        if (userResult.template) {
                            render(userResult.template, this);
                        }
                   },
                   get () {
                       return this.props[propName];
                   }
                });
            });
        }

        connectedCallback() {
            const userResult = userFunction(this.props, this.update.bind(this), false, true);

            if (userResult.props) {
                this.props = userResult.props;
            }

            if (userResult.template) {
                render(userResult.template, this);
            }
        }

        update(updateResult) {
            this.props = updateResult.props;

            const userResult = userFunction(this.props, this.update.bind(this), false, false);

            if (userResult.props) {
                this.props = userResult.props;
            }

            if (userResult.template) {
                render(userResult.template, this);
            }
        }
    });
}