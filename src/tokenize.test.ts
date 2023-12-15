import { expect, test } from "vitest";
import { Token, tokenize } from "./tokenize";

function testTokenize(name: string, tokens: Token[]) {
    function untokenize(tokens: Token[]): string {
        return tokens.map((t) => t.toString()).reduce((acc, s) => acc + s);
    }
    test(name, () => expect(tokenize(untokenize(tokens))).toEqual(tokens));
}

test("tokenizes empty string", () => expect(tokenize("")).toEqual([]));

testTokenize("tokenizes number", [123]);

testTokenize("tokenizes negative number", [-23]);

testTokenize("tokenizes simple equation", [1, "-", 2]);

testTokenize("tokenizes equation with negative number", [3, "+", -3]);

const complexEquation = ["(", 3, "*", "(", 4, "+", 5, "-", 6, ")", ")", "/", 7];
testTokenize("tokenizes complex equation", complexEquation);
