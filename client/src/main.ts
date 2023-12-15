import "./style.css";

let current_equation = "";

const numbers = document.querySelectorAll<HTMLButtonElement>(".number")
for (const n of numbers) {
    console.log(n.innerHTML)
}

const disp = document.querySelector<HTMLInputElement>(".disp")
// disp?.oninput = (e) => {
//     console.log(e)
// }
disp?.addEventListener("input", (e) => {
    console.log(e)
    // e.preventDefault()
})
