import { expect, it } from "vitest";
import { Token, tokenize } from "../src/tokenize";

function untokenize(tokens: Token[]): string {
    return tokens.map((t) => t.toString()).reduce((acc, s) => acc + s);
}

// biome-ignore format:
it("untokenizes correctly", () => {
    const tokens = ["(", "-312316", "*", "(", "+4256.1", "+", -590, "-", "+612", ")", ")", "/", -7234];
    return expect(untokenize(tokens)).toEqual("(-312316*(+4256.1+-590-+612))/-7234")
});

it("tokenizes empty string", () => expect(tokenize("")).toEqual([]));

it("tokenizes positive number", () => expect(tokenize("+4")).toEqual([4]));

it("tokenizes equation with a positive and negative number", () =>
    expect(tokenize("+3+-3")).toEqual([3, "+", -3]));

it("errors on wrong equation", () =>
    expect(() => tokenize("+-")).toThrowError());

it("tokenizes number", () => {
    const tokens = [12345];
    return expect(tokenize(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes negative number", () => {
    const tokens = [-23];
    return expect(tokenize(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes simple equation", () => {
    const tokens = [1, "-", 2];
    return expect(tokenize(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes - + equation", () => {
    const tokens = [4, "-", 5, "+", 6];
    return expect(tokenize(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes + - equation", () => {
    const tokens = [4, "+", 5, "-", 6];
    return expect(tokenize(untokenize(tokens))).toEqual(tokens);
});

// biome-ignore format:
it("tokenizes complex equation", () => {
    const tokens = ["(", -312316, "*", "(", 4256.1, "+", -590, "-", 612, ")", ")", "/", -7234];
    expect(tokenize(untokenize(tokens))).toEqual(tokens);
});

const tokens = ["(", ")"];
it("tokenizes bracket-only equation", () => {
    return expect(tokenize(untokenize(tokens))).toEqual(tokens);
});
