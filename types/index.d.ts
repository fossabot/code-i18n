import { ParserType } from './core/parser';
import { Options } from './core/transform';
export * from './core/parser';
export * from './core/transform';
export declare function transformCode(code: string, config: Options & {
    type: ParserType;
}): {
    code: string;
    stack: Record<string, string>[];
};
