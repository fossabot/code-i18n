import { ParserOptions as BabelParserOptions } from '@babel/parser';
import { File } from '@babel/types';
import { ESLintProgram } from 'vue-eslint-parser-private/ast';
import { Linter } from 'eslint';
export declare type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue';
export interface ParserOptions {
    vue?: Linter.ParserOptions;
    babel?: BabelParserOptions;
}
export interface Props {
    content: string;
    type: ParserType;
    parserOptions?: ParserOptions;
}
export default class Parser implements Props {
    readonly content: string;
    readonly type: ParserType;
    readonly ast: File | ESLintProgram;
    readonly parserOptions: Required<ParserOptions>;
    constructor(props: Props);
    private _parser;
}
