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

            if (userFunction.constructor.name === 'AsyncFunction') {
                (async () => {
                    this.props = {};
    
                    const userResult: Props | undefined = await userFunction({
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
    
                    this.dispatchEvent(new CustomEvent('constructed'));
                })();    
            }
            else {
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

                this.dispatchEvent(new CustomEvent('constructed'));
            }
        }

        async connectedCallback() {
            await applyUserResult(userFunction, {
                props: this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: true,
                disconnecting: false,
                adopting: false,
                element: this
            });

            this.dispatchEvent(new CustomEvent('connected'));
        }

        async disconnectedCallback() {
            await applyUserResult(userFunction, {
                props: this.props,
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
            await applyUserResult(userFunction, {
                props: this.props,
                update: this.update.bind(this),
                constructing: false,
                connecting: false,
                disconnecting: false,
                adopting: true,
                element: this
            });

            this.dispatchEvent(new CustomEvent('adopted'));
        }

        async update(props?: Props) {
            if (props !== undefined) {
                this.props = calculateProps(props);
            }

            await applyUserResult(userFunction, {
                props: this.props,
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
function calculateProps(props: Props) {
    return Object.keys(props).reduce((result: Props, propKey: string) => {
        const propValue = props[propKey];
        return {
            ...result,
            [propKey]: typeof propValue === 'function' ? propValue() : propValue
        };
    }, {});
}

async function applyUserResult(userFunction: UserFunction, userFunctionOptions: UserFunctionOptions) {
    const userResult: UserFunctionResult = await userFunction(userFunctionOptions);
    
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