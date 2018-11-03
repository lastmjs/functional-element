import jsverify from 'jsverify-es-module';
import { customElement } from '../functional-element';
import { html } from 'lit-html';

class TestFunctionalElement extends HTMLElement {
    prepareTests(test: any) {

        let counter = 0;
        test('properties set from initial return', [jsverify.nat(10)], (numProperties: number) => {
            counter = counter + 1;
            const arbProperties = new Array(numProperties).fill(0).map((number) => jsverify.sampler(jsverify.nestring)()).reduce((result, arbString) => {
                return {
                    ...result,
                    [arbString]: arbString
                };
            }, {});

            const testElementName = `test-element-${counter}`;
            customElement(testElementName, () => {
                return {
                    props: arbProperties
                };
            });

            const testElement = document.createElement(testElementName);
            document.body.appendChild(testElement);

            const result = Object.keys(arbProperties).reduce((result: boolean, propertyKey: string) => {
                if (testElement[propertyKey] !== propertyKey) {
                    return false;
                }

                return result;
            }, true);

            document.body.removeChild(testElement);

            return result;
        });

        counter = 0;
        test('render from initial return', [jsverify.nat(10)], (arbNumber: number) => {
            counter = counter + 1;

            const arbIds = new Array(arbNumber).fill(0).map(() => `div-${jsverify.sampler(jsverify.nat)()}`);

            const testElementName = `test-properties-${counter}`;
            customElement(testElementName, () => {
                return {
                    template: html`
                        ${arbIds.map((arbId) => {
                            return html`<div id="${arbId}"></div>`;
                        })}
                    `
                };
            });

            const testElement = document.createElement(`test-properties-${counter}`);
            document.body.appendChild(testElement);

            const result = arbIds.reduce((result: boolean, arbId: string) => {
                if (!testElement.querySelector(`#${arbId}`)) {
                    return false;
                }

                return result;
            }, true);

            document.body.removeChild(testElement);

            return result;
        });

        // test('property listeners');
        // test('update function');
        // test('lifecycle');
    }
}

window.customElements.define('test-functional-element', TestFunctionalElement);