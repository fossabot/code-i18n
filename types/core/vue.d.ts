import { Node, ESLintProgram, VText, VLiteral, ESLintLiteral } from 'vue-eslint-parser-private/ast/nodes';
import { ESLintTemplateLiteral } from 'vue-eslint-parser-private/ast';
import { Options } from '../interface';
import Parser from './parser';
export default class VueHelpers {
    private map;
    readonly parser: Parser;
    readonly options: Options | undefined;
    private stack;
    private content;
    constructor(parser: Parser, options?: Options);
    _renderKey(ast: Node): string | number;
    _generate(): {
        code: string;
        stack: Record<string, string>[];
    };
    _traverseTemplateBody(ast: VText | VLiteral | ESLintLiteral): void;
    _traverseTemplateLiteral(ast: ESLintTemplateLiteral): void;
    _traverse(ast: ESLintProgram, keys: string[]): void;
    _transform(): void;
    generate(): {
        code: string;
        stack: Record<string, string>[];
    };
}
