const input = `noop
noop
addx 15
addx -10
noop
noop
addx 3
noop
noop
addx 7
addx 1
addx 4
addx -1
addx 1
addx 5
addx 1
noop
noop
addx 5
addx -1
noop
addx 3
noop
addx 3
addx -38
noop
addx 3
addx 2
addx 5
addx 2
addx 26
addx -21
addx -2
addx 5
addx 2
addx -14
addx 15
noop
addx 7
noop
addx 2
addx -22
addx 23
addx 2
addx 5
addx -40
noop
noop
addx 3
addx 2
noop
addx 24
addx -19
noop
noop
noop
addx 5
addx 5
addx 2
noop
noop
noop
noop
addx 7
noop
addx 3
noop
addx 3
addx -2
addx 2
addx 5
addx -38
noop
noop
noop
addx 5
addx 2
addx -1
addx 2
addx 30
addx -23
noop
noop
noop
noop
addx 3
addx 5
addx -11
addx 12
noop
addx 6
addx 1
noop
addx 4
addx 3
noop
addx -40
addx 4
addx 28
addx -27
addx 5
addx 2
addx 5
noop
noop
addx -2
addx 2
addx 5
addx 3
noop
addx 2
addx -25
addx 30
noop
addx 3
addx -2
addx 2
addx 5
addx -39
addx 29
addx -27
addx 5
noop
noop
noop
addx 4
noop
addx 1
addx 2
addx 5
addx 2
noop
noop
noop
noop
addx 5
addx 1
noop
addx 2
addx 5
addx -32
addx 34
noop
noop
noop
noop`

const lines = input.split("\n")

const terms = Term.hoist(({ line, number, addx, noop }) => {
	return {
		line: Term.or([noop, addx]),
		noop: Term.emit(Term.string("noop"), () => _({ type: "noop" })),
		addx: Term.emit(Term.list([Term.string("addx "), number]), ([addx, v]) => {
			return _([
				{
					type: "addingx",
				},
				{
					type: "addx",
					value: parseInt(v),
				},
			])
		}),
		number: Term.list([Term.maybe(Term.string("-")), Term.regExp(/[0-9]+/)]),
	}
})

const commands = lines.map((line) => JSON.parse(terms.line.translate(line))[0]).flat().d

const screen = new Map()
const SCREEN_HEIGHT = 6
const SCREEN_WIDTH = 40
for (const y of numbersBetween(0, SCREEN_HEIGHT - 1)) {
	for (const x of numbersBetween(0, SCREEN_WIDTH - 1)) {
		screen.set(_(x, y), -1)
	}
}

const getPositionFromIndex = (index) => {
	const y = Math.floor(index / SCREEN_WIDTH)
	const x = index % SCREEN_WIDTH
	return _(x, y)
}

const stage = new Stage({ speed: 0.25 })

const CELL_SIZE = 20
const OFFSET = [100, 400]

let commandIndex = 0
let x = 1
let c = 1

stage.tick = (context) => {
	const command = commands[commandIndex]
	if (command === undefined) {
		stage.paused = true
		return
	}

	if (command.type == "addx") {
		x += command.value
	}
	c++
	commandIndex++

	const screenPosition = getPositionFromIndex(c - 1)
	const cyclePosition = (c - 1) % SCREEN_WIDTH
	const spritePosition = x

	if (Math.abs(cyclePosition - spritePosition) < 2) {
		screen.set(screenPosition, 1)
	} else {
		screen.set(screenPosition, 0)
	}

	const { canvas } = context
	context.fillStyle = VOID
	context.fillRect(0, 0, canvas.width, canvas.height)
	for (const x of numbersBetween(0, SCREEN_WIDTH - 1)) {
		for (const y of numbersBetween(0, SCREEN_HEIGHT - 1)) {
			if (x === 0 && y === 0) {
				context.fillStyle = BLACK
			} else if (_(x, y) === screenPosition) {
				context.fillStyle = WHITE
			} else if (screen.get(_(x, y)) === 1) {
				context.fillStyle = GREEN
			} else if (screen.get(_(x, y)) === -1) {
				context.fillStyle = GREY
			} else {
				context.fillStyle = BLACK
			}
			context.fillRect(OFFSET.x + x * CELL_SIZE, OFFSET.y + y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
		}
	}
}
