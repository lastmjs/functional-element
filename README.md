[![npm version](https://img.shields.io/npm/v/functional-element.svg?style=flat)](https://www.npmjs.com/package/functional-element) [![dependency Status](https://david-dm.org/lastmjs/functional-element/status.svg)](https://david-dm.org/lastmjs/functional-element) [![devDependency Status](https://david-dm.org/lastmjs/functional-element/dev-status.svg)](https://david-dm.org/lastmjs/functional-element?type=dev)

# functional-element

`functional-element` exposes the custom element API in a functional manner. It allows you to express your custom element's behavior as a function. The custom element lifecycle is exposed through parameters to your function. You simply return a template and props as needed. Templating is currently handled by `lit-html`. Hook up event listeners with simple functions. No more classes, methods, or inheritance.

## Live demo

* Tic tac toe demo:
* Tic tac toe code: https://github.com/lastmjs/tic-tac-toe

* Calculator demo: https://mwad-functional-element.netlify.com
* Calculator code: https://github.com/lastmjs/mwad-functional-element

## Installation

```bash
npm install functional-element
```

## Use

`functional-element` produces bonafide custom elements. Use them as follows:

```html
<!DOCTYPE html>

<html>
    <head>
        <script type="module" src="example-element.js"></script>
    </head>

    <body>
        <example-element></example-element>
    </body>
</html>
```

Create them as follows:

```javascript
import { html, customElement } from 'functional-element';

customElement('example-element', ({ props, constructing }) => {
    if (constructing) {
        return {
            hello: 'world!'
        };
    }

    return html`
        <div>${props.hello}</div>
    `;
});
```

### Lifecycle

```javascript
import { html, customElement } from 'functional-element';

customElement('example-element', ({ constructing, connecting, disconnecting, adopting }) => {
    if (constructing) {
        console.log(`We're in the constructor!`);
    }

    if (connecting) {
        console.log(`We're in the connectedCallback!`);
    }

    if (disconnecting) {
        console.log(`We're in the disconnectedCallback!`);
    }

    if (adopting) {
        console.log(`We're in the adopted callback!`);
    }

    return html`
        <div>It's the cycle of life!</div>
    `;
});
```

## Properties

```javascript
import { html, customElement } from 'functional-element';

customElement('example-element', ({ props, constructing }) => {
    if (constructing) {
        return {
            regularProp: `Just your average property`,
            computedProp: () => {
                return `This property was made by a function`;
            }
        };
    }

    return html`
        regularProp: <div>${props.regularProp}</div>
        computedProp: <div>${props.computedProp}</div>
    `;
});
```

## Listening to events

```javascript
import { html, customElement } from 'functional-element';

customElement('example-element', ({ props, constructing, update }) => {
    if (constructing) {
        return {
            count: 0
        };
    }

    return html`
        <button @click=${() => update({ ...props, count: props.count + 1 })}>${props.count}</button>
    `;
});
```

## Dispatching events

```javascript
import { html, customElement } from 'functional-element';

customElement('example-element', ({ props, constructing, element }) => {
    if (constructing) {
        return {
            props: {
                count: 0
            }
        };
    }

    return html`
        <button @click=${() => increment(props, element)}>${props.count}</button>
    `;
});

function increment(props, element) {
    element.dispatch(new CustomEvent('increment', {
        detail: {
            count: props.count + 1
        }
    }));
}
```
