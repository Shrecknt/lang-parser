import { Expression, MutableString, Parser } from "./parser";
import fs from "fs";

const commands: {[key: string]: {type: string, name: string}[]} = require("../commands.json");

export type CommandParamValue = number | string | boolean | Expression;
export type CommandParam<T extends CommandParamValue> = {
    name: string,
    value: T
};
export type Command = {
    command: string,
    line: number,
    params: CommandParam<CommandParamValue>[]
};


function parseCommand(command: string, content: MutableString): CommandParam<CommandParamValue>[] {
    if (commands[command] === undefined) throw new Error(`Unknown command '${command}'`);
    let commandArgs = commands[command] as {type: string, name: string}[];
    let out: CommandParam<CommandParamValue>[] = [];
    for (let i of commandArgs) {
        let push: CommandParam<CommandParamValue> = {name: i.name, value: 0};
        switch (i.type) {
            case "bool": push.value = Parser.nextBool(content); break;
            case "char": push.value = Parser.nextChar(content); break;
            case "float": push.value = Parser.nextFloat(content); break;
            case "int": push.value = Parser.nextInt(content); break;
            case "string": push.value = Parser.nextString(content); break;
            case "word": push.value = Parser.nextWord(content); break;
            case "expression": push.value = Parser.nextExpression(content); break;
            case "remaining": push.value = Parser.allRemaining(content); break;
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
        let str: MutableString = new MutableString(line).save();

        if (debug) console.log(`Line ${lineNum + 1}: ${line}`);

        if (str.content.trim() === "") {
            if (debug) console.log("Blank line");
            continue;
        }

        let command: string = Parser.nextWord(str);
        if (debug) console.log(`Command: ${command}`);

        if (command === "#") {
            if (debug) console.log(`Comment | ${Parser.allRemaining(str)}`);
            continue;
        }

        let out: CommandParam<CommandParamValue>[] = parseCommand(command, str);
        if (debug) console.log(out);
        ast.push({command: command, line: lineNum + 1, params: out});
    }
    return ast;
}

export { parseProgram, parseCommand };
