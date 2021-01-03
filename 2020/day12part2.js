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
Forward :: "F" Number >> ([_, n]) => \`moveBoat(1, \${n.output})\`
Backward :: "B" Number >> ([_, n]) => \`moveBoat(-1, \${n.output})\`
North :: "N" Number >> ([_, n]) => \`moveWaypoint(0, \${n.output})\`
South :: "S" Number >> ([_, n]) => \`moveWaypoint(0, -\${n.output})\`
East :: "E" Number >> ([_, n]) => \`moveWaypoint(\${n.output}, 0)\`
West :: "W" Number >> ([_, n]) => \`moveWaypoint(-\${n.output}, 0)\`
Left :: "L" Number >> ([_, n]) => \`changeDirection(-1, \${n.output})\`
Right :: "R" Number >> ([_, n]) => \`changeDirection(1, \${n.output})\`
Number :: /[0-9]/+ >> (n) => n.output.as(Number)
`

let waypointPosition = [10, 1]
let boatPosition = [0, 0]
const COMPASS = ["N", "E", "S", "W"]
const COMPASS_INFO = [[0, 1], [1, 0], [0, -1], [-1, 0]]

const changeDirection = (way, amount) => {
	const turns = amount / 90
	for (let i = 0; i < turns; i++) {
		if (way ===  1) waypointPosition = turnRight(...waypointPosition)
		if (way === -1) waypointPosition = turnLeft(...waypointPosition)
	}
}

const turnRight = (x, y) => [y, -x]
const turnLeft = (x, y) => [-y, x]

const moveBoat = (forwards, times) => {
	const [x, y] = boatPosition
	const [wx, wy] = waypointPosition
	const [dx, dy] = [forwards * times * wx, forwards * times * wy]
	const [nx, ny] = [x + dx, y + dy]
	boatPosition = [nx, ny]
}

const moveWaypoint = (dx, dy) => {
	const [x, y] = waypointPosition
	waypointPosition = [x + dx, y + dy]
}

const loopCompass = (c) => {
	while (c > 3) c -= 4
	while (c < 0) c += 4
	return c
}

const func = new Function(instructions.map(i => TERM.Language(i).output).join("\n"))
func.d()

const [x, y] = boatPosition
const [ax, ay] = [Math.abs(x), Math.abs(y)]
print(ax + ay)