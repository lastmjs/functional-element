import { customElement, html } from './functional-element';

customElement('fe-test', async ({ constructing, connecting, src, update, loaded }) => {

    if (constructing) {
        return {
            src: 'NOT_SET',
            loaded: false
        };
    }

    if (connecting) {
        update();
        return {
            src: await getSrc(),
            loaded: true
        };
    }

    return html`
        ${loaded === true ? html`
            The URL is: ${src}
        ` : html`Loading...`}
    `;
});

async function getSrc() {
    await wait(5000);
    return 'https://google.com';
}

async function wait(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}