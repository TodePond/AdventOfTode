input = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

const NL = "\n"
const Entries = MotherTode(`
	
	:: Entry {"\n" Entry}
	>> ([head, tail]) => "[" + NL + head + "," + tail.join(",") + NL + "]"

	Entry (
		:: Position " -> " Position
		>> ([left, _, right]) => "[" + left + ", " + right + "]"
	)
	
	Position (
		:: Number "," Number
		>> ([x, _, y]) => "{x: " + x + ", y: " + y + "}"
		Number :: /[0-9]/+
	)

`)

const makeLine = (entry) => {
	const [start, end] = entry
	const [sx, sy] = start
	const [ex, ey] = end
	//if (sx === ex || sy === ey) {
		const [dx, dy] = [ex - sx, ey - sy]
		const [adx, ady] = [dx, dy].map(Math.abs)
		const length = Math.max(adx, ady)
		const [ix, iy] = [dx, dy].map(d => d / length)
		let [x, y] = [sx, sy]
		const line = []
		for (let i = 0; i <= length; i++) {
			line.push([x, y])
			x += ix
			y += iy
		}
		return line
	//}

	//else return undefined
}

const entries = JavaScript `${Entries(input).output}`
const lines = entries.map(makeLine).filter(line => line !== undefined).d

let min = Infinity
let max = 0

for (const entry of entries) {
	for (const position of entry) {
		for (const axis of position) {
			if (axis < min) min = axis
			if (axis > max) max = axis
		}
	}
}

const grid = {}
const getKey = (x, y) => `${x},${y}`

for (let x = 0; x <= max; x++) {
	for (let y = 0; y <= max; y++) {
		grid[getKey(x, y)] = {count: 0}
	}
}

const state = {
	line: 0,
	linePosition: 0,
	finished: false
}

const BLUE_THICKNESS = 1
const WHITE_THICKNESS = 1

let overlaps = 0

on.load(() => {
	const show = Show.start({overload: 50, paused: true})
	const {canvas, context} = show

	// Background
	/*context.translate(canvas.width/2, canvas.height/2)
	context.scale(0.95, 0.95)
	context.translate(-canvas.width/2, -canvas.height/2)
	context.fillStyle = Colour.Grey
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.resetTransform()*/

	show.tick = () => {

		if (state.finished) return
		
		context.translate(canvas.width/2, canvas.height/2)
		context.scale(0.95, 0.95)
		context.translate(-canvas.width/2, -canvas.height/2)

		const line = lines[state.line]
		const [x, y] = line[state.linePosition]
		const cell = grid[getKey(x, y)]
		
		if (cell.count === 1) overlaps++
		cell.count++

		if (cell.count !== 0) {
			if (cell.count === 1) {
				context.fillStyle = Colour.Blue
				context.fillRect(x * canvas.width / (max+1), y * canvas.height / (max+1), canvas.width/(max+1), canvas.height/(max+1))
			}
			if (cell.count > 1) {
				context.fillStyle = Colour.White
				context.fillRect(x * canvas.width / (max+1), y * canvas.height / (max+1), canvas.width/(max+1), canvas.height/(max+1))
			}
		}

		state.linePosition++
		if (state.linePosition >= line.length) {
			state.linePosition = 0
			state.line++
			if (state.line >= lines.length) {
				state.finished = true

				print(overlaps)

			}
		}
		
		context.resetTransform()
		
	}

})