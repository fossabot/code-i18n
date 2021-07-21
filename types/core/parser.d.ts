import { File } from '@babel/types';
import { ESLintProgram } from 'vue-eslint-parser-private/ast';
export declare type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue';
export interface Props {
    content: string;
    type: ParserType;
}
export default class Parser implements Props {
    readonly content: string;
    readonly type: ParserType;
    readonly ast: File | ESLintProgram;
    constructor(props: Props);
    private _parser;
}
