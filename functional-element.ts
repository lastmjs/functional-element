import { render } from 'lit-html';

interface UserResult {

}

export function functionalElement(tagName, userFunction) {
    window.customElements.define(tagName, class extends HTMLElement {
        props: {};

        constructor() {
            super();

            this.props = {};

            const userResult = userFunction({
                props: this.props,
                update: this.update.bind(this),
                constructing: true,
                connecting: false,
                disconnecting: false,
                adopting: false,
                element: this
            });

            if (userResult.props) {
                this.props = calculateProps(userResult.props);
                createPropertyAccessors(this, userFunction);
            }

            if (userResult.template) {
                render(userResult.template, this);
            }
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

        update(userResult) {
            this.props = calculateProps(userResult.props);
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
function calculateProps(props) {
    return Object.entries(props).reduce((result, propsEntry) => {
        const propKey = propsEntry[0];
        const propValue = propsEntry[1];

        return {
            ...result,
            [propKey]: typeof propValue === 'function' ? propValue() : propValue
        };
    }, {});
}

function applyUserResult(userFunction, userFunctionsOptions) {
    const userResult = userFunction(userFunctionsOptions);
    
    if (userResult === undefined) {
        throw new Error('Nothing returned from element function');
    }

    if (userResult.props) {
        userFunctionsOptions.element.props = calculateProps(userResult.props);
    }

    if (userResult.template) {
        render(userResult.template, userFunctionsOptions.element);
    }

    //TODO we might want to throw something here
}

function createPropertyAccessors(element, userFunction) {
    Object.keys(element.props).forEach((propsKey) => {
        Object.defineProperty(Object.getPrototypeOf(element), propsKey, {
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