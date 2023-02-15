import fs from "fs";
import * as AST from "./ast";

const testProgram: string = fs.readFileSync("./test_program").toString();

const ast = AST.parseProgram(testProgram);

console.log("AST:", ast);

fs.writeFileSync("ast.json", JSON.stringify(ast, null, 4));
