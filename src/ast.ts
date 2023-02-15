import * as Parser from "./parser";
import fs from "fs";
import path from "path";

let commandsPath = "../commands.json";
if (!fs.existsSync(path.join(__dirname, commandsPath))) commandsPath = "./commands.js";
if (!fs.existsSync(path.join(__dirname, commandsPath))) throw new Error("Could not find commands.json or build/commands.js");
const commands: {[key: string]: {type: string, name: string}[]} = require(commandsPath);

export type CommandParamValue = number | string | boolean | Parser.Expression;
export type CommandParam<T extends CommandParamValue> = {
    name: string,
    value: T
};
export type Command = {
    command: string,
    line: number,
    params: CommandParam<CommandParamValue>[]
};


function parseCommand(command: string, content: Parser.MutableString): CommandParam<CommandParamValue>[] {
    if (commands[command] === undefined) throw new Error(`Unknown command '${command}'`);
    let commandArgs = commands[command] as {type: string, name: string}[];
    let out: CommandParam<CommandParamValue>[] = [];
    for (let i of commandArgs) {
        let push: CommandParam<CommandParamValue> = {name: i.name, value: 0};
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
        out.push(push);
    }
    return out;
}

function parseProgram(_inputProgram: string | string[], debug: boolean = false) {
    let inputProgram = (typeof _inputProgram === "string") ? _inputProgram.replace(/\r/g, "").split(/\n/g) : _inputProgram;
    let ast: Command[] = [];
    for (let _lineNum in inputProgram) {
        let lineNum: number = parseInt(_lineNum, 10);
        let line: string = inputProgram[lineNum];
        let str: Parser.MutableString = new Parser.MutableString(line).save();

        if (debug) console.log(`Line ${lineNum + 1}: ${line}`);

        if (str.content.trim() === "") {
            if (debug) console.log("Blank line");
            continue;
        }

        let command: string = Parser.Parser.nextWord(str);
        if (debug) console.log(`Command: ${command}`);

        if (command === "#") {
            if (debug) console.log(`Comment | ${Parser.Parser.allRemaining(str)}`);
            continue;
        }

        let out: CommandParam<CommandParamValue>[] = parseCommand(command, str);
        if (debug) console.log(out);
        ast.push({command: command, line: lineNum + 1, params: out});
    }
    return ast;
}

export { parseProgram, parseCommand };
