const input = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`

const tiles = input.split("\n\n")
MotherTode`
Tile :: Label Picture >> ([label, picture]) => ({[label.output]: picture.output})
Label :: "Tile " Number ":" >> ([_, n]) => n.output
Number :: /[0-9]/+ >> (n) => n.output.as(Number)
Picture (
	:: Row Row Row Row Row Row Row Row Row Row
	>> (rows) => rows.map(r => r.output)
)
Row (
	:: "\n" Column Column Column Column Column Column Column Column Column Column
	>> ([_, ...symbols]) => symbols.map(s => s.output)
)
Column :: Monster | Water
Monster :: "#"
Water :: "."
`

const pieces = tiles.map(t => TERM.Tile(t).output).reduce((a,b) => ({...a, ...b}))
const PIECE_COUNT = Object.values(pieces).length
print("Number of Pieces: ", PIECE_COUNT)

const TRANSFORMATIONS = [
	(x,y) => [ x, y],
	(x,y) => [-x, y],
	(x,y) => [ x,-y],
	(x,y) => [-x,-y],
	(x,y) => [ y, x],
	(x,y) => [-y, x],
	(x,y) => [ y,-x],
	(x,y) => [-y,-x],
]

const PIECE_SIZE = 10
const PUZZLE_SIZE = Math.sqrt(Object.values(pieces).length)
const SHAVED_SIZE = PIECE_SIZE - 2
const MAP_SIZE = SHAVED_SIZE * PUZZLE_SIZE
print("Puzzle Size: ", PUZZLE_SIZE, "x", PUZZLE_SIZE)
print("Piece Size: ", PIECE_SIZE, "x", PIECE_SIZE)
print("Shaved Piece Size: ", SHAVED_SIZE, "x", SHAVED_SIZE)
print("Map Resolution: ", MAP_SIZE, "x", MAP_SIZE)

const getNeighbourMap = (pieces) => {
	const neighbourMap = {}
	const transformationMap = {}
	let t = 0
	for (let label in pieces) {
		const piece = pieces[label]
		const neighbours = getNeighbours(piece, pieces)
		neighbourMap[label] = neighbours.map(n => n[0])
		transformationMap[label] = neighbours.map(n => n.slice(1))
		print(`Piece ${label} neighbours:`, neighbours.map(n => n[0]))
		t++
	}
	return [neighbourMap, transformationMap]
}

const getNeighbours = (piece, pieces) => {
	const neighbours = []
	for (let label in pieces) {
		const neighbour = pieces[label]
		if (neighbour === piece) continue
		const result = isNeighbour(piece, neighbour)
		if (result) neighbours.push([label, ...result])
	}
	return neighbours
}

const isNeighbour = (piece, neighbour) => {
	const pieceSides = getSides(piece)
	const neighbourSides = getSides(neighbour)
	const result = hasEqualSide(pieceSides, neighbourSides)
	if (result) return [0, 0]
	return false
}

const edgeMap = {}
const hasEqualSide = (a, b) => {
	let result = false
	for (const sideA of a) {
		if (edgeMap[sideA.join("")] === undefined) edgeMap[sideA.join("")] = true
		for (const sideB of b) {
			if (edgeMap[sideB.join("")] === undefined) edgeMap[sideB.join("")] = true
			if (isEqualSide(sideA, sideB)) {
				edgeMap[sideA.join("")] = false
				edgeMap[sideB.join("")] = false
				result = true
			}
		}
	}
	return result
}
const isEqualSide = (a, b) => a.every((v, i) => v === b[i]) || a.reversed.every((v, i) => v === b[i])

const CORNERS = {
	BL: [0,0],
	BR: [1, 0],
	TR: [1, 1],
	TL: [0, 1],
}

const SIDES = {
	BOTTOM: [CORNERS.BL, CORNERS.BR],
	RIGHT: [CORNERS.BR, CORNERS.TR],
	TOP: [CORNERS.TR, CORNERS.TL],
	LEFT: [CORNERS.TL, CORNERS.BL],
}


const BOTTOM = 0
const RIGHT = 1
const TOP = 2
const LEFT = 3

const getSides = (piece) => {
	const pieceSides = []
	for (let side of SIDES) {
		const pieceSide = []
		const [[lx, ly], [rx, ry]] = side
		const [dx, dy] = [rx-lx, ry-ly]
		const [sx, sy] = [lx*(PIECE_SIZE-1), ly*(PIECE_SIZE-1)]
		
		let [x, y] = [sx, sy]
		while (x >= 0 && x < PIECE_SIZE && y < PIECE_SIZE && y >= 0) {
			pieceSide.push(piece[y][x])
			x += dx
			y += dy
		}
		pieceSides.push(pieceSide)
	}
	return pieceSides
}

const transformPiece = (piece, transformation, max=PIECE_SIZE) => {
	const transformedPiece = []
	let [lx, ly] = [Infinity, Infinity]
	for (let y = 0; y < max; y++) {
		for (let x = 0; x < max; x++) {
			const [tx, ty] = transformation(x, y)
			if (transformedPiece[ty] === undefined) transformedPiece[ty] = []
			transformedPiece[ty][tx] = piece[y][x]
			lx = Math.min(lx, tx)
			ly = Math.min(ly, ty)
		}
	}
	
	const normalisedPiece = []
	for (let y = ly; y < ly + max; y++) {
		const dy = y - ly
		normalisedPiece[dy] = []
		for (let x = lx; x < lx + max; x++) {
			const dx = x - lx
			normalisedPiece[dy][dx] = transformedPiece[y][x]
		}
	}
	
	return normalisedPiece
}

const [neighbourMap, transformationMap] = getNeighbourMap(pieces)

const corners = Object.entries(neighbourMap).filter(([l, ns]) => ns.length === 2).map(n => n[0])

const placed = []
for (let y = 0; y < PUZZLE_SIZE; y++) {
	placed[y] = []
	for (let x = 0; x < PUZZLE_SIZE; x++) {
		placed[y][x] = undefined
	}
}
const placedTrans = []
for (let y = 0; y < PUZZLE_SIZE; y++) {
	placedTrans[y] = []
	for (let x = 0; x < PUZZLE_SIZE; x++) {
		placedTrans[y][x] = undefined
	}
}

const corner = corners[0]
const remaining = [corner]


const EDGE = ["="].repeated(10)

const getAvailableSides = ([x, y], placed) => {

	if (placed[y][x] !== undefined) return false

	const sides = []
	if (x === 0) sides[LEFT] = EDGE
	else sides[LEFT] = placed[y][x-1]
	
	if (x === PUZZLE_SIZE-1) sides[RIGHT] = EDGE
	else sides[RIGHT] = placed[y][x+1]
	
	if (y === 0) sides[TOP] = EDGE
	else sides[TOP] = placed[y-1][x]
	
	if (y === PUZZLE_SIZE-1) sides[BOTTOM] = EDGE
	else sides[BOTTOM] = placed[y+1][x]
	
	return sides
}

const findDefinitePlace = (piece, placed) => {
	
	const neighbours = neighbourMap[piece]
	const ns = [...neighbours]
	while (ns.length < 4) ns.push(EDGE)
	
	let position = undefined
	
	for (let y = 0; y < PUZZLE_SIZE; y++) {
		for (let x = 0; x < PUZZLE_SIZE; x++) {
			const as = getAvailableSides([x, y], placed)
			if (!as) continue
			const matches = countNeighbourMatches(as, ns)
			if (matches >= 2) {
				position = [x, y]
				break
			}
		}
		if (position !== undefined) break
	}
	
	return position
}

const countNeighbourMatches = (availables, neighbours) => {
	const as = [...availables]
	let tally = 0
	for (const n in neighbours) {
		const neighbour = neighbours[n]
		const index = as.indexOf(neighbour)
		if (index !== -1) {
			tally++
			as[index] = undefined
		}
	}
	return tally
}

const dones = {}
const placeNextPiece = (placed, remaining) => {
	for (const i in remaining) {
		const piece = remaining[i]
		if (piece === undefined) continue
		const place = findDefinitePlace(piece, placed)
		if (place !== undefined) {
			const [x, y] = place
			placed[y][x] = piece
			let trans = undefined
			for (const t in TRANSFORMATIONS) {
				placedTrans[y][x] = t
				const score = doubleTripleCheck([x, y])
				if (score >= 4) {
					trans = t
					break
				}
			}
			
			if (trans !== undefined) {
				//print(`Piece ${piece} placed at`, [x, y], `with transformation`, TRANSFORMATIONS[trans])
				remaining[i] = undefined
				dones[piece] = true
				const neighbours = neighbourMap[piece].forEach(n => {
					if (dones[n] != true) remaining.push(n)
				})
				break
			}
			
			else {
				//print(`I don't know where to place piece ${piece}`)
				placedTrans[y][x] = 0
				placed[y][x] = undefined
				remaining[i] = undefined
				remaining.push(piece)
				break
			}
		}
	}
}

const doubleTripleCheck = ([x, y]) => {
	const mySides = getPlacedSides([x, y])
	
	const top = getPlacedSides([x, y-1])[TOP].reversed.join("")
	const bottom = getPlacedSides([x, y+1])[BOTTOM].join("")
	const left = getPlacedSides([x-1, y])[RIGHT].reversed.join("")
	const right = getPlacedSides([x+1, y])[LEFT].reversed.join("")
	
	let tally = 0
	
	const myTop = mySides[BOTTOM].join("")
	const myBottom = mySides[TOP].join("")
	const myRight = mySides[RIGHT].join("")
	const myLeft = mySides[LEFT].join("")
	
	if (myTop === top) tally++
	if (myBottom === bottom) tally++
	if (myRight === right) tally++
	if (myLeft === left) tally++
	
	if (top === UNPLACED.join("")) tally++
	if (bottom === UNPLACED.join("")) tally++
	if (right === UNPLACED.join("")) tally++
	if (left === UNPLACED.join("")) tally++
	
	//;[myTop, myBottom, myRight, myLeft].d
	//;[top, bottom, right, left].d
	
	//print(tally)
	//if (tally === 4) print("Match found!")
	
	//if (mySides[TOP] === EDGE) tally--
	//if (mySides[BOTTOM] === EDGE) tally--
	//if (mySides[RIGHT] === EDGE) tally--
	//if (mySides[LEFT] === EDGE) tally--
	
	return tally
}

const markEdges = (sides) => {
	const esides = []
	for (const side of sides) {
		if (edgeMap[side.join("")] === true || edgeMap[side.reversed.join("")] === true) esides.push(EDGE)
		else esides.push(side)
	}
	return esides
}

const UNPLACED = ["x"].repeated(PIECE_SIZE)
const getPlacedSides = ([x, y]) => {
	if (x < 0 || x >= PUZZLE_SIZE || y < 0 || y >= PUZZLE_SIZE) return [EDGE, EDGE, EDGE, EDGE]
	if (placed[y] === undefined) return [UNPLACED, UNPLACED, UNPLACED, UNPLACED]
	if (placed[y][x] === undefined) return [UNPLACED, UNPLACED, UNPLACED, UNPLACED]
	const piece = placed[y][x]
	const pic = pieces[piece]
	const t = placedTrans[y][x]
	const tpic = transformPiece(pic, TRANSFORMATIONS[t])
	const sides = getSides(tpic)
	const esides = markEdges(sides)
	return esides
}

const isReallyFinished = () => {
	let result = [true, 0, 0]
	for (let y = 0; y < PUZZLE_SIZE; y++) {
		for (let x = 0; x < PUZZLE_SIZE; x++) {
			if (!doubleTripleCheck([x, y], threshold)) {
				return [false, x, y]
			}
			//return [false, x, y]
		}
	}
	
	/*if (result[0]) {
		threshold++
		print("Threshold increased to", threshold)
		return [false]
	}*/
	
	return result
}

const getShaved = (pic) => {
	const shaved = []
	for (let y = 0; y < PIECE_SIZE; y++) {
		if (y === 0 || y === PIECE_SIZE-1) continue
		shaved.push([])
		for (let x = 0; x < PIECE_SIZE; x++) {
			if (x === 0 || x === PIECE_SIZE-1) continue
			shaved.last.push(pic[y][x])
		}
	}
	return shaved
}

const tickPlace = () => {
	if (!remaining.every(r => r === undefined)) {
		placeNextPiece(placed, remaining)
		updateMap()
		drawMap()
		setTimeout(tickPlace, 0)
	}
	else {
		//tickTransform()
	}
}

let T = 0
const nextTransformation = () => {
	const ts = T.toString(8).split("").map(t => t.as(Number))
	for (let i = 0; i < ts.length; i++) {
		const y = Math.floor(i / PUZZLE_SIZE)
		const x = (i % PUZZLE_SIZE)
		placedTrans[y][x] = ts[i]
	} 
	T++
}

let c = 0
const tickTransform = () => {
	
	const [result, x, y] = isReallyFinished()
	
	nextTransformation()
	
	c++
	if (!result) { 
		if (c % 200 === 0) {
			updateMap()
			drawMap()
			requestAnimationFrame(tickTransform)
		}
		else tickTransform()
	}
}

const map = []
for (let y = 0; y < PIECE_SIZE * PUZZLE_SIZE; y++) {
	map[y] = []
	for (let x = 0; x < PIECE_SIZE * PUZZLE_SIZE; x++) {
		map[y][x] = undefined
	}
}

const drawMap = () => {
	pre.innerHTML = ""
	for (let y = 0; y < PIECE_SIZE * PUZZLE_SIZE; y++) {
		for (let x = 0; x < PIECE_SIZE * PUZZLE_SIZE; x++) {
			pre.innerHTML += map[y][x]? map[y][x] : " "
			if (((x + 1) % PIECE_SIZE) === 0) pre.innerHTML += "  "
		}
		pre.innerHTML += "\n"
		if (((y + 1) % PIECE_SIZE) === 0) pre.innerHTML += "\n"
	}
}

const pre = HTML`<pre></pre>`
document.body.appendChild(pre)

const updateMap = () => {
	for (let y = 0; y < PUZZLE_SIZE; y++) {
		for (let x = 0; x < PUZZLE_SIZE; x++) {
			const piece = placed[y][x]
			if (pieces[piece] === undefined) continue
			const tpiece = transformPiece(pieces[piece], TRANSFORMATIONS[placedTrans[y][x]])
			for (let sy = 0; sy < PIECE_SIZE; sy++) {
				for (let sx = 0; sx < PIECE_SIZE; sx++) {
					map[y*PIECE_SIZE + sy][x*PIECE_SIZE + sx] = tpiece[sy][sx]
				}
			}
		}
	}
}

tickPlace()



