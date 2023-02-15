import fs from "fs";

import { parseProgram } from "./ast";


const testProgram: string = fs.readFileSync("./test_program").toString();

let ast = parseProgram(testProgram);

console.log("AST:", ast);

fs.writeFileSync("ast.json", JSON.stringify(ast, null, 4));
