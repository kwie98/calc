import { lex } from "./lex";
import { resolvePostfix, toPostfix } from "./postfix";

const DEFAULT_DISPLAY = "0";

const display = document.querySelector("#display") as HTMLInputElement;

const symbolBtns = document.querySelectorAll<HTMLButtonElement>(".symbol");
for (const btn of symbolBtns) {
    btn.onclick = () => {
        display.value = display.value + btn.innerHTML;
    };
}

const numberBtns = document.querySelectorAll<HTMLButtonElement>(".number");
for (const btn of numberBtns) {
    btn.onclick = () => {
        display.value =
            display.value === DEFAULT_DISPLAY
                ? btn.innerHTML
                : display.value + btn.innerHTML;
    };
}

const del = document.querySelector("#delete") as HTMLButtonElement;
del.onclick = () => {
    display.value = DEFAULT_DISPLAY;
};

const equals = document.querySelector("#equals") as HTMLButtonElement;
equals.onclick = () => {
    const input = display.value.length === 0 ? DEFAULT_DISPLAY : display.value;
    display.value = resolvePostfix(toPostfix(lex(input))).toString();
};
