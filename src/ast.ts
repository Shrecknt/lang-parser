import * as Parser from "./parser";
import fs from "fs";
import path from "path";

let commandsPath = "../commands.json";
if (!fs.existsSync(path.join(__dirname, commandsPath))) commandsPath = "./commands.js";
if (!fs.existsSync(path.join(__dirname, commandsPath))) throw new Error("Could not find commands.json or build/commands.js");
const commands: {[key: string]: {type: string, name: string}[]} = require(commandsPath);

export type CommandParamValue = number | string | boolean | Parser.Expression;
export type CommandParam<T extends CommandParamValue> = {
    name: string;
    type: string;
    value: T;
};
export type Command = {
    command: string;
    line: number;
    params: CommandParam<CommandParamValue>[];
    error?: ParseCommandError;
};

class ParseCommandError {
    reason: string;
    argument: number;

    constructor (reason: string, argument: number) {
        this.reason = reason;
        this.argument = argument;
    }
}

function parseCommand(command: string, content: Parser.MutableString): CommandParam<CommandParamValue>[] | ParseCommandError {
    if (commands[command] === undefined) throw new Error(`Unknown command '${command}'`);
    const commandArgs = commands[command] as {type: string, name: string}[];
    const out: CommandParam<CommandParamValue>[] = [];
    for (const _i in commandArgs) {
        const i = commandArgs[_i];
        let outType = i.type;
        if (outType === "remaining" || outType === "word" || outType === "char") outType = "string";
        const push: CommandParam<CommandParamValue> = {name: i.name, type: outType, value: 0};
        try {
            switch (i.type) {
                case "bool": push.value = Parser.Parser.nextBool(content); break;
                case "char": push.value = Parser.Parser.nextChar(content); break;
                case "float": push.value = Parser.Parser.nextFloat(content); break;
                case "int": push.value = Parser.Parser.nextInt(content); break;
                case "string": push.value = Parser.Parser.nextString(content); break;
                case "word": push.value = Parser.Parser.nextWord(content); break;
                case "expression": push.value = Parser.Parser.nextExpression(content); break;
                case "remaining": push.value = Parser.Parser.allRemaining(content); break;
                default: throw new Error("Unknown type " + i.type);
            }
        } catch (e) {
            let err = e as Error;
            return new ParseCommandError(err.message.toString(), parseInt(_i, 10));
        }
        out.push(push);
    }
    return out;
}

function parseProgram(_inputProgram: string | string[], debug: boolean = false) {
    const inputProgram = (typeof _inputProgram === "string") ? _inputProgram.replace(/\r/g, "").split(/\n/g) : _inputProgram;
    const ast: Command[] = [];
    for (const _lineNum in inputProgram) {
        const lineNum: number = parseInt(_lineNum, 10);
        const line: string = inputProgram[lineNum];
        const str: Parser.MutableString = new Parser.MutableString(line).save();

        if (debug) console.log(`Line ${lineNum + 1}: ${line}`);

        if (str.content.trim() === "") {
            if (debug) console.log("Blank line");
            continue;
        }

        const command: string = Parser.Parser.nextWord(str);
        if (debug) console.log(`Command: ${command}`);

        if (command === "#") {
            if (debug) console.log(`Comment | ${Parser.Parser.allRemaining(str)}`);
            continue;
        }

        const _out: CommandParam<CommandParamValue>[] | ParseCommandError = parseCommand(command, str);
        if (_out instanceof ParseCommandError) {
            console.log(`Error in '${line}' (argument ${_out.argument + 2}) (line ${lineNum + 1})\n          ^^^ ${_out.reason}`);
            ast.push({command: command, line: lineNum + 1, params: [], error: _out});
        } else {
            const out = _out as CommandParam<CommandParamValue>[];
            if (debug) console.log(out);
            ast.push({command: command, line: lineNum + 1, params: out});
        }
    }
    return ast;
}

export { parseProgram, parseCommand };
