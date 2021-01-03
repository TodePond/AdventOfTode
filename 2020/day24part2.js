const input = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`

const lines = input.split("\n")

MotherTode`
Language :: Tile >> t => JS([t])
Tile :: Expression >> (e) => "[" + e + "]"
Expression :: Directions | Direction
Directions :: Direction Expression >> ([left, right]) => left + ", " + right
Direction :: East | SouthEast | SouthWest | West | NorthWest | NorthEast >> (d) => '"' + d + '"'
East :: "e"
SouthEast :: "se"
SouthWest :: "sw"
West :: "w"
NorthWest :: "nw"
NorthEast :: "ne"
`

const DIRECTIONS = {
	ne: [ 1, 1],
	nw: [-1, 1],
	se: [ 1,-1],
	sw: [-1,-1],
	e:  [ 2, 0],
	w:  [-2, 0],
}

const getPosition = (tile) => {
	let [x, y] = [0, 0]
	for (const d of tile) {
		const [dx, dy] = DIRECTIONS[d]
		x += dx
		y += dy
	}
	return [x, y]
}

const getTallies = (positions) => {
	const tallies = {}
	for (const position of positions) {
		const key = getKey(position)
		if (tallies[key] === undefined) tallies[key] = 0
		tallies[key]++
	}
	return tallies
}

const getKey = (position) => position.join(",")
const readKey = (key) => key.split(",").map(n => n.as(Number))

const getBlackCount = (spaces) => Object.values(spaces).filter(v => v).length

const NEIGHBOURS = Object.values(DIRECTIONS)
const getNeighbours = ([x, y], force = false) => {
	const neighbours = []
	for (const [dx, dy] of NEIGHBOURS) {
		const [nx, ny] = [x+dx, y+dy]
		const neighbour = $Space([nx, ny], force)
		neighbours.push(neighbour)
	}
	return neighbours
}

const $Space = ([x, y], force = false) => {
	const key = getKey([x, y])
	if (force && spaces[key] === undefined) spaces[key] = false
	return spaces[key]
}

const tiles = lines.map(line => TERM.Language(line).output)
const positions = tiles.map(tile => getPosition(tile))
const tallies = getTallies(positions)
const blacks = Object.values(tallies).filter(t => t % 2 !== 0)

let spaces = {}
for (const key in tallies) {
	spaces[key] = tallies[key] % 2 !== 0
}

const style = HTML`<style>
	* {margin: 0px}
</style>`
document.head.appendChild(style)

const canvas = HTML`<canvas style="width:100%; height:100%;"></canvas>`
document.body.appendChild(canvas)
const resizeCanvas = () => {
	canvas.width = window.innerWidth * window.devicePixelRatio
	canvas.height = window.innerHeight * window.devicePixelRatio
}
window.on.resize(resizeCanvas)
resizeCanvas()

const ctx = canvas.getContext("2d")

const TILE_SIZE = 5
const TILE_MARGIN = 0.9
const draw = (spaces) => {
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = "black"
	for (const key in spaces) {
		const [x, y] = readKey(key)
		const element = spaces[key]
		if (!element) continue
		const [ax, ay] = [canvas.width / 2 + x * TILE_SIZE / 2, canvas.height / 2 + y * TILE_SIZE]
		ctx.fillRect(ax, ay, TILE_SIZE * TILE_MARGIN, TILE_SIZE * TILE_MARGIN)
	}
}

const process = (spaces) => {
	// Pad Neighbours
	for (const key in spaces) {
		const [x, y] = readKey(key)
		const space = spaces[key]
		if (space) getNeighbours([x, y], true)
	}
	
	const newSpaces = {}
	for (const key in spaces) {
		const [x, y] = readKey(key)
		const space = spaces[key]
		const neighbours = getNeighbours([x, y])
		const score = neighbours.filter(v => v).length
		if (space) {
			if (score === 0 || score > 2) newSpaces[key] = false
			else newSpaces[key] = true
		}
		else {
			if (score === 2) newSpaces[key] = true
			else newSpaces[key] = false
		}
	}
	return newSpaces
}

let t = 0
const tick = () => {
	if (t < 10 || t % 10 === 0) print("Black spaces on turn", t, ":", getBlackCount(spaces))
	spaces = process(spaces)
	draw(spaces)
	t++
	setTimeout(tick, 100)
}

//draw(spaces)
//on.mousedown(tick)
tick()