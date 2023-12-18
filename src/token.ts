export type BinaryOpSymbol = "+" | "-" | "*" | "/" | "^";
export type Token = number | BinaryOpSymbol | "(" | ")";
export type PostfixToken = number | BinaryOpSymbol;
type BinaryOp = {
    precedence: number;
    fn: (left: number, right: number) => number;
};

// All binary operators with their functions.
// biome-ignore format:
export const BINARY_OPS: Map<BinaryOpSymbol, BinaryOp> = new Map([
    ["+", { precedence: 1, fn: (left: number, right: number): number => left + right }],
    ["-", { precedence: 1, fn: (left: number, right: number): number => left - right }],
    ["*", { precedence: 2, fn: (left: number, right: number): number => left * right }],
    ["/", { precedence: 2, fn: (left: number, right: number): number => left / right }],
    ["^", { precedence: 3, fn: (left: number, right: number): number => left ** right }],
]);

export function precedence(token: Token): number {
    const precedence = BINARY_OPS.get(token as BinaryOpSymbol)?.precedence;
    return precedence ?? -1;
}
