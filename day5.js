const input = `...`

const lines = input.split("\n")

MotherTode `
Language :: Pass
Pass (
	:: FrontBack LeftRight
	>> ([fb, lr]) => fb.output * 8 + lr.output
)
FrontBack :: FB FB FB FB FB FB FB >> (n) => parseInt(n.output, 2)
LeftRight :: LR LR LR >> (n) => parseInt(n.output, 2)
FB :: F | B
LR :: L | R
F :: "F" >> () => 0
B :: "B" >> () => 1
L :: "L" >> () => 0
R :: "R" >> () => 1
`

const ids = lines.map(line => TERM.Language(line).output).sort((a, b) => a - b)

let idBuffer = ids[0] - 1
for (const id of ids) {
	idBuffer++
	if (id !== idBuffer) break
}

print(idBuffer)
