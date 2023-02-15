import infixToPostfix from "infix-postfix";

export type Expression = string[];

export class MutableString {
    private _content = "";
    private storeContent = "";

    constructor(content: string = "") {
        this._content = content;
    }

    setContent(content: string): MutableString {
        this._content = content;
        return this;
    }
    get content(): string {
        return this._content;
    }

    save(): MutableString {
        this.storeContent = this._content;
        return this;
    }
    restore(): MutableString {
        this._content = this.storeContent;
        return this;
    }

    toString(): string {
        return this._content;
    }
}

export class Parser {

    /* Decorators */
    
    private static DecorateEnsureStringHasContent(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const origFunction = descriptor.value;
        descriptor.value = (content: MutableString, ...args: any) => {
            if (content.content === "") throw new Error("String is empty");
            return origFunction(content, ...args);
        };
    }

    private static DecorateShiftContent(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const origFunction = descriptor.value;
        descriptor.value = (content: MutableString, ...args: any) => {
            const out = origFunction(content, ...args);
            Parser.shift(content);
            return out;
        };
    }


    /* Utility Methods */

    @Parser.DecorateEnsureStringHasContent
    private static shift(content: MutableString): MutableString {
        content.setContent(content.content.split(" ").splice(1).join(" "));
        return content;
    }


    /* Main Methods */

    @Parser.DecorateEnsureStringHasContent
    @Parser.DecorateShiftContent
    static nextInt(content: MutableString, radix: number = 10): number {
        const out = parseInt(content.content.split(" ")[0], radix);
        if (Number.isNaN(out)) throw new Error("Value is not of type int");
        return out;
    }

    @Parser.DecorateEnsureStringHasContent
    @Parser.DecorateShiftContent
    static nextFloat(content: MutableString): number {
        const out = parseFloat(content.content.split(" ")[0]);
        if (Number.isNaN(out)) throw new Error("Value is not of type float");
        return out;
    }

    @Parser.DecorateEnsureStringHasContent
    @Parser.DecorateShiftContent
    static nextBool(content: MutableString): boolean {
        const outStr = content.content.split(" ")[0].toLowerCase();
        const out = (["true", "t", "1"].includes(outStr)) ? true : ((["false", "f", "0"].includes(outStr)) ? false : null);
        if (out === null) throw new Error("Value is not of type bool");
        return out;
    }

    @Parser.DecorateEnsureStringHasContent
    @Parser.DecorateShiftContent
    static nextWord(content: MutableString): string {
        let out = content.content.split(" ")[0];
        if (out.startsWith("\"") && out.endsWith("\"")) out = out.substring(1, out.length - 1);
        return out;
    }

    @Parser.DecorateEnsureStringHasContent
    @Parser.DecorateShiftContent
    static nextChar(content: MutableString): string {
        const out = content.content.split(" ")[0];
        if (out.length !== 1) throw new Error("Value is not of type char");
        return out;
    }

    @Parser.DecorateEnsureStringHasContent
    static nextString(content: MutableString): string {
        if (!content.content.startsWith("\"")) throw new Error("Value is not of type string");
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
        if (found === false) throw new Error("Closing parenthesis not found");
        content.setContent(content.content.replace(`"${out}"`, ""));
        if (content.content.startsWith(" ")) content.setContent(content.content.replace(" ", ""));
        return out;
    }

    @Parser.DecorateEnsureStringHasContent
    static nextExpression(content: MutableString): Expression {
        if (!content.content.startsWith("$\"")) throw new Error("Value is not of type expression");
        content.setContent(content.content.slice(1));
        const str: string = Parser.nextString(content);
        const out: Expression = infixToPostfix(str).toString().split(" ");
        return out;
    }

    static allRemaining(str: MutableString): string {
        const out = str.content;
        str.setContent("");
        return out;
    }

}
