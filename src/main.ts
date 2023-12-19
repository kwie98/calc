import { lex } from "./lex";
import { resolvePostfix, toPostfix } from "./postfix";

const display = document.querySelector("#display") as HTMLInputElement;

const charBtns = document.querySelectorAll<HTMLButtonElement>(".char");
for (const btn of charBtns) {
    btn.onclick = () => {
        display.value = display.value + btn.innerHTML;
    };
}

const del = document.querySelector("#delete") as HTMLButtonElement;
del.onclick = () => {
    display.value = "0"
}

const equals = document.querySelector("#equals") as HTMLButtonElement;
equals.onclick = () => {
    const input = display.value.length === 0 ? "0" : display.value
    display.value = resolvePostfix(toPostfix(lex(input))).toString()
}
