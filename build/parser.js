"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.MutableString = void 0;
class MutableString {
    constructor(content = "") {
        this._content = "";
        this.storeContent = "";
        this._content = content;
    }
    setContent(content) {
        this._content = content;
        return this;
    }
    get content() {
        return this._content;
    }
    save() {
        this.storeContent = this._content;
        return this;
    }
    restore() {
        this._content = this.storeContent;
        return this;
    }
    toString() {
        return this._content;
    }
}
exports.MutableString = MutableString;
class Parser {
    /* Decorators */
    static DecorateEnsureStringHasContent(_target, _propertyKey, descriptor) {
        let origFunction = descriptor.value;
        descriptor.value = (content, ...args) => {
            if (content.content === "")
                throw new Error("String is empty");
            return origFunction(content, ...args);
        };
    }
    static DecorateShiftContent(_target, _propertyKey, descriptor) {
        let origFunction = descriptor.value;
        descriptor.value = (content, ...args) => {
            let out = origFunction(content, ...args);
            Parser.shift(content);
            return out;
        };
    }
    /* Utility Methods */
    static shift(content) {
        content.setContent(content.content.split(" ").splice(1).join(" "));
        return content;
    }
    /* Main Methods */
    static nextInt(content, radix = 10) {
        let out = parseInt(content.content.split(" ")[0], radix);
        if (Number.isNaN(out))
            throw new Error("Value is not of type int");
        return out;
    }
    static nextFloat(content) {
        let out = parseFloat(content.content.split(" ")[0]);
        if (Number.isNaN(out))
            throw new Error("Value is not of type float");
        return out;
    }
    static nextBool(content) {
        let outStr = content.content.split(" ")[0].toLowerCase();
        let out = (["true", "t", "1"].includes(outStr)) ? true : ((["false", "f", "0"].includes(outStr)) ? false : null);
        if (out === null)
            throw new Error("Value is not of type bool");
        return out;
    }
    static nextWord(content) {
        let out = content.content.split(" ")[0];
        return out;
    }
    static nextChar(content) {
        let out = content.content.split(" ")[0];
        if (out.length !== 1)
            throw new Error("Value is not of type char");
        return out;
    }
    static nextString(content) {
        if (!content.content.startsWith("\""))
            throw new Error("Value is not of type string");
        let out = "";
        let escaped = false;
        let found = false;
        for (let i = 1; i < content.content.length; i++) {
            let char = content.content[i];
            if (char === "\\") {
                escaped = !escaped;
                continue;
            }
            if (char === "\"" && !escaped) {
                out = content.content.substring(1, i);
                found = true;
                break;
            }
        }
        if (found === false)
            throw new Error("Closing parenthesis not found");
        content.setContent(content.content.replace(`"${out}"`, ""));
        if (content.content.startsWith(" "))
            content.setContent(content.content.replace(" ", ""));
        return out;
    }
    static allRemaining(str) {
        let out = str.content;
        str.setContent("");
        return out;
    }
}
__decorate([
    Parser.DecorateEnsureStringHasContent
], Parser, "shift", null);
__decorate([
    Parser.DecorateEnsureStringHasContent,
    Parser.DecorateShiftContent
], Parser, "nextInt", null);
__decorate([
    Parser.DecorateEnsureStringHasContent,
    Parser.DecorateShiftContent
], Parser, "nextFloat", null);
__decorate([
    Parser.DecorateEnsureStringHasContent,
    Parser.DecorateShiftContent
], Parser, "nextBool", null);
__decorate([
    Parser.DecorateEnsureStringHasContent,
    Parser.DecorateShiftContent
], Parser, "nextWord", null);
__decorate([
    Parser.DecorateEnsureStringHasContent,
    Parser.DecorateShiftContent
], Parser, "nextChar", null);
__decorate([
    Parser.DecorateEnsureStringHasContent
], Parser, "nextString", null);
exports.Parser = Parser;
