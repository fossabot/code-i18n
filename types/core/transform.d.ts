import { GeneratorOptions } from '@babel/generator';
import * as t from '@babel/types';
import Parser from './parser';
import VueHelpers, { VueAST } from './vue';
export interface Options {
    ruleKey?: (node: t.Node) => string | number;
    readonly identifier?: string;
}
export default class Transform {
    readonly parser: Parser;
    readonly options: Options | undefined;
    readonly fnName: string;
    readonly stack: Record<string, string>[];
    vueHelpers: VueHelpers;
    readonly identifier = "$t";
    constructor(parser: Parser, options?: Options);
    _key(node: t.Node): string | number;
    _StringFunction(node: t.StringLiteral): t.ExpressionStatement;
    _TemplateFunction(node: t.TemplateLiteral): t.ExpressionStatement;
    _JSXTextFunction(node: t.JSXText): t.JSXExpressionContainer;
    _JSXAttributeFunction(node: t.JSXAttribute): t.JSXAttribute;
    _transform(script?: t.File): t.File;
    transform(): t.File | VueAST;
    render(options?: GeneratorOptions): {
        code: string;
        stack: Record<string, string>[];
    };
}
