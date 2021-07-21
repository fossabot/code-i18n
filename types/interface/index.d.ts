import * as t from '@babel/types';
import { Node } from 'vue-eslint-parser-private/ast/nodes';
export declare type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export interface Options {
    ruleKey?: (node: t.Node | Node) => string | number;
    readonly identifier?: string;
}
