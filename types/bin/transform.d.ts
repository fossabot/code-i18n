import * as t from '@babel/types';
import { transformCode } from '../index';
import { CommandArgs, Config } from '../interface';
interface FormatOutput extends ReturnType<typeof transformCode> {
    name?: string;
}
declare type Command = Partial<CommandArgs> & {
    write: boolean | string;
} & Partial<{
    prettier: (node: string, ast?: t.File) => string;
}>;
export declare function transformFile(filename: string, write: boolean | string, config: Partial<Config> & Command): {
    code: string;
    stack: Record<string, string>[];
};
export declare function transformDirectory(dir: string, config: Partial<Config> & Command): Promise<FormatOutput[]>;
export declare function exec(command: Command): Promise<void>;
export {};
