import { TemplateChildNode, RootNode } from '@vue/compiler-core';
import Transform from './transform';
import * as t from '@babel/types';
export interface VueAST {
    ast: t.File;
    template?: RootNode;
}
export default class VueHelpers {
    constructor();
    _generate(nodes: TemplateChildNode[]): void;
    generate(vueAST: VueAST): {
        code: string;
        stack: any[];
    };
    traverse(ast: RootNode | undefined): RootNode;
    _transform(transform: Transform): VueAST;
}
