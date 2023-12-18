import { expect, it } from "vitest";
import { lex } from "../src/lex";

function untokenize(tokens: (string | number)[]): string {
    return tokens.map((t) => t.toString()).reduce((acc, s) => acc + s);
}

// biome-ignore format:
it("untokenizes correctly", () => {
    const tokens = ["(", "-312316", "*", "(", "+4256.1", "+", -590, "-", "+612", ")", ")", "/", -7234];
    return expect(untokenize(tokens)).toEqual("(-312316*(+4256.1+-590-+612))/-7234")
});

it("handles (evil nbsp) whitespace in equation", () =>
    expect(lex(" (	    3 -   45 ) ")).toEqual(["(", 3, "-", 45, ")"]));

it("tokenizes empty string", () => expect(lex("")).toEqual([]));

it("tokenizes positive number", () => expect(lex("+4")).toEqual([4]));

it("tokenizes equation with a positive and negative number", () =>
    expect(lex("+3+-3")).toEqual([3, "+", -3]));

it("errors on wrong equation", () => expect(() => lex("+-")).toThrowError());

it("tokenizes number", () => {
    const tokens = [12345];
    return expect(lex(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes negative number", () => {
    const tokens = [-23];
    return expect(lex(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes simple equation", () => {
    const tokens = [1, "-", 2];
    return expect(lex(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes - + equation", () => {
    const tokens = [4, "-", 5, "+", 6];
    return expect(lex(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes + - equation", () => {
    const tokens = [4, "+", 5, "-", 6];
    return expect(lex(untokenize(tokens))).toEqual(tokens);
});

// biome-ignore format:
it("tokenizes complex equation", () => {
    const tokens = ["(", -312316, "*", "(", 4256.1, "+", -590, "-", 612, ")", ")", "/", -7234];
    expect(lex(untokenize(tokens))).toEqual(tokens);
});

it("tokenizes trivial equation", () => {
    const tokens = ["+12.3e-6"];
    expect(lex(untokenize(tokens))).toEqual(tokens.map((s) => Number(s)));
});

it("tokenizes trivial bracketed equation", () => {
    const tokens = ["(", 12, ")"];
    expect(lex(untokenize(tokens))).toEqual(tokens);
});

it("errors on wrong number", () => {
    return expect(() => lex("+12.3-e6")).toThrowError("Expected expression");
});

it("errors on empty bracket-only equation", () => {
    return expect(() => lex("()")).toThrowError();
});
