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
Column :: Tree | Space
Tree :: "#"
Space :: "."
`

const pieces = tiles.map(t => TERM.Tile(t).output).reduce((a,b) => ({...a, ...b}))
print("Number of Pieces: ", Object.values(pieces).length)

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
const PUZZLE_SIZE = Math.sqrt(pieces.length)

const getNeighbourMap = (pieces) => {
	const neighbourMap = {}
	let t = 0
	for (let label in pieces) {
		const piece = pieces[label]
		const neighbours = getNeighbours(piece, pieces)
		neighbourMap[label] = neighbours
		print(`Piece ${t} neighbours: `, neighbours.length)
		t++
	}
	return neighbourMap
}

const getNeighbours = (piece, pieces) => {
	const neighbours = []
	for (let label in pieces) {
		const neighbour = pieces[label]
		if (neighbour === piece) continue
		const result = isNeighbour(piece, neighbour)
		if (result) neighbours.push(label)
	}
	return neighbours
}

const isNeighbour = (piece, neighbour) => {
	for (let pieceTransformation of TRANSFORMATIONS) {
		const transformedPiece = transformPiece(piece, pieceTransformation)
		const pieceSides = getSides(transformedPiece)
		for (let neighbourTransformation of TRANSFORMATIONS) {
			const transformedNeighbour = transformPiece(neighbour, neighbourTransformation)
			const neighbourSides = getSides(transformedNeighbour)
			const result = hasEqualSide(pieceSides, neighbourSides)
			if (result) return true
		}
	}
	return false
}

const hasEqualSide = (a, b) => {
	for (const sideA of a) {
		for (const sideB of b) {
			if (isEqualSide(sideA, sideB)) return true
		}
	}
	return false
}
const isEqualSide = (a, b) => a.every((v, i) => v === b[i])

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

const transformPiece = (piece, transformation) => {
	const transformedPiece = []
	let [lx, ly] = [Infinity, Infinity]
	for (let y = 0; y < PIECE_SIZE; y++) {
		for (let x = 0; x < PIECE_SIZE; x++) {
			const [tx, ty] = transformation(x, y)
			if (transformedPiece[ty] === undefined) transformedPiece[ty] = []
			transformedPiece[ty][tx] = piece[y][x]
			lx = Math.min(lx, tx)
			ly = Math.min(ly, ty)
		}
	}
	
	const normalisedPiece = []
	for (let y = ly; y < ly + PIECE_SIZE; y++) {
		const dy = y - ly
		normalisedPiece[dy] = []
		for (let x = lx; x < lx + PIECE_SIZE; x++) {
			const dx = x - lx
			normalisedPiece[dy][dx] = transformedPiece[y][x]
		}
	}
	
	return normalisedPiece
}

const neighbourMap = getNeighbourMap(pieces)

const corners = Object.entries(neighbourMap).filter(([l, ns]) => ns.length === 2).map(n => n[0])

corners.reduce((a,b) => a*b).d
