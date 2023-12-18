import { expect, test } from "vitest";
import { Token, tokenize } from "../src/tokenize";

function untokenize(tokens: Token[]): string {
    return tokens.map((t) => t.toString()).reduce((acc, s) => acc + s);
}

// biome-ignore format:
{
    const tokens = ["(", "-312316", "*", "(", "+4256.1", "+", -590, "-", "+612", ")", ")", "/", -7234];
    test("untokenizes correctly", () =>
        expect(untokenize(tokens)).toEqual("(-312316*(+4256.1+-590-+612))/-7234"));
}

test("tokenizes empty string", () => expect(tokenize("")).toEqual([]));
test("tokenizes positive number", () => expect(tokenize("+4")).toEqual([4]));
test("tokenizes equation with a positive and negative number", () =>
    expect(tokenize("+3+-3")).toEqual([3, "+", -3]));
test("errors on wrong equation", () =>
    expect(() => tokenize("+-")).toThrowError());
{
    const tokens = [12345];
    test("tokenizes number", () =>
        expect(tokenize(untokenize(tokens))).toEqual(tokens));
}
{
    const tokens = [-23];
    test("tokenizes negative number", () =>
        expect(tokenize(untokenize(tokens))).toEqual(tokens));
}
{
    const tokens = [1, "-", 2];
    test("tokenizes simple equation", () =>
        expect(tokenize(untokenize(tokens))).toEqual(tokens));
}
{
    const tokens = [4, "-", 5, "+", 6];
    test("tokenizes - + equation", () =>
        expect(tokenize(untokenize(tokens))).toEqual(tokens));
}
{
    const tokens = [4, "+", 5, "-", 6];
    test("tokenizes + - equation", () =>
        expect(tokenize(untokenize(tokens))).toEqual(tokens));
}
{
    // biome-ignore format:
    const tokens = ["(", -312316, "*", "(", 4256.1, "+", -590, "-", 612, ")", ")", "/", -7234];
    test("tokenizes complex equation", () => {
        expect(tokenize(untokenize(tokens))).toEqual(tokens);
    });
}
{
    const tokens = ["(", ")"];
    test("tokenizes bracket-only equation", () =>
        expect(tokenize(untokenize(tokens))).toEqual(tokens));
}
