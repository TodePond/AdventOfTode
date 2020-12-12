const input = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`

const rows = input.split("\n")
let grid = rows.map(r => r.split(""))

const pre = HTML `<pre></pre>`
document.body.appendChild(pre)

const draw = () => {
	const text = getText()
	pre.innerHTML = text
}

const getText = () => {
	let text = ""
	for (const row of grid) {
		for (const element of row) {
			text += element
		}
		text += "\n"
	}
	return text
}

const getElement = (x, y) => {
	if (grid[y] !== undefined) return grid[y][x]
	return undefined
}

const directions = [
	[ 1, 0],
	[ 1, 1],
	[ 1,-1],
	[ 0,-1],
	[ 0, 1],
	[-1, 0],
	[-1, 1],
	[-1,-1],
]

const see = (x, y, [dx, dy]) => {
	const [nx, ny] = [x + dx, y + dy]
	const element = getElement(nx, ny)
	if (element === "#") return "#"
	if (element === "L") return "L"
	if (element === undefined) return "."
	return see(nx, ny, [dx, dy])
}

const getNeighbours = (x, y) => {	
	const neighbours = directions.map((direction) => see(x, y, direction))
	return neighbours
}

const update = () => {
	
	const newGrid = []
	
	for (let y = 0; y < grid.length; y++) {
		const row = grid[y]
		newGrid.push([])
		for (let x = 0; x < row.length; x++) {
			const element = row[x]
			if (element === "L") {
				const neighbours = getNeighbours(x, y)
				if (neighbours.every(n => n !== "#")) newGrid.last.push("#")
				else newGrid.last.push("L")
			}
			else if (element === "#") {
				const neighbours = getNeighbours(x, y)
				if (neighbours.filter(n => n === "#").length >= 5) newGrid.last.push("L")
				else newGrid.last.push("#")
			}
			else newGrid.last.push(element)
		}
	}
	
	grid = newGrid
}

const countSeats = () => {
	let count = 0
	for (const row of grid) {
		for (const element of row) {
			if (element === "#") count++
		}
	}
	return count
}

let isDrawTurn = true
const tick = () => {
	const oldText = getText()
	update()
	if (isDrawTurn) draw()
	isDrawTurn = !isDrawTurn
	print(countSeats())
	const newText = getText()
	if (oldText !== newText) setTimeout(tick, 100)
}

tick()