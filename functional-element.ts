import { render, TemplateResult } from 'lit-html';
import { 
    UserFunctionOptions,
    UserFunctionResult,
    Props,
    FunctionalElement,
    UserFunction
} from './index.d'; 

export { html } from 'lit-html';

export function customElement(tagName: string, userFunction: UserFunction) {
    window.customElements.define(tagName, class extends HTMLElement {
        props: Props;

        constructor() {
            super();

            this.props = {};

            const userResult: Props | undefined = userFunction({
                props: this.props,
                update: this.update.bind(this),
                constructing: true,
                connecting: false,
                disconnecting: false,
                adopting: false,
                element: this
            });

            if (userResult === undefined) {
                return;
            }

            this.props = calculateProps(userResult);
            createPropertyAccessors(this, userFunction);

            //TODO I don't believe this is ever allowed in a constructor, the result of the constructor cannot have children is the error that keeps coming up
            // if (userResult && userResult.template) {
            //     render(userResult.template, this);
            // }
        }

        connectedCallback() {
            applyUserResult(userFunction, {
                props: this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: true,
                disconnecting: false,
                adopting: false,
                element: this
            });
        }

        disconnectedCallback() {
            applyUserResult(userFunction, {
                props: this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: false,
                disconnecting: true,
                adopting: false,
                element: this
            });
        }

        adoptedCallback() {
            applyUserResult(userFunction, {
                props: this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: false,
                disconnecting: false,
                adopting: true,
                element: this
            });
        }

        update(props?: Props) {
            if (props !== undefined) {
                this.props = calculateProps(props);
            }

            applyUserResult(userFunction, {
                props: this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: false,
                disconnecting:false,
                adopting: false,
                element: this
            });
        }
    });
}

//TODO perhaps to allow asynchronous property setting here we can do an async reduce
//TODO look into asynchronous property setters though, I don't think we'll be able to allow that
function calculateProps(props: Props) {
    return Object.keys(props).reduce((result: Props, propKey: string) => {
        const propValue = props[propKey];
        return {
            ...result,
            [propKey]: typeof propValue === 'function' ? propValue() : propValue
        };
    }, {});
}

function applyUserResult(userFunction: UserFunction, userFunctionOptions: UserFunctionOptions) {
    const userResult: UserFunctionResult = userFunction(userFunctionOptions);
    
    if (userResult === undefined) {
        throw new Error('Nothing returned from element function');
    }

    render(<TemplateResult> userResult, userFunctionOptions.element);

    //TODO we might want to throw something here
}

function createPropertyAccessors(element: FunctionalElement, userFunction: UserFunction) {
    Object.keys(element.props).forEach((propsKey) => {
        Object.defineProperty(element, propsKey, {
           set (val) {
                element.props = {
                    ...element.props,
                    [propsKey]: typeof val === 'function' ? val() : val
                };

                applyUserResult(userFunction, {
                    props: element.props,
                    update: element.update.bind(this),
                    constructing: false,
                    connecting: false,
                    disconnecting: false,
                    adopting: false,
                    element: this
                });
           },
           get () {
               return element.props[propsKey];
           }
        });
    });
}