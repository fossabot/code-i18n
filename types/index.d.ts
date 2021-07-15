import { ParserType } from './core/parser';
import { Options } from './core/transform';
export * as Parser from './core/parser';
export * as Transform from './core/transform';
export declare function transformCode(code: string, config: Options & {
    type: ParserType;
}): {
    code: string;
    stack: Record<string, string>[];
};
