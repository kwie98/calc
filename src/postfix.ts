import { BINARY_OPS, PostfixToken, Token, precedence } from "./token";

export function toPostfix(tokens: Token[]): PostfixToken[] {
    const stack: Token[] = [];
    const result: Token[] = [];
    for (const c of tokens) {
        if (typeof c === "number") {
            result.push(c);
            continue;
        }
        if (c === "(") {
            stack.push(c);
            continue;
        }
        if (c === ")") {
            while (true) {
                const t = stack.pop();
                if (t === undefined) throw Error(`Found unbalanced brackets in "${tokens}"`);
                if (t === "(") break;
                result.push(t);
            }
            continue;
        }
        while (stack.length > 0 && precedence(c) <= precedence(stack[stack.length - 1])) {
            result.push(stack.pop() as Token);
        }
        stack.push(c);
    }
    return [...result, ...stack.reverse()] as PostfixToken[];
}

export function resolvePostfix(tokens: PostfixToken[]): number {
    const stack: number[] = [];
    for (const token of tokens) {
        if (typeof token === "number") {
            stack.push(token);
            continue;
        }
        const right = stack.pop();
        const left = stack.pop();
        if (left === undefined || right === undefined)
            throw Error(`Not enough operands in "${tokens}"`);
        const result = BINARY_OPS.get(token)?.fn(left, right);
        if (result === undefined) throw Error("Impossible");
        stack.push(result);
    }
    if (stack.length !== 1) throw Error(`Not enough operations in "${tokens}"`);
    return stack[0];
}
