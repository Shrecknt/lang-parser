"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const fs_1 = __importDefault(require("fs"));
const commands = require("../commands.json");
const testProgram = fs_1.default.readFileSync("./test_program").toString().split("\n");
function parseCommand(command, content) {
    let commandArgs = commands[command];
    let out = [];
    for (let i of commandArgs) {
        let push = { name: i.name, value: undefined };
        switch (i.type) {
            case "bool":
                push.value = parser_1.Parser.nextBool(content);
                break;
            case "char":
                push.value = parser_1.Parser.nextChar(content);
                break;
            case "float":
                push.value = parser_1.Parser.nextFloat(content);
                break;
            case "int":
                push.value = parser_1.Parser.nextInt(content);
                break;
            case "string":
                push.value = parser_1.Parser.nextString(content);
                break;
            case "word":
                push.value = parser_1.Parser.nextWord(content);
                break;
            case "remaining":
                push.value = parser_1.Parser.allRemaining(content);
                break;
            default: throw new Error("Unknown type " + i.type);
        }
        out.push(push);
    }
    return out;
}
for (let _lineNum in testProgram) {
    let lineNum = Number(_lineNum);
    let line = testProgram[lineNum];
    let str = new parser_1.MutableString(line).save();
    console.log(`Line ${lineNum + 1}: ${line}`);
    if (str.content.trim() === "") {
        console.log("Blank line");
        continue;
    }
    let command = parser_1.Parser.nextWord(str);
    console.log(`Command: ${command}`);
    if (command === "#") {
        console.log(`Comment | ${parser_1.Parser.allRemaining(str)}`);
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
