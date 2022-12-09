const input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`

const lines = input.split("\n")

const terms = Term.hoist(({ line, command, number, direction, up, down, left, right }) => {
	return {
		line: Term.emit(Term.list([direction, Term.string(" "), number]), ([v, _, n]) => {
			return repeatArray([v], n)
		}),
		number: Term.emit(Term.regExp(/[0-9]+/), (v) => parseInt(v)),
		direction: Term.emit(Term.or([up, down, left, right]), ([v]) => v),
		up: Term.emit(Term.string("U"), () => [0, -1]),
		down: Term.emit(Term.string("D"), () => [0, 1]),
		left: Term.emit(Term.string("L"), () => [-1, 0]),
		right: Term.emit(Term.string("R"), () => [1, 0]),
	}
})

const steps = lines.map((line) => terms.line.translate(line)).flat()

print("steps", steps)

let headPosition = [0, 0]
let tailPosition = [0, 0]

const tailPositions = new Set([_(tailPosition)])

for (const step of steps) {
	const [hx, hy] = headPosition
	const [sx, sy] = step

	headPosition = [hx + sx, hy + sy]
	const displacement = subtract(tailPosition, headPosition)
	const [dx, dy] = displacement

	const movement = Math.abs(dx) + Math.abs(dy)

	if (movement > 1) {
		tailPosition = [hx, hy]
		tailPositions.add(_(tailPosition))
	}
}

tailPositions.d
