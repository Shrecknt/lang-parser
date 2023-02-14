import infixToPostfix from "infix-postfix";
import { MutableString, Parser } from "./parser";

console.log(infixToPostfix("a+b").toString().split(" "));

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
