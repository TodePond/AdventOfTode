
const input = ``

MotherTode`
Language :: Expression
Expression :: Number
Number :: Operation | Group | Literal
Literal :: /[0-9]/+
Operation :: Multiply | Add
Add :: Number except Add " + " Number >> (a) => "(" + a.output + ")"
Multiply :: Number except Multiply " * " Number
Group :: "(" any Number ")"
`

new Function("return " + TERM.Language("1 + 2 * 3 + 4 * 5 + 6".d).output.d)().d
new Function("return " + TERM.Language("2 * 3 + (4 * 5)".d).output.d)().d
new Function("return " + TERM.Language("5 + (8 * 3 + 9 + 3 * 4 * 3)".d).output.d)().d
new Function("return " + TERM.Language("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))".d).output.d)().d
new Function("return " + TERM.Language("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2".d).output.d)().d

input.split("\n").map(line => new Function("return " + TERM.Language(line).output)()).reduce((a,b) => a+b).d

