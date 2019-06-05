import { TemplateResult, Template } from 'lit-html';

interface FunctionalElement extends HTMLElement {
    props: Props;
    update: UpdateFunction;
}

interface CustomElementDefinerOptions {
    update: UpdateFunction;
    constructing: boolean;
    connecting: boolean;
    disconnecting: boolean;
    adopting: boolean;
    element: FunctionalElement;
    [customProperty: string]: any;
}

type UpdateFunction = (customElementDefinerResult?: CustomElementDefinerResult) => Promise<void>;
type CustomElementDefinerResult = TemplateResult | Props | undefined | null;
type CustomElementDefiner = (customElementDefinerOptions: CustomElementDefinerOptions) => CustomElementDefinerResult | Promise<CustomElementDefinerResult>;

interface Props {
    readonly [key: string]: any;    
}