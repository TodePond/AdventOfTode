
const input = ``

MotherTode`
Language :: Expression
Expression :: Number Operations? >> ([l, ops]) => ["("].repeated(ops.child.child[0].child.length).join("") + l.output + ops.output
Number :: Group | Literal
Literal :: /[0-9]/+
Operations :: Operation+
Operation :: Add | Times >> (o) => o.output + ")"
Add :: " + " Number >> (e) => e.output
Times :: " * " Number  >> (e) => e.output
Group :: "(" Expression ")"
`

new Function("return " + TERM.Language("1 + 2 * 3 + 4 * 5 + 6".d).output.d)().d
new Function("return " + TERM.Language("2 * 3 + (4 * 5)".d).output.d)().d
new Function("return " + TERM.Language("5 + (8 * 3 + 9 + 3 * 4 * 3)".d).output.d)().d
new Function("return " + TERM.Language("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))".d).output.d)().d
new Function("return " + TERM.Language("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2".d).output.d)().d

input.split("\n").map(line => new Function("return " + TERM.Language(line).output)()).reduce((a,b) => a+b).d