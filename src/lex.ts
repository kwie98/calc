export type Token = number | string;

// All binary operators with their functions.
// biome-ignore format:
export const BINARY_OPS = new Map([
    ["+", (left: number, right: number): number => left + right],
    ["-", (left: number, right: number): number => left - right],
    ["*", (left: number, right: number): number => left * right],
    ["/", (left: number, right: number): number => left / right],
    ["^", (left: number, right: number): number => left ** right],
]);
const NUMBER = /^[+-]?[0-9]*\.?[0-9]+(e[+-]?[0-9]+)?/;

// Small finite state machine to discriminate number signs from operations:
enum State {
    ExpectBinaryOpOrClosing = 0,
    ExpectExpr = 1,
}

export function lex(input: string): Token[] {
    let state = State.ExpectExpr;
    const tokens: Token[] = [];
    let remainder = input;

    while (remainder.length > 0) {
        switch (state) {
            case State.ExpectExpr: {
                const match = NUMBER.exec(remainder);
                if (match !== null) {
                    const num = Number(match[0]);
                    if (Number.isNaN(num)) {
                        throw Error(`Expected number but found ${match[0]}`);
                    }
                    tokens.push(num);
                    remainder = remainder.slice(match[0].length);
                    state = State.ExpectBinaryOpOrClosing;
                    continue;
                }
                if (remainder[0] === "(") {
                    tokens.push(remainder[0]);
                    remainder = remainder.slice(1);
                    state = State.ExpectExpr;
                    continue;
                }
                throw Error(`Expected expression but found ${remainder}.`);
            }
            case State.ExpectBinaryOpOrClosing: {
                if ([...BINARY_OPS.keys()].includes(remainder[0])) {
                    tokens.push(remainder[0]);
                    remainder = remainder.slice(1);
                    state = State.ExpectExpr;
                    continue;
                }
                if (remainder[0] === ")") {
                    tokens.push(remainder[0]);
                    remainder = remainder.slice(1);
                    state = State.ExpectBinaryOpOrClosing;
                    continue;
                }
                throw Error(
                    `Expected binary operation or closing bracket but found ${remainder}`,
                );
            }
        }
    }
    return tokens;
}
