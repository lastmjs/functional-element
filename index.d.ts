import { TemplateResult } from 'lit-html';

interface FunctionalElement extends HTMLElement {
    props: Props;
    update: (userFunctionResult: UserFunctionResult) => void;
}

interface UserFunctionOptions {
    props: Props;
    update: (userFunctionResult: UserFunctionResult) => void;
    constructing: boolean;
    connecting: boolean;
    disconnecting: boolean;
    adopting: boolean;
    element: FunctionalElement;
}

interface UserFunctionResult {
    readonly props: Props;
    readonly template: TemplateResult;
}

interface Props {
    readonly [key: string]: any;    
}