const input = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`

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
let tail = []
for (let i = 0; i < 10 - 1; i++) {
	tail.push([0, 0])
}
let stepIndex = 0

const tailPositions = new Set([_([0, 0])])

const stage = new Stage({ speed: 3.0 })
stage.update = (context) => {
	const step = steps[stepIndex]
	if (step === undefined) {
		print("done", tailPositions)
		stage.paused = true
		return
	}

	const [hx, hy] = headPosition
	const [sx, sy] = step

	headPosition = [hx + sx, hy + sy]

	let position = headPosition
	for (let i = 0; i < tail.length; i++) {
		const tailPosition = tail[i]
		const displacement = subtract(tailPosition, position)
		const [dx, dy] = displacement

		if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
			if (dx !== 0) {
				tailPosition[0] -= Math.sign(dx)
			}
			if (dy !== 0) {
				tailPosition[1] -= Math.sign(dy)
			}
			if (i === tail.length - 1) {
				tailPositions.add(_(tailPosition))
			}
		}

		position = tailPosition
	}

	const { canvas } = context
	const CELL_SIZE = 2
	const ORIGIN = [canvas.width / 2 - CELL_SIZE / 2 - 300, canvas.height / 2 - CELL_SIZE / 2 + 200]

	context.clearRect(0, 0, context.canvas.width, context.canvas.height)
	context.fillStyle = GREY
	for (const position of tailPositions) {
		const [x, y] = JSON.parse(position)[0]
		context.fillRect(ORIGIN[0] + x * CELL_SIZE, ORIGIN[1] + y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
	}

	for (const tailPosition of tail) {
		context.fillStyle = SILVER
		context.fillRect(
			ORIGIN[0] + tailPosition[0] * CELL_SIZE,
			ORIGIN[1] + tailPosition[1] * CELL_SIZE,
			CELL_SIZE,
			CELL_SIZE,
		)
	}

	context.fillStyle = WHITE
	context.fillRect(
		ORIGIN[0] + headPosition[0] * CELL_SIZE,
		ORIGIN[1] + headPosition[1] * CELL_SIZE,
		CELL_SIZE,
		CELL_SIZE,
	)

	stepIndex++
}
