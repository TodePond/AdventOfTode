const input = `F10
N3
F7
R90
F11`

const instructions = input.split("\n")

MotherTode`
Language :: Expression
Expression :: Instruction
Instruction :: Forward | Backward | North | South | East | West | Left | Right
Forward :: "F" Number >> ([_, n]) => \`move(COMPASS_INFO[direction][0] * \${n.output}, COMPASS_INFO[direction][1] * \${n.output})\`
Backward :: "B" Number >> ([_, n]) => \`move(-COMPASS_INFO[direction][0] * \${n.output}, -COMPASS_INFO[direction][1] * \${n.output})\`
North :: "N" Number >> ([_, n]) => \`move(0, \${n.output})\`
South :: "S" Number >> ([_, n]) => \`move(0, -\${n.output})\`
East :: "E" Number >> ([_, n]) => \`move(\${n.output}, 0)\`
West :: "W" Number >> ([_, n]) => \`move(-\${n.output}, 0)\`
Left :: "L" Number >> ([_, n]) => \`changeDirection(-1, \${n.output})\`
Right :: "R" Number >> ([_, n]) => \`changeDirection(1, \${n.output})\`
Number :: /[0-9]/+ >> (n) => n.output.as(Number)
`

let position = [0, 0]
let direction = 1
const COMPASS = ["N", "E", "S", "W"]
const COMPASS_INFO = [[0, 1], [1, 0], [0, -1], [-1, 0]]

const changeDirection = (way, amount) => {
	const turns = amount / 90
	const movement = turns * way
	const newDirection = loopCompass(direction + movement)
	direction = newDirection
}

const move = (dx, dy) => {
	const [x, y] = position
	position = [x + dx, y + dy]
}

const loopCompass = (c) => {
	while (c > 3) c -= 4
	while (c < 0) c += 4
	return c
}

const func = new Function(instructions.map(i => TERM.Language(i).output).join("\n"))
func.d()

const [x, y] = position.d
const [ax, ay] = [Math.abs(x), Math.abs(y)]
print(ax + ay)
