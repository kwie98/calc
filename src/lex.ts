import { BINARY_OPS, BinaryOpSymbol, Token } from "./token";

const NUMBER = /^[+-]?[0-9]*\.?[0-9]+(e[+-]?[0-9]+)?/;

// Small finite state machine to discriminate number signs from operations:
enum State {
    ExpectBinaryOpOrClosing = 0,
    ExpectExpr = 1,
}

// TODO: Unary ops, signs as unary ops
export function lex(input: string): Token[] {
    let state = State.ExpectExpr;
    const tokens: Token[] = [];
    let remainder = input.replace(/\s/g, "");

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
                if ([...BINARY_OPS.keys()].includes(remainder[0] as BinaryOpSymbol)) {
                    tokens.push(remainder[0] as BinaryOpSymbol);
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
                    `Expected binary operation or closing bracket but found "${remainder}"`,
                );
            }
        }
    }
    return tokens;
}
