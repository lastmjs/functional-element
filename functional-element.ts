import { render, TemplateResult } from 'lit-html';
import { 
    CustomElementDefinerResult,
    Props,
    FunctionalElement,
    CustomElementDefinerOptions,
    CustomElementDefiner
} from './index.d'; 

export { html } from 'lit-html';

export function customElement(tagName: string, customElementDefiner: CustomElementDefiner) {
    window.customElements.define(tagName, class extends HTMLElement {
        props: Props = {};

        constructor() {
            super();

            (async () => {
                const customElementDefinerResult: CustomElementDefinerResult = await customElementDefiner({
                    update: this.update.bind(this),
                    constructing: true,
                    connecting: false,
                    disconnecting: false,
                    adopting: false,
                    element: this
                });

                if (checkIfCustomElementDefinerResultIsProps(customElementDefinerResult)) {
                    this.props = {
                        ...this.props,
                        ...customElementDefinerResult
                    };
                    createPropertyAccessors(this, customElementDefiner);
                }

                this.dispatchEvent(new CustomEvent('constructed'));
            })();    
        }

        async connectedCallback() {
            this.addEventListener('constructed', async () => {
                await applyCustomElementDefinerResult(this, customElementDefiner, {
                    ...this.props,
                    update: this.update.bind(this),
                    constructing: false,
                    connecting: true,
                    disconnecting: false,
                    adopting: false,
                    element: this
                });
    
                this.dispatchEvent(new CustomEvent('connected'));  
            });
        }

        async disconnectedCallback() {
            await applyCustomElementDefinerResult(this, customElementDefiner, {
                ...this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: false,
                disconnecting: true,
                adopting: false,
                element: this
            });

            this.dispatchEvent(new CustomEvent('disconnected'));
        }

        async adoptedCallback() {
            await applyCustomElementDefinerResult(this, customElementDefiner, {
                ...this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: false,
                disconnecting: false,
                adopting: true,
                element: this
            });

            this.dispatchEvent(new CustomEvent('adopted'));
        }

        async update(customElementDefinerResult: CustomElementDefinerResult) {
            // TODO try to get rid of the type assertions, we might be able to create a better check that returns the correct type?
            if (checkIfCustomElementDefinerResultIsProps(customElementDefinerResult)) {
                this.props = {
                    ...this.props,
                    ...customElementDefinerResult
                };
            }

            await applyCustomElementDefinerResult(this, customElementDefiner, {
                ...this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: false,
                disconnecting:false,
                adopting: false,
                element: this
            });

            this.dispatchEvent(new CustomEvent('updated'));
        }
    });
}

//TODO perhaps to allow asynchronous property setting here we can do an async reduce
//TODO look into asynchronous property setters though, I don't think we'll be able to allow that
// function calculateProps(props: Props) {
//     return Object.keys(props).reduce((result: Props, propKey: string) => {
//         const propValue = props[propKey];
//         return {
//             ...result,
//             [propKey]: propValue
//         };
//     }, {});
// }

async function applyCustomElementDefinerResult(element: FunctionalElement, customElementDefiner: CustomElementDefiner, customElementDefinerOptions: CustomElementDefinerOptions): Promise<void> {
    const customElementDefinerResult: CustomElementDefinerResult = await customElementDefiner(customElementDefinerOptions);

    // TODO try to get rid of the type assertions, we might be able to create a better check that returns the correct type?
    if (checkIfCustomElementDefinerResultIsProps(customElementDefinerResult)) {
        element.props = {
            ...element.props,
            ...customElementDefinerResult
        };

        await applyCustomElementDefinerResult(element, customElementDefiner, {
            ...element.props,
            update: element.update.bind(element),
            constructing: false,
            connecting: false,
            disconnecting: false,
            adopting: false,
            element
        });
    }

    if (checkIfCustomElementDefinerResultIsTemplateResult(customElementDefinerResult)) {
        render(customElementDefinerResult as TemplateResult, customElementDefinerOptions.element);
    }
}

function createPropertyAccessors(element: FunctionalElement, customElementDefiner: CustomElementDefiner) {
    Object.keys(element.props).forEach((propsKey) => {
        Object.defineProperty(element, propsKey, {
           set (val) {
                element.props = {
                    ...element.props,
                    [propsKey]: val
                };

                applyCustomElementDefinerResult(element, customElementDefiner, {
                    ...element.props,
                    update: element.update.bind(element), // TODO not sure if the context is correct here
                    constructing: false,
                    connecting: false,
                    disconnecting: false,
                    adopting: false,
                    element // TODO not sure if the context is correct here
                });
           },
           get () {
               return element.props[propsKey];
           }
        });
    });
}

function checkIfCustomElementDefinerResultIsTemplateResult(customElementDefinerResult: CustomElementDefinerResult): boolean {
    return (
        customElementDefinerResult !== null &&
        customElementDefinerResult !== undefined &&
        customElementDefinerResult.constructor &&
        customElementDefinerResult.constructor.name === 'TemplateResult'
    );
}

function checkIfCustomElementDefinerResultIsProps(customElementDefinerResult: CustomElementDefinerResult): boolean {
    return (
        customElementDefinerResult !== null &&
        customElementDefinerResult !== undefined &&
        customElementDefinerResult.constructor &&
        customElementDefinerResult.constructor.name === 'Object'
    );
}