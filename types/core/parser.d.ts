import { RootNode } from '@vue/compiler-dom';
import { File } from '@babel/types';
export declare type ParserType = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue';
export interface Props {
    content: string;
    type: ParserType;
}
export default class Parser implements Props {
    readonly content: string;
    readonly type: ParserType;
    readonly ast: File;
    vueTemplateNode: RootNode | undefined;
    constructor(props: Props);
    private _parserVue;
    private _parser;
}
