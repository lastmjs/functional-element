class TestFunctionalElement extends HTMLElement {
  prepareTests(test) {
    let counter = 0;
    test("properties set in constructor", [jsverify.nat(10)], (numProperties) => {
      return new Promise((resolve) => {
        counter = counter + 1;
        const arbProperties = new Array(numProperties).fill(0).map((number) => jsverify.sampler(jsverify.nestring)()).reduce((result, arbString) => {
          return {
            ...result,
            [arbString]: arbString
          };
        }, {});
        const testElementName = `test-element-${counter}`;
        customElement(testElementName, ({constructing}) => {
          if (constructing) {
            return arbProperties;
          }
          return html``;
        });
        const testElement = document.createElement(testElementName);
        testElement.addEventListener("constructed", () => {
          const result = Object.keys(arbProperties).reduce((result2, propertyKey) => {
            if (testElement[propertyKey] !== propertyKey) {
              return false;
            }
            return result2;
          }, true);
          document.body.removeChild(testElement);
          resolve(result);
        });
        document.body.appendChild(testElement);
      });
    });
    counter = 0;
    test("render from initial return", [jsverify.nat(10)], (arbNumber) => {
      return new Promise((resolve) => {
        counter = counter + 1;
        const arbIds = new Array(arbNumber).fill(0).map(() => `div-${jsverify.sampler(jsverify.nat)()}`);
        const testElementName = `test-properties-${counter}`;
        customElement(testElementName, () => {
          return html`
                        ${arbIds.map((arbId) => {
            return html`<div id="${arbId}"></div>`;
          })}
                    `;
        });
        const testElement = document.createElement(`test-properties-${counter}`);
        testElement.addEventListener("connected", () => {
          const result = arbIds.reduce((result2, arbId) => {
            if (!testElement.querySelector(`#${arbId}`)) {
              return false;
            }
            return result2;
          }, true);
          document.body.removeChild(testElement);
          resolve(result);
        });
        document.body.appendChild(testElement);
      });
    });
  }
}
window.customElements.define("test-functional-element", TestFunctionalElement);
