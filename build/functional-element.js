import {render} from "./_snowpack/pkg/lit-html.js";
export {html} from "./_snowpack/pkg/lit-html.js";
export {unsafeHTML} from "./_snowpack/pkg/lit-html/directives/unsafe-html.js";
export function customElement(tagName, customElementDefiner) {
  window.customElements.define(tagName, class extends HTMLElement {
    constructor() {
      super();
      this.props = {};
      (async () => {
        const customElementDefinerResult = await customElementDefiner({
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
        this.dispatchEvent(new CustomEvent("constructed"));
      })();
    }
    async connectedCallback() {
      this.addEventListener("constructed", async () => {
        await applyCustomElementDefinerResult(this, customElementDefiner, {
          ...this.props,
          update: this.update.bind(this),
          constructing: false,
          connecting: true,
          disconnecting: false,
          adopting: false,
          element: this
        });
        this.dispatchEvent(new CustomEvent("connected"));
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
      this.dispatchEvent(new CustomEvent("disconnected"));
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
      this.dispatchEvent(new CustomEvent("adopted"));
    }
    async update(customElementDefinerResult) {
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
        disconnecting: false,
        adopting: false,
        element: this
      });
      this.dispatchEvent(new CustomEvent("updated"));
    }
  });
}
async function applyCustomElementDefinerResult(element, customElementDefiner, customElementDefinerOptions) {
  const customElementDefinerResult = await customElementDefiner(customElementDefinerOptions);
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
    render(customElementDefinerResult, customElementDefinerOptions.element);
  }
}
function createPropertyAccessors(element, customElementDefiner) {
  Object.keys(element.props).forEach((propsKey) => {
    if (element[propsKey] !== void 0) {
      element.props[propsKey] = element[propsKey];
    }
    Object.defineProperty(element, propsKey, {
      set(val) {
        element.props = {
          ...element.props,
          [propsKey]: val
        };
        applyCustomElementDefinerResult(element, customElementDefiner, {
          ...element.props,
          update: element.update.bind(element),
          constructing: false,
          connecting: false,
          disconnecting: false,
          adopting: false,
          element
        });
      },
      get() {
        return element.props[propsKey];
      }
    });
  });
}
function checkIfCustomElementDefinerResultIsTemplateResult(customElementDefinerResult) {
  return customElementDefinerResult !== null && customElementDefinerResult !== void 0 && customElementDefinerResult.constructor && customElementDefinerResult.constructor.name === "TemplateResult";
}
function checkIfCustomElementDefinerResultIsProps(customElementDefinerResult) {
  return customElementDefinerResult !== null && customElementDefinerResult !== void 0 && customElementDefinerResult.constructor && customElementDefinerResult.constructor.name === "Object";
}
