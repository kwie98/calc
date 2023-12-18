export type Token = number | string;

// All operators with their functions.
// biome-ignore format:
export const OPERATORS = new Map([
    ["+", (left: number, right: number): number => left + right],
    ["-", (left: number, right: number): number => left - right],
    ["*", (left: number, right: number): number => left * right],
    ["/", (left: number, right: number): number => left / right],
    ["^", (left: number, right: number): number => left ** right],
]);
const UNIQUE_SYMBOLS = ["*", "/", "(", ")"]; // symbols that are never part of numbers
const SIGNS = ["+", "-"];
const SYMBOLS = [...UNIQUE_SYMBOLS, ...SIGNS];
const NUMBERS = [...".0123456789"];
// const NUMBER = /[+-]?[0-9]*\.?[0-9]*(e[+-]?[0-9]*\.?[0-9]*)?/;

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let current_start = 0; // start of current symbol

    // Check if a symbol (of `SYMBOLS`) represents an operation or is the sign of a number:
    function isOperation(char: string): boolean {
        if (UNIQUE_SYMBOLS.includes(char)) return true;
        // Is it + or -?
        if (!SIGNS.includes(char)) return false;
        // Is that + or - actually a sign of a number?
        const last_token = tokens[tokens.length - 1];
        if (
            last_token === undefined ||
            (typeof last_token === "string" &&
                ["(", ...OPERATORS.keys()].includes(last_token))
        )
            return false;
        return true;
    }

    for (let i = 0; i < input.length; i++) {
        if (isOperation(input[i])) {
            tokens.push(input[i]);
            current_start = i + 1;
            continue;
        }
        if (NUMBERS.includes(input[i]) || SIGNS.includes(input[i])) {
            // If this is the last char of a number token, parse it:
            if (input[i + 1] === undefined || SYMBOLS.includes(input[i + 1])) {
                const slice = input.slice(current_start, i + 1);
                // Screw you, javascript:
                if (slice === "") throw Error("Clearly this could never happen?");
                const num = Number(slice);
                if (Number.isNaN(num)) throw Error(`Could not parse number ${slice}.`);

                tokens.push(num);
                current_start = i + 1;
                continue;
            }
            // We ain't at the end yet, yo:
            continue;
        }
        throw Error(
            `Could not parse symbol ${input[i]} in ${input} at index ${i}.`,
        );
    }
    return tokens;
}
