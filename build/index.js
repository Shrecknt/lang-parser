"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const infix_postfix_1 = __importDefault(require("infix-postfix"));
const parser_1 = require("./parser");
console.log((0, infix_postfix_1.default)("a+b").toString().split(" "));
let str = new parser_1.MutableString("\"testing\" test 1 true \"testing\"").save();
console.log(str.content);
console.log("string", parser_1.Parser.nextString(str));
console.log(str.content);
console.log("word", parser_1.Parser.nextWord(str));
console.log(str.content);
console.log("int", parser_1.Parser.nextInt(str));
console.log(str.content);
console.log("bool", parser_1.Parser.nextBool(str));
console.log(str.content);
console.log("remaining", parser_1.Parser.allRemaining(str));
console.log(str.restore().content);
