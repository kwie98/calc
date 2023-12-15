export type Token = number | string;
// Handle whitespace and negative numbers
export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let pot_num_start = 0; // potential start of a number
    let after_op = false; // set to true iff previous token was an operator

    // Parse whatever is in the slice (pot_num_start, i)
    function parse_pot_num(i: number) {
        const slice = input.slice(pot_num_start, i)
        if (slice === "") return;
        const num = Number(slice);
        console.log(num)
        if (Number.isNaN(num)) {
            throw Error(`Could not parse number ${slice}`);
        }
        tokens.push(num);
    }

    function handle_symbol(i: number, is_op: boolean) {
        // Found a potential number before this symbol (...but could be whitespace or gibberish):
        if (pot_num_start < i) {
            parse_pot_num(i)
        }
        pot_num_start = i + 1;
        tokens.push(input[i]);
        if (is_op) {
            after_op = true;
        }
    }

    for (let i = 0; i < input.length; i++) {
        switch (input[i]) {
            case "(":
            case ")":
                handle_symbol(i, false);
                break;
            case "+":
            case "*":
            case "/":
                handle_symbol(i, true);
                break;
            case "-":
                // This `-` is an operator:
                if (!after_op) {
                    handle_symbol(i, true);
                    break;
                }
                // This `-` is part of a number:
                break;
            default:
                break;
        }
    }
    parse_pot_num(input.length)
    return tokens;
}
