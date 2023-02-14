import infixToPostfix from "infix-postfix";
import { MutableString, Parser } from "./parser";
import fs from "fs";

const commands = require("../commands.json");
const testProgram = fs.readFileSync("./test_program").toString().split("\n");

function parseCommand(command: string, content: MutableString): any[] {
    let commandArgs = commands[command] as {type: string, name: string}[];
    let out: {name: string, value: any}[] = [];
    for (let i of commandArgs) {
        let push: {name: string, value: any} = {name: i.name, value: undefined};
        switch (i.type) {
            case "bool": push.value = Parser.nextBool(content); break;
            case "char": push.value = Parser.nextChar(content); break;
            case "float": push.value = Parser.nextFloat(content); break;
            case "int": push.value = Parser.nextInt(content); break;
            case "string": push.value = Parser.nextString(content); break;
            case "word": push.value = Parser.nextWord(content); break;
            case "remaining": push.value = Parser.allRemaining(content); break;
            default: throw new Error("Unknown type " + i.type);
        }
        out.push(push);
    }
    return out;
}

for (let _lineNum in testProgram) {
    let lineNum = Number(_lineNum);
    let line = testProgram[lineNum];
    let str = new MutableString(line).save();

    console.log(`Line ${lineNum + 1}: ${line}`);

    if (str.content.trim() === "") {
        console.log("Blank line");
        continue;
    }

    let command = Parser.nextWord(str);
    console.log(`Command: ${command}`);

    if (command === "#") {
        console.log(`Comment | ${Parser.allRemaining(str)}`);
        continue;
    }

    let out = parseCommand(command, str);
    console.log(out);
}

//console.log(infixToPostfix("a+b").toString().split(" "));

/*
let str = new MutableString("\"testing\" test 1 true \"testing\"").save();
console.log(str.content);
console.log("string", Parser.nextString(str));
console.log(str.content);
console.log("word", Parser.nextWord(str));
console.log(str.content);
console.log("int", Parser.nextInt(str));
console.log(str.content);
console.log("bool", Parser.nextBool(str));
console.log(str.content);
console.log("remaining", Parser.allRemaining(str));
console.log(str.restore().content);
*/
