import { customElement } from '../functional-element';
import { html } from 'lit-html';

customElement('test-element', testElement);

function testElement({ props, constructing, update }) {
    if (constructing) {
        return {
            props: {
                prop1: 1,
                prop2: '2',
                prop3: () => {
                    return 3;
                }
            }
        };
    }

    return {
        template: html`
            <div
                id="test-div"
                .prop1=${props.prop1}
                .prop2=${props.prop2}
                .prop3=${props.prop3}
                @click=${() => update(add1(props))}
            >
            </div>
        `
    };
}

function add1(props) {
    return {
        props: {
            prop1: props.prop1 + 1,
            prop2: (parseInt(props.prop2) + 1).toString(),
            prop3: () => {
                return props.prop3 + 1;
            }
        }
    };
}