import { Config } from '../src/interface/index';
export * as Parser from './core/parser';
export * as Transform from './core/transform';
export declare function transformCode(code: string, config: Config): {
    code: string;
    stack: Record<string, string>[];
};
