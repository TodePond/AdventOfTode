
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

const entries = JavaScript `${Entries(input).output}`

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

for (let x = 0; x < max; x++) {
	for (let y = 0; y < max; y++) {
		grid[getKey(x, y)] = {count: 0}
	}
}

const draw = (context) => {

	

}

on.load(() => {
	const show = Show.start()
	const {canvas, context} = show

	show.tick = () => {

		context.translate(canvas.width/2, canvas.height/2)
		context.scale(0.95, 0.95)
		context.translate(-canvas.width/2, -canvas.height/2)

		context.fillStyle = Colour.Grey
		context.fillRect(0, 0, canvas.width, canvas.height)

		for (let x = 0; x < max; x++) {
			for (let y = 0; y < max; y++) {
				const cell = grid[getKey(x, y)]
				
				const r = Colour.Blue[0]
				const g = Colour.Blue[1]
				const b = Colour.Blue[2]
				const a = (cell.count / 10) + "%"

				context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
				context.fillRect(x * canvas.width / max, y * canvas.height / max, canvas.width/max, canvas.height/max)
			}
		}

		context.resetTransform()

	}
})