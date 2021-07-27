import { transformCode } from '../index';
import { CommandArgs, Config } from '../interface';
interface FormatOutput extends ReturnType<typeof transformCode> {
    name?: string;
}
export declare function transformFile(filename: string, write: boolean | string, config: Partial<Config>): {
    code: string;
    stack: Record<string, string>[];
};
export declare function transformDirectory(dir: string, write: boolean, config: Partial<Config>): Promise<FormatOutput[]>;
export declare function exec(command: Partial<CommandArgs> & {
    write: boolean | string;
}): Promise<void>;
export {};
