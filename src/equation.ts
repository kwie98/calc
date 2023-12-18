import { OPERATORS, Token, tokenize } from "./tokenize";

type Node = NumNode | OpNode;

export function parse(input: string): Node | null {
    return parse_term(tokenize(input), 0);
}

// WARNING: Can only parse bracketed negative numbers!
// Receives input with no spaces.
// Recurses when parsing brackets.
function parse_term(tokens: Token[], openedBrackets: number): Node | null {
    // let left = null;
    // let op = null;
    // let right = null;
    let cur_node: Node;

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === "(") {
            return parse_term(tokens.slice(i + 1), openedBrackets + 1);
        }
        if (tokens[i] === ")") {
            if (openedBrackets === 0) {
                return null; // too many closing brackets
            }
            return null; // TODO done with this braket
        }
    }
    return cur_node;
}

function intersperse<T>(arr: T[], element: T): T[] {
    return arr.flatMap((x) => [element, x]).slice(1);
}

class NumNode {
    item: number;
    constructor(item: number) {
        this.item = item;
    }
    resolve() {
        return this.item;
    }
}

class OpNode {
    resolve: () => number;
    constructor(left: Node, right: Node, operator: string) {
        const resolver = OPERATORS.get(operator);
        if (resolver === undefined) {
            throw Error(`Could not parse operator ${operator}.`);
        }
        this.resolve = () => resolver(left.resolve(), right.resolve());
    }
}
