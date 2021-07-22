import { ParserPlugin } from '@babel/parser';
import { File } from '@babel/types';
import { ESLintProgram } from 'vue-eslint-parser-private/ast';
export declare type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue';
export interface Props {
    content: string;
    type: ParserType;
    plugins?: ParserPlugin[];
}
export default class Parser implements Props {
    readonly content: string;
    readonly type: ParserType;
    readonly ast: File | ESLintProgram;
    readonly plugins: ParserPlugin[];
    constructor(props: Props);
    private _parser;
}
