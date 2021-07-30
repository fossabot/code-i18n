import { GeneratorOptions } from '@babel/generator';
import { Options } from '../interface';
import VueHelpers from './vue';
import * as t from '@babel/types';
import Parser from './parser';
export default class Transform {
    readonly parser: Parser;
    readonly options: Options | undefined;
    readonly fnName: string;
    readonly stack: Record<string, string>[];
    readonly identifier = "$t";
    VueHelpers: VueHelpers;
    constructor(parser: Parser, options?: Options);
    _key(node: t.Node): string | number;
    _StringFunction(node: t.StringLiteral): t.CallExpression;
    _TemplateFunction(node: t.TemplateLiteral): t.CallExpression;
    _JSXTextFunction(node: t.JSXText): t.JSXExpressionContainer;
    _JSXAttributeFunction(node: t.JSXAttribute): t.JSXAttribute;
    _transform(): t.File;
    transform(): t.File;
    render(options?: GeneratorOptions): {
        code: string;
        stack: Record<string, string>[];
        ast?: t.File;
    };
}
