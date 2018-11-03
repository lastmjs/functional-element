import { TemplateResult } from 'lit-html';

interface FunctionalElement extends HTMLElement {
    props: Props;
    update: UpdateFunction;
}

interface UserFunctionOptions {
    props: Props;
    update: UpdateFunction;
    constructing: boolean;
    connecting: boolean;
    disconnecting: boolean;
    adopting: boolean;
    element: FunctionalElement;
}

type UpdateFunction = (props?: Props) => void;
type UserFunctionResult = TemplateResult | Props | undefined;
type UserFunction = (userFunctionOptions: UserFunctionOptions) => UserFunctionResult;

interface Props {
    readonly [key: string]: any;    
}