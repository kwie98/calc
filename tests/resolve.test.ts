import { expect, it } from "vitest";
import { resolvePostfix, toPostfix } from "../src/postfix";
import { lex } from "../src/lex";

function resolve(input: string): number {
    return resolvePostfix(toPostfix(lex(input)))
}

it("resolves trivial equation", () => expect(resolve("123")).toEqual(123));

it("resolves simple equation", () => expect(resolve("1 + 2")).toEqual(3));

it("resolves equation with all operators", () =>
    expect(resolve("2 + 3 * 4 - 15 / 5 ^ 2")).toEqual(13.4));

it("resolves equation with all operators and brackets", () =>
    expect(resolve("(2 + 3) * 4 - 15 / 5 ^ 2")).toEqual(19.4));

it("errors on unbalanced brackets", () =>
    expect(() => resolve("3 + 4)")).toThrowError("unbalanced"));
